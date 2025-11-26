import { Server } from "socket.io";
import { saveMessage } from "../features/chat/chat.controller.js";

let io;
const userSockets = new Map(); // Map to store userId -> socketId

export const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: ["https://easyrent-red.vercel.app", "http://localhost:5173"],
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        console.log("New client connected:", socket.id);

        // Store user's socket ID when they connect
        socket.on("register", (userId) => {
            userSockets.set(userId, socket.id);
            console.log(`User ${userId} registered with socket ${socket.id}`);
        });

        // Join a chat room
        socket.on("join_chat", (relationId) => {
            socket.join(relationId);
            console.log(`Socket ${socket.id} joined room ${relationId}`);
        });

        // Handle sending messages
        socket.on("send_message", async (data) => {
            const { relationId, senderId, message } = data;
            try {
                // Save message to database
                const savedMessage = await saveMessage(relationId, senderId, message);

                // Emit to the room
                io.to(relationId).emit("receive_message", savedMessage);
            } catch (error) {
                console.error("Error sending message:", error);
            }
        });

        // Handle disconnection
        socket.on("disconnect", () => {
            // Remove user from the map
            for (const [userId, socketId] of userSockets.entries()) {
                if (socketId === socket.id) {
                    userSockets.delete(userId);
                    console.log(`User ${userId} disconnected`);
                    break;
                }
            }
        });
    });

    return io;
};

// Function to emit notification to a specific user
export const emitToUser = (userId, eventName, data) => {
    const socketId = userSockets.get(userId);
    if (socketId && io) {
        io.to(socketId).emit(eventName, data);
        console.log(`Emitted ${eventName} to user ${userId}`);
        return true;
    }
    console.log(`User ${userId} not connected`);
    return false;
};

export const getIO = () => io;
