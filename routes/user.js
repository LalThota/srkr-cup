const express = require("express")
const router = express.Router()
const auth = require("../middleware/auth")
const User = require("../models/User")

// @route   GET /api/user/profile
// @desc    Get user profile
// @access  Private
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password")
    res.json(user)
  } catch (error) {
    console.error("Error fetching user profile:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// @route   PUT /api/user/profile
// @desc    Update user profile
// @access  Private
router.put("/profile", auth, async (req, res) => {
  try {
    const { name, phone } = req.body

    const user = await User.findByIdAndUpdate(req.user._id, { name, phone }, { new: true }).select("-password")

    res.json(user)
  } catch (error) {
    console.error("Error updating user profile:", error)
    res.status(500).json({ message: "Server error" })
  }
})

module.exports = router
