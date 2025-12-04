import mongoose from "mongoose";
import NotificationModel from "./notification.schema.js";

class NotificationRepository {
    async createNotification(notificationData) {
        try {
            const notification = new NotificationModel(notificationData);
            await notification.save();
            return notification;
        } catch (error) {
            throw error;
        }
    }

    async getUserNotifications(userId) {
        try {
            const notifications = await NotificationModel.find({ userId })
                .sort({ createdAt: -1 })
                .limit(50);
            return notifications;
        } catch (error) {
            throw error;
        }
    }

    async getUnreadCount(userId) {
        try {
            const count = await NotificationModel.countDocuments({
                userId,
                isRead: false,
            });
            return count;
        } catch (error) {
            throw error;
        }
    }

    async markAsRead(notificationId) {
        try {
            const notification = await NotificationModel.findByIdAndUpdate(
                notificationId,
                { isRead: true },
                { new: true }
            );
            return notification;
        } catch (error) {
            throw error;
        }
    }

    async markAllAsRead(userId) {
        try {
            // Ensure userId is an ObjectId
            const userObjectId = new mongoose.Types.ObjectId(userId);

            const result = await NotificationModel.updateMany(
                { userId: userObjectId },
                { $set: { isRead: true } }
            );
            return result;
        } catch (error) {
            throw error;
        }
    }
}

export default NotificationRepository;
