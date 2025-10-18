const express = require("express")
const router = express.Router()
const auth = require("../middleware/auth")
const {
  addAdmin,
  approveLostItem,
  rejectLostItem,
  approveMarketplaceItem,
  rejectMarketplaceItem,
  approveNote,
  rejectNote,
  deleteUser,
  getAllUsers,
  clearNonAdminUsers,
} = require("../controllers/adminController")

// Placeholder for admin routes
router.get("/", (req, res) => {
  res.json({ message: "Admin routes working" })
})

// Admin user management
router.get("/users", auth, getAllUsers)
router.post("/add-admin", auth, addAdmin)
router.delete("/users/:id", auth, deleteUser)
router.post("/clear-users", auth, clearNonAdminUsers)

// Lost and found item approval routes
router.post("/lostfound/:id/approve", auth, approveLostItem)
router.post("/lostfound/:id/reject", auth, rejectLostItem)

// Marketplace item approval routes
router.post("/marketplace/:id/approve", auth, approveMarketplaceItem)
router.post("/marketplace/:id/reject", auth, rejectMarketplaceItem)

// Notes approval routes
router.post("/notes/:id/approve", auth, approveNote)
router.post("/notes/:id/reject", auth, rejectNote)

module.exports = router
