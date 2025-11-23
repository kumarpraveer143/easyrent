import NotificationRepository from "./notification.repository.js";

class NotificationController {
    constructor() {
        this.notificationRepository = new NotificationRepository();
    }

    async getNotifications(req, res) {
        const userId = req.userId;
        try {
            const notifications = await this.notificationRepository.getUserNotifications(userId);
            return res.status(200).json({
                success: true,
                notifications,
            });
        } catch (error) {
            console.error("Error fetching notifications:", error);
            return res.status(500).json({
                success: false,
                message: "Failed to fetch notifications",
            });
        }
    }

    async getUnreadCount(req, res) {
        const userId = req.userId;
        try {
            const count = await this.notificationRepository.getUnreadCount(userId);
            return res.status(200).json({
                success: true,
                count,
            });
        } catch (error) {
            console.error("Error fetching unread count:", error);
            return res.status(500).json({
                success: false,
                message: "Failed to fetch unread count",
            });
        }
    }

    async markAsRead(req, res) {
        const { id } = req.params;
        try {
            const notification = await this.notificationRepository.markAsRead(id);
            return res.status(200).json({
                success: true,
                notification,
            });
        } catch (error) {
            console.error("Error marking notification as read:", error);
            return res.status(500).json({
                success: false,
                message: "Failed to mark notification as read",
            });
        }
    }

    async markAllAsRead(req, res) {
        const userId = req.userId;
        try {
            await this.notificationRepository.markAllAsRead(userId);
            return res.status(200).json({
                success: true,
                message: "All notifications marked as read",
            });
        } catch (error) {
            console.error("Error marking all notifications as read:", error);
            return res.status(500).json({
                success: false,
                message: "Failed to mark all notifications as read",
            });
        }
    }
}

export default NotificationController;
