const jwt = require("jsonwebtoken")
const User = require("../models/User")

module.exports = async (req, res, next) => {
  // Get token from header
  const token = req.header("Authorization")?.replace("Bearer ", "")

  // Check if no token
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" })
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Add user from payload
    const userId = decoded.userId || decoded.id

    if (!userId) {
      return res.status(401).json({ message: "Invalid token format" })
    }

    // Find user by ID and exclude password from the result
    const user = await User.findById(userId).select("-password")

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Add user to request object
    req.user = user

    next()
  } catch (err) {
    console.error("Auth middleware error:", err.message)
    res.status(401).json({ message: "Token is not valid" })
  }
}
