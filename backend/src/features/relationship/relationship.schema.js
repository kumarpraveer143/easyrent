import mongoose from "mongoose";

const relationshipSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },

    renterId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },

    roomId: {
      type: mongoose.Types.ObjectId,
      ref: "Room",
      required: true,
    },

    status: {
      type: String,
      required: true,
      enum: ["active", "archive"],
      default: "active",
    },
    
    historyId: {
      type: mongoose.Types.ObjectId,
      ref: "History",
    },
  },
  {
    timestamps: true,
  }
);

export default relationshipSchema;
