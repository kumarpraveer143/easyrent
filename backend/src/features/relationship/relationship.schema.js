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
  },
  {
    timestamps: true,
  }
);

relationshipSchema.index({ ownerId: 1, status: 1 });
relationshipSchema.index({ renterId: 1, status: 1 });

// A room can have at most ONE active tenancy. Nothing enforced this, so two
// concurrent accepts both succeeded and the room was let twice.
relationshipSchema.index(
  { roomId: 1 },
  { unique: true, partialFilterExpression: { status: "active" } }
);

export default relationshipSchema;
