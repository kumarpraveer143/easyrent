import mongoose from "mongoose";

const favouriteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    roomId: {
      type: mongoose.Schema.ObjectId,
      ref: "Room",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Nothing stopped the same room being favourited twice by one user.
favouriteSchema.index({ userId: 1, roomId: 1 }, { unique: true });

export default favouriteSchema;
