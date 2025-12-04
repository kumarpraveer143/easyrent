import express from "express";
import jwtAuth from "../../middleware/jwtAuth.js";
import NotificationController from "./notification.controller.js";

const notificationRouter = express.Router();

const notificationController = new NotificationController();

// Get all notifications for the logged-in user
notificationRouter.get("/", jwtAuth, (req, res) => {
    notificationController.getNotifications(req, res);
});

// Get unread notification count
notificationRouter.get("/unread", jwtAuth, (req, res) => {
    notificationController.getUnreadCount(req, res);
});

// Mark all notifications as read
notificationRouter.patch("/read-all", jwtAuth, (req, res) => {
    notificationController.markAllAsRead(req, res);
});

// Mark a notification as read
notificationRouter.patch("/:id/read", jwtAuth, (req, res) => {
    notificationController.markAsRead(req, res);
});

export default notificationRouter;
