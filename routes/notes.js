const express = require("express")
const router = express.Router()
const auth = require("../middleware/auth")
const multer = require("multer")
const path = require("path")
const {
  createNote,
  getUserNotes,
  getAllNotes,
  approveNote,
  rejectNote,
  uploadNote,
  getApprovedNotes,
  getPendingNotes,
} = require("../controllers/noteController")
const role = require("../middleware/role")

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/notes/")
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`)
  },
})

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /pdf|doc|docx|ppt|pptx|xls|xlsx|txt/
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
    if (extname) {
      return cb(null, true)
    } else {
      cb(new Error("Only document files are allowed!"))
    }
  },
})

// Placeholder for notes routes
router.get("/", (req, res) => {
  res.json({ message: "Notes routes working" })
})

// Create a simple note
router.post("/create", auth, createNote)

// Upload a note with file attachment
router.post("/upload", auth, upload.single("file"), uploadNote)

// Get user's own notes
router.get("/my-notes", auth, getUserNotes)

// Get all approved notes
router.get("/approved", getApprovedNotes)

// Admin routes
router.get("/all", auth, role("admin"), getAllNotes)
router.get("/pending", auth, role("admin"), getPendingNotes)
router.put("/approve/:id", auth, role("admin"), approveNote)
router.put("/reject/:id", auth, role("admin"), rejectNote)

module.exports = router
