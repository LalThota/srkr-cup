const express = require("express")
const router = express.Router()
const Notification = require("../models/Notification")
const auth = require("../middleware/auth")

// @route   GET /api/notifications
// @desc    Get all notifications for user
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(50)

    res.json(notifications)
  } catch (error) {
    console.error("Error fetching notifications:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   GET /api/notifications/unread
// @desc    Get unread notifications count
// @access  Private
router.get("/unread", auth, async (req, res) => {
  try {
    const unreadNotifications = await Notification.find({
      userId: req.user._id,
      read: false,
    })

    res.json(unreadNotifications)
  } catch (error) {
    console.error("Error fetching unread notifications:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   POST /api/notifications
// @desc    Create notification
// @access  Private
router.post("/", auth, async (req, res) => {
  try {
    const { message, type, itemId } = req.body

    const notification = new Notification({
      userId: req.user._id,
      message,
      type,
      itemId,
    })

    await notification.save()
    res.status(201).json(notification)
  } catch (error) {
    console.error("Error creating notification:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   POST /api/notifications/:id/read
// @desc    Mark notification as read
// @access  Private
router.post("/:id/read", auth, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { read: true },
      { new: true },
    )

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" })
    }

    res.json(notification)
  } catch (error) {
    console.error("Error marking notification as read:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   POST /api/notifications/read-all
// @desc    Mark all notifications as read
// @access  Private
router.post("/read-all", auth, async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.user._id, read: false }, { read: true })

    res.json({ message: "All notifications marked as read" })
  } catch (error) {
    console.error("Error marking all notifications as read:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
