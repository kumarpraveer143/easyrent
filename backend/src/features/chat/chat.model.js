import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
    {
        relationId: {
            type: mongoose.Types.ObjectId,
            ref: "Relationship",
            required: true,
        },
        senderId: {
            type: mongoose.Types.ObjectId,
            ref: "User",
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        isRead: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;
