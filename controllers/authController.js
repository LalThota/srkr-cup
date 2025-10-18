const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { generateOTP, sendOTPEmail, sendPasswordResetEmail } = require("../utils/emailService")

exports.signup = async (req, res) => {
  try {
    // Validate request body
    const { name, regdNo, email, phone, password } = req.body
    if (!name || !regdNo || !email || !phone || !password) {
      return res.status(400).json({
        message: "All fields are required: name, regdNo, email, phone, and password"
      })
    }

    // Check if user exists
    let user = await User.findOne({ email })
    if (user) {
      return res.status(400).json({ message: "User already exists" })
    }

    // Generate OTP
    const otp = generateOTP()
    const otpExpiry = new Date()
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 10) // OTP valid for 10 minutes

    // Hash password
    const hashed = await bcrypt.hash(password, 10)

    // Create new user
    user = new User({
      name,
      regdNo,
      email,
      phone,
      password: hashed,
      otp,
      otpExpiry,
      isVerified: false,
    })

    // Save user
    await user.save()

    // Send OTP email
    const emailResult = await sendOTPEmail(email, otp)
    if (!emailResult.success) {
      console.error("Email sending failed:", emailResult.error)
      return res.status(201).json({
        success: true,
        message: "Account created successfully. However, we could not send the verification email. Please contact support.",
        email: email,
        otp: otp, // For demo purposes only - remove in production
      })
    }

    // Send success response
    res.status(201).json({
      success: true,
      message: "OTP sent to your email. Please verify to complete registration.",
      email: email
    })
  } catch (e) {
    console.error("Signup error:", e)
    res.status(500).json({
      success: false,
      message: "An error occurred during signup. Please try again.",
      error: process.env.NODE_ENV === 'development' ? e.message : undefined
    })
  }
}

exports.login = async (req, res) => {
  try {
    // Validate request body
    const { email, password, isAdmin } = req.body
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      })
    }

    // Find user
    const user = await User.findOne({ email })
    if (!user || (isAdmin && user.role !== "admin")) {
      return res.status(403).json({
        success: false,
        message: "Invalid credentials"
      })
    }

    // Check if user is verified (except for admin)
    if (!isAdmin && !user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Email not verified. Please verify your email first."
      })
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(403).json({
        success: false,
        message: "Invalid credentials"
      })
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )

    // Send success response
    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })
  } catch (e) {
    console.error("Login error:", e)
    res.status(500).json({
      success: false,
      message: "An error occurred during login. Please try again.",
      error: process.env.NODE_ENV === 'development' ? e.message : undefined
    })
  }
}

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Check if user is already verified
    if (user.isVerified) {
      return res.status(400).json({ message: "Email is already verified" })
    }

    // Check if OTP is valid and not expired
    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" })
    }

    if (new Date() > user.otpExpiry) {
      return res.status(400).json({ message: "OTP has expired. Please request a new one." })
    }

    // Mark user as verified and clear OTP fields
    user.isVerified = true
    user.otp = undefined
    user.otpExpiry = undefined
    await user.save()

    // Generate token for automatic login
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" })

    // Return user data and token for direct login
    res.status(200).json({
      message: "Email verified successfully.",
      token,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
      directLogin: true,
    })
  } catch (e) {
    console.error("OTP verification error:", e)
    res.status(500).json({ message: e.message })
  }
}

exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ message: "Email is required" })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Email is already verified" })
    }

    // Check if we need to enforce the cooldown period
    if (user.lastOtpSent) {
      const cooldownMinutes = 2; // 2 minutes cooldown
      const timeSinceLastOtp = (new Date() - user.lastOtpSent) / 1000 / 60; // Convert to minutes

      if (timeSinceLastOtp < cooldownMinutes) {
        const remainingTime = Math.ceil(cooldownMinutes - timeSinceLastOtp);
        return res.status(429).json({
          message: `Please wait ${remainingTime} minute(s) before requesting a new OTP`,
          remainingTime
        });
      }
    }

    // Generate new OTP
    const otp = generateOTP()
    const otpExpiry = new Date()
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 10) // OTP valid for 10 minutes

    user.otp = otp
    user.otpExpiry = otpExpiry
    user.lastOtpSent = new Date()
    await user.save()

    // Send OTP email
    const emailSent = await sendOTPEmail(email, otp)
    if (!emailSent) {
      return res.status(500).json({ message: "Failed to send OTP email" })
    }

    res.status(200).json({ message: "New OTP sent to your email" })
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ message: "Email is required" })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Generate OTP for password reset
    const otp = generateOTP()
    const otpExpiry = new Date()
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 10) // OTP valid for 10 minutes

    user.otp = otp
    user.otpExpiry = otpExpiry
    user.passwordReset = true // Flag to indicate this OTP is for password reset
    await user.save()

    // Send password reset email with OTP
    const emailSent = await sendPasswordResetEmail(email, otp)
    if (!emailSent) {
      return res.status(500).json({ message: "Failed to send password reset email" })
    }

    res.status(200).json({
      message: "Password reset OTP sent to your email",
      email: email,
    })
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}

exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "Email, OTP, and new password are required" })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Check if OTP is valid and not expired
    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" })
    }

    if (new Date() > user.otpExpiry) {
      return res.status(400).json({ message: "OTP has expired. Please request a new one." })
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Update user's password and clear OTP fields
    user.password = hashedPassword
    user.otp = undefined
    user.otpExpiry = undefined
    user.passwordReset = undefined
    await user.save()

    res.status(200).json({ message: "Password has been reset successfully. You can now login with your new password." })
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
}
