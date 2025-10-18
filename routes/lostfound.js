const express = require("express")
const router = express.Router()
const auth = require("../middleware/auth")
const { postItem, getApprovedItems, getUserItems, getPendingItems } = require("../controllers/lostFoundController")
const multer = require("multer")
const path = require("path")

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/lostfound/")
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

// Placeholder for lost and found routes
router.get("/", (req, res) => {
  res.json({ message: "Lost and Found routes working" })
})

// Post a lost item (requires authentication)
router.post("/post-item", auth, upload.single("image"), postItem)

// Get all approved lost items
router.get("/approved-items", getApprovedItems);

// Get approved lost items only
router.get("/lost-items", async (req, res) => {
  try {
    const items = await LostItem.find({ status: 'approved', itemType: 'lost' })
      .select('title description location datePosted userContact userName image')
      .sort({ datePosted: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get approved found items only
router.get("/found-items", async (req, res) => {
  try {
    const items = await LostItem.find({ status: 'approved', itemType: 'found' })
      .select('title description location datePosted userContact userName image')
      .sort({ datePosted: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's own lost items (requires authentication)
router.get("/my-items", auth, getUserItems)

// Get pending lost items (admin only)
router.get("/pending-items", auth, getPendingItems)

module.exports = router
