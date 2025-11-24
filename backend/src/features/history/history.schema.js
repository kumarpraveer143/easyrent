import mongoose from "mongoose";

const { Schema } = mongoose;

const HistorySchema = new Schema(
  {
    relationId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Relation",
    },

    rentPaid: {
      type: Number,
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["Cash", "Online", "other"],
      default: "other",
    },
    remarks: {
      type: String,
      maxlength: 500,
    },

    // NEW: Stripe payment fields
    stripeSessionId: {
      type: String,
      default: null,
    },

    stripePaymentIntentId: {
      type: String,
      default: null,
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "completed",
    },
  },
  {
    timestamps: true,
  }
);

export default HistorySchema;
