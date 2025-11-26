import express from "express";
import { getMessages, getUnreadCount, markAsRead } from "./chat.controller.js";

const chatRouter = express.Router();

chatRouter.get("/:relationId", getMessages);
chatRouter.get("/unread/:relationId/:userId", getUnreadCount);
chatRouter.post("/read", markAsRead);

export default chatRouter;
