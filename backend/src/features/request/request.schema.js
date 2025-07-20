import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    renterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    status: {
      type: String,
      enum: ["accepted", "rejected", "pending"],
      default: "pending",
      required: true,
    },
  },
  { timestamps: true }
);

export default requestSchema;
