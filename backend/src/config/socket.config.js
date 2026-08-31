import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { saveMessage } from "../features/chat/chat.controller.js";
import { Relationship } from "../models/index.js";

let io;
const userSockets = new Map(); // userId -> Set<socketId>

/**
 * The socket layer had no authentication of any kind.
 *
 *  - `register` accepted ANY userId, so connecting and registering as someone
 *    else's id silently redirected their real-time notifications to you.
 *  - `join_chat` accepted any relationId, so you could sit in any tenancy's
 *    private conversation.
 *  - `send_message` took `senderId` from the payload, so you could post as
 *    anyone.
 *
 * Identity now comes from the same signed JWT the HTTP API uses, read from the
 * handshake. The client no longer tells us who it is.
 */

/** Minimal cookie-header read — avoids pulling in a parser for one field. */
function readCookie(header, name) {
  if (!header) return undefined;
  for (const part of header.split(";")) {
    const eq = part.indexOf("=");
    if (eq === -1) continue;
    if (part.slice(0, eq).trim() === name) {
      return decodeURIComponent(part.slice(eq + 1).trim());
    }
  }
  return undefined;
}

function identify(socket) {
  // Cookie first (the browser sends it automatically with withCredentials),
  // then an explicit auth token for non-browser clients.
  const fromCookie = readCookie(socket.handshake.headers?.cookie, "token");
  const token = fromCookie ?? socket.handshake.auth?.token;
  if (!token) return null;

  try {
    return jwt.verify(token, process.env.SECRET_KEY).id;
  } catch {
    return null;
  }
}

export const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: [
                "http://localhost:5173",
                "https://easyrentify.xyz",
                "https://www.easyrentify.xyz",
                process.env.FRONTEND_URL,
            ].filter(Boolean),
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    // Reject unauthenticated connections at the handshake, before any event.
    io.use((socket, next) => {
        const userId = identify(socket);
        if (!userId) return next(new Error("unauthorized"));
        socket.userId = userId;
        next();
    });

    io.on("connection", (socket) => {
        // Registration is implicit and derived from the token — there is no
        // longer a "register" event a client can lie to.
        const set = userSockets.get(socket.userId) ?? new Set();
        set.add(socket.id);
        userSockets.set(socket.userId, set);

        // A user may have several tabs open; each gets its own room.
        socket.join(`user:${socket.userId}`);

        socket.on("join_chat", async (relationId) => {
            try {
                const rel = await Relationship.findById(relationId);
                if (!rel) return;
                const isParty =
                    rel.ownerId?.toString() === socket.userId ||
                    rel.renterId?.toString() === socket.userId;
                if (!isParty) return; // Not your conversation.
                socket.join(String(relationId));
            } catch {
                // A malformed id is not worth tearing the socket down for.
            }
        });

        socket.on("send_message", async (data) => {
            const { relationId, message } = data ?? {};
            if (!relationId || !message) return;

            try {
                const rel = await Relationship.findById(relationId);
                if (!rel) return;
                const isParty =
                    rel.ownerId?.toString() === socket.userId ||
                    rel.renterId?.toString() === socket.userId;
                if (!isParty) return;

                // senderId comes from the token, never from the payload.
                const saved = await saveMessage(relationId, socket.userId, message);
                io.to(String(relationId)).emit("receive_message", saved);
            } catch (error) {
                console.error("Error sending message:", error);
            }
        });

        socket.on("disconnect", () => {
            const sockets = userSockets.get(socket.userId);
            if (!sockets) return;
            sockets.delete(socket.id);
            if (sockets.size === 0) userSockets.delete(socket.userId);
        });
    });

    return io;
};

/** Emit to every tab a user has open. */
export const emitToUser = (userId, eventName, data) => {
    if (!io || !userId) return false;
    io.to(`user:${String(userId)}`).emit(eventName, data);
    return userSockets.has(String(userId));
};

export const getIO = () => io;
