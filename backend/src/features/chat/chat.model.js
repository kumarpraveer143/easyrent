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

chatSchema.index({ relationId: 1, createdAt: 1 });

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;
