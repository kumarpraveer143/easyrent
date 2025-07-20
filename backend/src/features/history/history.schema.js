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
  },
  {
    timestamps: true,
  }
);

export default HistorySchema;
