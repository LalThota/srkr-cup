const express = require("express")
const router = express.Router()

// Placeholder for items routes
router.get("/", (req, res) => {
  res.json({ message: "Items routes working" })
})

module.exports = router
