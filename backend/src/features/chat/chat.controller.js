import Chat from "./chat.model.js";

export const getMessages = async (req, res) => {
    const { relationId } = req.params;
    try {
        const messages = await Chat.find({ relationId }).sort({ createdAt: 1 });
        res.status(200).json({ messages });
    } catch (error) {
        res.status(500).json({ message: "Error fetching messages", error });
    }
};

export const saveMessage = async (relationId, senderId, message) => {
    try {
        const newMessage = new Chat({ relationId, senderId, message });
        await newMessage.save();
        return newMessage;
    } catch (error) {
        console.error("Error saving message:", error);
        throw error;
    }
};

export const getUnreadCount = async (req, res) => {
    const { relationId, userId } = req.params;
    try {
        const count = await Chat.countDocuments({
            relationId,
            senderId: { $ne: userId },
            isRead: false,
        });
        res.status(200).json({ count });
    } catch (error) {
        res.status(500).json({ message: "Error fetching unread count", error });
    }
};

export const markAsRead = async (req, res) => {
    const { relationId, userId } = req.body;
    try {
        await Chat.updateMany(
            { relationId, senderId: { $ne: userId }, isRead: false },
            { $set: { isRead: true } }
        );
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ message: "Error marking messages as read", error });
    }
};
