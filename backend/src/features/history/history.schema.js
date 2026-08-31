import mongoose from "mongoose";

const { Schema } = mongoose;

const HistorySchema = new Schema(
  {
    relationId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Relationship",
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

// Idempotency for online payments: a Stripe retry (or the old double-write
// between verifyPayment and the webhook) can never create a second row.
// `sparse` so the many cash/offline records with a null id don't collide.
HistorySchema.index({ stripeSessionId: 1 }, { unique: true, sparse: true });

// Every payment read is "the ledger for this tenancy, newest first".
HistorySchema.index({ relationId: 1, date: -1 });

export default HistorySchema;
