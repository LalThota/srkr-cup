// routes/marketplace.js
const express = require("express")
const router = express.Router()
const multer = require("multer")
const path = require("path")
const auth = require("../middleware/auth")
const { postItem, getApprovedItems, getUserItems, getPendingItems } = require("../controllers/marketplaceController")

// Placeholder for marketplace routes
router.get("/", (req, res) => {
  res.json({ message: "Marketplace routes working" })
})

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/marketplace/")
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`)
  },
})

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = filetypes.test(file.mimetype)
    if (mimetype && extname) {
      return cb(null, true)
    } else {
      cb(new Error("Only image files are allowed!"))
    }
  },
})

// Post an item to sell (requires authentication)
router.post("/sell", auth, upload.single("image"), postItem)

// Get all approved items for sale
router.get("/items", getApprovedItems)

// Get user's own items (requires authentication)
router.get("/my-items", auth, getUserItems)

// Get pending items (admin only)
router.get("/pending", auth, getPendingItems)

module.exports = router
