const nodemailer = require("nodemailer")

// Create transporter
const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log("⚠️ Email credentials not configured")
    console.log("EMAIL_USER:", process.env.EMAIL_USER ? "Set" : "Not Set")
    console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "Set" : "Not Set")
    return null
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })

  // Verify transporter
  transporter.verify(function (error, success) {
    if (error) {
      console.log("❌ SMTP connection error:", error)
    } else {
      console.log("✅ SMTP Server is ready to send emails")
    }
  })

  return transporter
}

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Send OTP email
const sendOTPEmail = async (email, otp) => {
  try {
    console.log("Attempting to send OTP email to:", email)
    // If email credentials are not configured, return demo mode
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log(`📧 Demo Mode - OTP for ${email}: ${otp}`)
      console.log("Email configuration status:")
      console.log("EMAIL_USER:", process.env.EMAIL_USER ? "Set" : "Not Set")
      console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "Set" : "Not Set")
      return { success: true, demo: true, otp }
    }

    const transporter = createTransporter()

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "SRKR CUP - Email Verification",
      html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
                        <h1 style="color: white; margin: 0;">SRKR College Utility Portal</h1>
                    </div>
                    <div style="padding: 30px; background-color: #f9f9f9;">
                        <h2 style="color: #333;">Email Verification</h2>
                        <p style="color: #666; font-size: 16px;">Thank you for registering with SRKR CUP! Please use the following verification code to complete your registration:</p>
                        
                        <div style="background-color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
                            <h1 style="color: #667eea; font-size: 32px; letter-spacing: 5px; margin: 0;">${otp}</h1>
                        </div>
                        
                        <p style="color: #666; font-size: 14px;">This code will expire in 10 minutes. If you didn't request this verification, please ignore this email.</p>
                        
                        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
                            <p style="color: #999; font-size: 12px; text-align: center;">
                                This is an automated message from SRKR College Utility Portal.<br>
                                Please do not reply to this email.
                            </p>
                        </div>
                    </div>
                </div>
            `,
    }

    await transporter.sendMail(mailOptions)
    console.log(`📧 OTP email sent successfully to ${email}`)
    return { success: true }
  } catch (error) {
    console.error("❌ Email sending failed:", error)
    return { success: false, error: error.message }
  }
}

// Send password reset email
const sendPasswordResetEmail = async (email, otp) => {
  try {
    // If email credentials are not configured, return demo mode
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log(`📧 Demo Mode - Password Reset OTP for ${email}: ${otp}`)
      return { success: true, demo: true, otp }
    }

    const transporter = createTransporter()

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "SRKR CUP - Password Reset",
      html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
                        <h1 style="color: white; margin: 0;">SRKR College Utility Portal</h1>
                    </div>
                    <div style="padding: 30px; background-color: #f9f9f9;">
                        <h2 style="color: #333;">Password Reset Request</h2>
                        <p style="color: #666; font-size: 16px;">You have requested to reset your password. Please use the following code to reset your password:</p>
                        
                        <div style="background-color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
                            <h1 style="color: #667eea; font-size: 32px; letter-spacing: 5px; margin: 0;">${otp}</h1>
                        </div>
                        
                        <p style="color: #666; font-size: 14px;">This code will expire in 10 minutes. If you didn't request this password reset, please ignore this email.</p>
                        
                        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
                            <p style="color: #999; font-size: 12px; text-align: center;">
                                This is an automated message from SRKR College Utility Portal.<br>
                                Please do not reply to this email.
                            </p>
                        </div>
                    </div>
                </div>
            `,
    }

    await transporter.sendMail(mailOptions)
    console.log(`📧 Password reset email sent successfully to ${email}`)
    return { success: true }
  } catch (error) {
    console.error("❌ Password reset email sending failed:", error)
    return { success: false, error: error.message }
  }
}

module.exports = {
  generateOTP,
  sendOTPEmail,
  sendPasswordResetEmail,
}
