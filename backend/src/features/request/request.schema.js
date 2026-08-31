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

requestSchema.index({ roomId: 1, status: 1 });
// One application per renter per room.
requestSchema.index({ renterId: 1, roomId: 1 }, { unique: true });

export default requestSchema;
