import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import connectToMongoose from "./src/config/mongoose.config.js";
import cors from "cors";
import { createServer } from "http";
import { initializeSocket } from "./src/config/socket.config.js";
import userRouter from "./src/features/users/user.route.js";
import roomRouter from "./src/features/rooms/room.route.js";
import historyRouter from "./src/features/history/history.route.js";
import favouriteRouter from "./src/features/favourite/favourite.route.js";
import requestRouter from "./src/features/request/request.router.js";
import relationshipRouter from "./src/features/relationship/relationship.router.js";
import searchRoomRouter from "./src/features/searchRooms/searchRooms.route.js";
import notificationRouter from "./src/features/notification/notification.route.js";
dotenv.config();

const app = express();
const server = createServer(app);

// Initialize Socket.IO
initializeSocket(server);

const corsOptions = {
  origin: ["https://easyrent-red.vercel.app", "http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

const port = process.env.PORT;

app.get("/get/user", (req, res) => {
  res.json({ message: "Bakend is working properly!" });
});

//Middlewares

app.use(bodyParser.json());
app.use(cookieParser());
app.use("/api/users", userRouter);
app.use("/api/rooms", roomRouter);
app.use("/api/history", historyRouter);
app.use("/api/favourite", favouriteRouter);
app.use("/api/request", requestRouter);
app.use("/api/relationship", relationshipRouter);
app.use("/api/search", searchRoomRouter);
app.use("/api/notifications", notificationRouter);

server.listen(port, () => {
  connectToMongoose();
  console.log("Server is up at the port ", port);
});
