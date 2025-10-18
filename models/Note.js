const mongoose = require("mongoose")

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    semester: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
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
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    fileName: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
    dateUploaded: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
)

// Index for better performance
noteSchema.index({ status: 1 })
noteSchema.index({ userId: 1 })
noteSchema.index({ subject: 1 })
noteSchema.index({ semester: 1 })
noteSchema.index({ dateUploaded: -1 })

module.exports = mongoose.model("Note", noteSchema)
