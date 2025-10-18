const mongoose = require("mongoose")

const lostItemSchema = new mongoose.Schema(
  {
    itemType: {
      type: String,
      required: true,
      enum: ['lost', 'found'],
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userContact: {
      type: String,
      required: true,
      match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit mobile number'],
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    image: {
      type: String, // URL to uploaded image
    },
    datePosted: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
)

// Index for better performance
lostItemSchema.index({ status: 1 })
lostItemSchema.index({ userId: 1 })
lostItemSchema.index({ datePosted: -1 })

module.exports = mongoose.model("LostItem", lostItemSchema)
