import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import { createServer } from "http";

dotenv.config();

import connectToMongoose from "./src/config/mongoose.config.js";
import { initializeSocket } from "./src/config/socket.config.js";

// Register every model in one place, before any router imports a repository.
// (Model names used to be declared ad-hoc across seven files, with four of
// them dangling — see src/models/index.js.)
import "./src/models/index.js";

import { apiLimiter } from "./src/middleware/rateLimit.js";
import userRouter from "./src/features/users/user.route.js";
import roomRouter from "./src/features/rooms/room.route.js";
import historyRouter from "./src/features/history/history.route.js";
import favouriteRouter from "./src/features/favourite/favourite.route.js";
import requestRouter from "./src/features/request/request.router.js";
import relationshipRouter from "./src/features/relationship/relationship.router.js";
import searchRoomRouter from "./src/features/searchRooms/searchRooms.route.js";
import notificationRouter from "./src/features/notification/notification.route.js";
import paymentRouter from "./src/features/payment/payment.route.js";
import chatRouter from "./src/features/chat/chat.route.js";

const app = express();
const server = createServer(app);

initializeSocket(server);

app.set("trust proxy", 1);

// There were no security headers of any kind. CSP is left off for now because
// the SPA is served separately; the rest (HSTS, nosniff, frameguard, referrer
// policy) applies immediately.
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

const allowedOrigins = [
  "http://localhost:5173",
  "https://easyrent-nu.vercel.app",
  "https://easyrentify.xyz",
  "https://www.easyrentify.xyz",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Stripe webhooks need the raw body for signature verification, so they must
// bypass the JSON parser.
app.use((req, res, next) => {
  if (req.originalUrl.startsWith("/api/payment/webhook")) return next();
  bodyParser.json({ limit: "1mb" })(req, res, next);
});

app.use(cookieParser());

/**
 * Health check that actually checks something. `GET /` used to return the
 * string "working fine" without touching the database, so it stayed green
 * while every request 500'd on a dead connection.
 */
app.get("/health", async (req, res) => {
  const mongoose = (await import("mongoose")).default;
  const states = ["disconnected", "connected", "connecting", "disconnecting"];
  const state = states[mongoose.connection.readyState] ?? "unknown";
  const ok = mongoose.connection.readyState === 1;
  res.status(ok ? 200 : 503).json({ ok, database: state, uptime: process.uptime() });
});

app.use("/api", apiLimiter);

app.use("/api/users", userRouter);
app.use("/api/rooms", roomRouter);
app.use("/api/history", historyRouter);
app.use("/api/favourite", favouriteRouter);
app.use("/api/request", requestRouter);
app.use("/api/relationship", relationshipRouter);
app.use("/api/search", searchRoomRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/chat", chatRouter);

// Unknown API routes get JSON, not an HTML error page.
app.use("/api", (req, res) => {
  res.status(404).json({ success: false, message: "Not found." });
});

// One error shape for the whole API. Roughly forty handlers each hand-rolled
// their own try/catch response; this is the backstop for anything that throws.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(err.status ?? 500).json({
    success: false,
    message: "Something went wrong. Please try again.",
  });
});

const port = process.env.PORT ?? 3000;

/**
 * The server used to call listen() first and connect to Mongo inside the
 * callback, swallowing any connection error — so it happily accepted traffic
 * with no database and served 500s. Connect first, then listen.
 */
const start = async () => {
  try {
    await connectToMongoose();
  } catch (err) {
    console.error("Could not connect to MongoDB — refusing to start.", err.message);
    process.exit(1);
  }
  server.listen(port, () => console.log(`Server listening on port ${port}`));
};

start();
