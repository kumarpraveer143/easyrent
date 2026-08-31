import Chat from "./chat.model.js";

/**
 * The actor is always `req.userId` (from the signed token). These handlers
 * used to take `userId` from the URL or the request body, so anyone could ask
 * "how many messages has X not read" or mark another person's messages read.
 */

export const getMessages = async (req, res) => {
    const { relationId } = req.params;
    try {
        const messages = await Chat.find({ relationId }).sort({ createdAt: 1 });
        res.status(200).json({ messages });
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ success: false, message: "Couldn't load messages." });
    }
};

export const saveMessage = async (relationId, senderId, message) => {
    const newMessage = new Chat({ relationId, senderId, message });
    await newMessage.save();
    return newMessage;
};

export const getUnreadCount = async (req, res) => {
    const { relationId } = req.params;
    try {
        const count = await Chat.countDocuments({
            relationId,
            senderId: { $ne: req.userId },
            isRead: false,
        });
        res.status(200).json({ count });
    } catch (error) {
        console.error("Error fetching unread count:", error);
        res.status(500).json({ success: false, message: "Couldn't load the unread count." });
    }
};

export const markAsRead = async (req, res) => {
    const { relationId } = req.body;
    try {
        await Chat.updateMany(
            { relationId, senderId: { $ne: req.userId }, isRead: false },
            { $set: { isRead: true } }
        );
        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Error marking messages as read:", error);
        res.status(500).json({ success: false, message: "Couldn't mark messages as read." });
    }
};
