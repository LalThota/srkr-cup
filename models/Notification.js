const mongoose = require("mongoose")

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["lost-found", "notes", "user", "approval", "rejection", "system", "marketplace"],
      default: "system",
    },
    read: {
      type: Boolean,
      default: false,
    },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
    },
  },
  {
    timestamps: true,
  },
)

// Index for better performance
notificationSchema.index({ userId: 1, read: 1 })
notificationSchema.index({ createdAt: -1 })

module.exports = mongoose.model("Notification", notificationSchema)
