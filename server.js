require("dotenv").config()

const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const path = require("path")
const app = express()

// Connect to MongoDB
const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI

if (!MONGO_URI) {
  console.error("❌ MONGODB_URI is not defined in .env file")
  console.log("Please check your .env file and ensure MONGODB_URI is set")
  process.exit(1)
}

console.log("🔄 Connecting to MongoDB...")
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB Connected to project_cup database")
    console.log(`📊 Database: ${mongoose.connection.name}`)
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message)
    process.exit(1)
  })

// Middleware
// Configure middleware
app.use(express.static("public"))

// Configure CORS
app.use(cors({
  origin: "*",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

// Body parsing middleware
app.use(express.json({
  limit: "10mb",
  verify: (req, res, buf) => {
    try {
      JSON.parse(buf)
    } catch (e) {
      res.status(400).json({ message: 'Invalid JSON payload' })
      throw new Error('Invalid JSON')
    }
  }
}))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Routes
app.use("/api/auth", require("./routes/auth"))
app.use("/api/user", require("./routes/user"))
app.use("/api/items", require("./routes/items"))
app.use("/api/notifications", require("./routes/notifications"))
app.use("/api/lostfound", require("./routes/lostfound"))
app.use("/api/marketplace", require("./routes/marketplace"))
app.use("/api/notes", require("./routes/notes"))
app.use("/api/admin", require("./routes/admin"))
app.use("/uploads", express.static("uploads"))

// Serve static files from public folder
app.use(express.static(path.join(__dirname, "public")))

// Start server
const PORT = process.env.PORT || 3002

// API root route
app.get("/api", (req, res) => {
  res.json({
    message: "🎉 SRKR College Utility Portal API is running successfully!",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      user: "/api/user",
      notifications: "/api/notifications",
      lostfound: "/api/lostfound",
      marketplace: "/api/marketplace",
      notes: "/api/notes",
      admin: "/api/admin",
    },
  })
})

// Health check route
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
  })
})

// Send index.html on root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"))
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.stack)
  // Send proper JSON response even for internal errors
  if (!res.headersSent) {
    res.status(500).json({
      message: err.message || "Something went wrong!",
      error: process.env.NODE_ENV === 'development' ? err : {}
    })
  }
})

// Handle 404
app.use("*", (req, res) => {
  if (!res.headersSent) {
    res.status(404).json({ message: "Route not found" })
  }
})

app.listen(PORT, () => {
  console.log("========================================")
  console.log("🚀 SRKR College Utility Portal Server")
  console.log("========================================")
  console.log(`🌐 Server running on port ${PORT}`)
  console.log(`📱 Frontend: http://localhost:${PORT}`)
  console.log(`🔗 API: http://localhost:${PORT}/api`)
  console.log(`💊 Health: http://localhost:${PORT}/api/health`)
  console.log("========================================")

  // Log environment info
  console.log(`📊 Environment: ${process.env.NODE_ENV || "development"}`)
  console.log(`📧 Email Service: ${process.env.EMAIL_USER ? "Configured" : "Demo Mode"}`)
  console.log("========================================")
})

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\n🛑 Shutting down server...")
  mongoose.connection.close(() => {
    console.log("📊 MongoDB connection closed")
    process.exit(0)
  })
})
