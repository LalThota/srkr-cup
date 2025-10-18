const mongoose = require("mongoose")

const marketplaceItemSchema = new mongoose.Schema(
  {
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
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    contact: {
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
    image: {
      type: String, // URL to uploaded image
    },
    status: {
      type: String,
      enum: ["active", "sold", "inactive"],
      default: "active",
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
marketplaceItemSchema.index({ status: 1 })
marketplaceItemSchema.index({ userId: 1 })
marketplaceItemSchema.index({ datePosted: -1 })
marketplaceItemSchema.index({ price: 1 })

module.exports = mongoose.model("MarketplaceItem", marketplaceItemSchema)
