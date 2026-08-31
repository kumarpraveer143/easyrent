import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: Number,
    },
    address: {
      street: {
        type: String,
        required: true,
        trim: true,
      },
      city: {
        type: String,
        required: true,
        trim: true,
      },
      state: {
        type: String,
        required: true,
        trim: true,
      },

      zipCode: {
        type: String,
        required: true,
        trim: true,
        match: [/^\d{6}$/, "Please fill a valid 6-digit ZIP code"],
      },
    },

    rentPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    roomType: {
      type: String,
      required: true,
      enum: ["single", "shared", "studio", "apartment", "house"],
    },

    numberOfRooms: {
      type: Number,
      required: true,
      min: 1,
    },

    numberOfBathrooms: {
      type: Number,
      required: true,
      min: 1,
    },

    // photos: {
    //   type: [String], // URLs to images
    //   default: [],
    // },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

RoomSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Search is "available rooms in this city/state" — without these it was a
// full collection scan on every query.
RoomSchema.index({ isAvailable: 1, "address.state": 1, "address.city": 1 });
RoomSchema.index({ owner: 1 });
RoomSchema.index({ rentPrice: 1 });

export default RoomSchema;
