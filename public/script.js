// Global variables
let currentUser = null
let isAdmin = false
const notifications = []

// Initialize OTP input fields
function initializeOTPInputs() {
  const otpInputs = document.querySelectorAll('.otp-input')

  otpInputs.forEach((input, index) => {
    input.addEventListener('input', (e) => {
      const value = e.target.value

      // Allow only numbers
      if (!/^\d*$/.test(value)) {
        input.value = ''
        return
      }

      // Auto-move to next input
      if (value && index < otpInputs.length - 1) {
        otpInputs[index + 1].focus()
      }
    })

    // Handle backspace
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !input.value && index > 0) {
        otpInputs[index - 1].focus()
      }
    })
  })
}

// Initialize the application
function setupDashboardSidebar() {
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const dashboardSidebar = document.getElementById('dashboard-sidebar');

  if (sidebarToggle && dashboardSidebar) {
    sidebarToggle.addEventListener('click', () => {
      dashboardSidebar.classList.toggle('active');
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
      if (window.innerWidth <= 768) {
        if (!dashboardSidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
          dashboardSidebar.classList.remove('active');
        }
      }
    });

    // Close sidebar when clicking nav items on mobile
    const navItems = dashboardSidebar.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          dashboardSidebar.classList.remove('active');
        }
      });
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initializeApp()
  setupEventListeners()
  initializeOTPInputs()
  setupMobileMenu()
  setupDashboardSidebar()

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active')
      navMenu.classList.toggle('active')
    })

    // Close mobile menu when clicking on a nav link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active')
        navMenu.classList.remove('active')
      })
    })
  }
})

function initializeApp() {
  console.log("Initializing app...")

  // Setup mobile menu functionality
  function setupMobileMenu() {
    const hamburger = document.getElementById('hamburger')
    const navMenu = document.getElementById('nav-menu')
    const navLinks = document.querySelectorAll('.nav-link')

    if (hamburger && navMenu) {
      hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active')
        navMenu.classList.toggle('active')
      })

      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
          hamburger.classList.remove('active')
          navMenu.classList.remove('active')
        }
      })

      // Close menu when clicking nav links
      navLinks.forEach(link => {
        link.addEventListener('click', () => {
          hamburger.classList.remove('active')
          navMenu.classList.remove('active')
        })
      })
    }
  }

  // Initialize sample users if not exists
  if (!localStorage.getItem("users")) {
    console.log("Creating sample users...")
    const sampleUsers = [
      {
        id: 1,
        name: "John Doe",
        regdNo: "22B91A24",
        email: "john@example.com",
        phone: "1234567890",
        password: "password123",
        joinDate: new Date().toISOString(),
      },
      {
        id: 2,
        name: "Jane Smith",
        regdNo: "24B91A2S2",
        email: "jane@example.com",
        phone: "0987654321",
        password: "password123",
        joinDate: new Date().toISOString(),
      },
    ]
    localStorage.setItem("users", JSON.stringify(sampleUsers))
    console.log("Sample users created:", sampleUsers)
  }

  // Initialize admin user
  if (!localStorage.getItem("admin")) {
    console.log("Creating admin user...")
    const admin = {
      email: "srkrcup@gmail.com",
      password: "Srkrcup@25",
    }
    localStorage.setItem("admin", JSON.stringify(admin))
    console.log("Admin user created:", admin)
  }

  // Initialize empty arrays for data
  if (!localStorage.getItem("lostItems")) {
    localStorage.setItem("lostItems", JSON.stringify([]))
  }
  if (!localStorage.getItem("marketplaceItems")) {
    localStorage.setItem("marketplaceItems", JSON.stringify([]))
  }
  if (!localStorage.getItem("notes")) {
    localStorage.setItem("notes", JSON.stringify([]))
  }
  if (!localStorage.getItem("notifications")) {
    localStorage.setItem("notifications", JSON.stringify([]))
  }

  // Initialize sample data
  initializeSampleData()

  // Check if user is logged in
  const savedUser = localStorage.getItem("currentUser")
  const savedIsAdmin = localStorage.getItem("isAdmin")

  console.log("Checking saved login:", { savedUser, savedIsAdmin })

  if (savedUser) {
    currentUser = JSON.parse(savedUser)
    isAdmin = savedIsAdmin === "true"
    console.log("User already logged in:", { currentUser, isAdmin })
    showDashboard()
  } else {
    // Ensure main content is visible if no one is logged in
    showMainContent()
  }
}

function setupEventListeners() {
  // Navigation
  document.getElementById("hamburger").addEventListener("click", toggleMobileMenu)

  // Add event listeners to login buttons
  const loginButtons = document.querySelectorAll('button[onclick="showLogin()"]')
  console.log("Found login buttons:", loginButtons.length)
  loginButtons.forEach((button, index) => {
    console.log(`Adding click event to login button ${index}`)
    button.addEventListener("click", (e) => {
      console.log(`Login button ${index} clicked`, e)
      // The onclick attribute will handle the actual showLogin call
    })
  })

  // Forgot Password Form
  const forgotPasswordForm = document.getElementById("forgotPasswordForm")
  if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener("submit", handleForgotPassword)
  }

  // Password Reset Form
  const passwordResetForm = document.getElementById("passwordResetForm")
  if (passwordResetForm) {
    passwordResetForm.addEventListener("submit", handlePasswordReset)
  }

  // Resend Reset OTP Link
  const resendResetOtpLink = document.getElementById("resendResetOtpLink")
  if (resendResetOtpLink) {
    resendResetOtpLink.addEventListener("click", handleResendResetOTP)
  }

  // Dashboard sidebar toggles for mobile
  const sidebarToggle = document.getElementById("sidebar-toggle")
  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", () => {
      const sidebar = document.querySelector(".dashboard-sidebar")
      if (sidebar) {
        sidebar.classList.toggle("active")
      }
    })
  }

  const adminSidebarToggle = document.getElementById("admin-sidebar-toggle")
  if (adminSidebarToggle) {
    adminSidebarToggle.addEventListener("click", () => {
      document.getElementById("admin-sidebar").classList.toggle("active")
    })
  }

  // Forms
  document.getElementById("loginForm").addEventListener("submit", handleLogin)
  document.getElementById("signupForm").addEventListener("submit", handleSignup)
  document.getElementById("postLostItemForm").addEventListener("submit", handlePostLostItem)
  document.getElementById("postSaleItemForm").addEventListener("submit", handlePostSaleItem)
  document.getElementById("uploadNotesForm").addEventListener("submit", handleUploadNotes)

  // Set up OTP verification form listeners
  setupOTPVerificationListeners()

  // Contact form
  const contactForm = document.getElementById("contactForm")
  if (contactForm) {
    contactForm.addEventListener("submit", handleContactForm)
  }

  // FAQ toggle functionality
  setupFAQToggles()

  // Close modals when clicking outside
  window.addEventListener("click", (event) => {
    if (event.target.classList.contains("modal")) {
      event.target.style.display = "none"
    }
  })
}

function setupFAQToggles() {
  const faqQuestions = document.querySelectorAll(".faq-question")
  faqQuestions.forEach((question) => {
    question.addEventListener("click", () => {
      const faqItem = question.parentElement
      const answer = faqItem.querySelector(".faq-answer")
      const icon = question.querySelector("i")

      // Toggle answer visibility
      if (answer.style.display === "block") {
        answer.style.display = "none"
        icon.style.transform = "rotate(0deg)"
      } else {
        answer.style.display = "block"
        icon.style.transform = "rotate(180deg)"
      }
    })
  })
}

function handleContactForm(e) {
  e.preventDefault()

  const firstName = document.getElementById("contactFirstName").value
  const lastName = document.getElementById("contactLastName").value
  const email = document.getElementById("contactEmail").value
  const subject = document.getElementById("contactSubject").value
  const message = document.getElementById("contactMessage").value

  // Simulate form submission
  alert(`Thank you ${firstName}! Your message has been sent successfully. We'll get back to you within 24 hours.`)

  // Reset form
  e.target.reset()
}

// Navigation functions
function toggleMobileMenu() {
  const navMenu = document.getElementById("nav-menu")
  navMenu.classList.toggle("active")
}

function showLogin() {
  console.log("showLogin function called")
  const loginModal = document.getElementById("loginModal")
  if (loginModal) {
    loginModal.style.display = "block"
    console.log("Login modal displayed")
  } else {
    console.error("Login modal element not found")
  }
  closeModal("signupModal")
}

function showSignup() {
  document.getElementById("signupModal").style.display = "block"
  closeModal("loginModal")
  closeModal("forgotPasswordModal")
  closeModal("passwordResetModal")
}

function showForgotPassword() {
  document.getElementById("forgotPasswordModal").style.display = "block"
  closeModal("loginModal")
}

function showPasswordReset(email) {
  document.getElementById("passwordResetModal").style.display = "block"
  document.getElementById("resetEmail").value = email
  closeModal("forgotPasswordModal")
}

function closeModal(modalId) {
  console.log(`closeModal function called for ${modalId}`)
  const modal = document.getElementById(modalId)
  if (modal) {
    // Add fade-out animation
    const modalContainer = modal.querySelector(".modal-container")
    if (modalContainer) {
      modalContainer.classList.add("fade-out")

      // Wait for animation to complete before hiding
      setTimeout(() => {
        modal.style.display = "none"
        // Remove the animation class for next time
        modalContainer.classList.remove("fade-out")
      }, 300)
    } else {
      modal.style.display = "none"
    }

    // Clear OTP timer if it exists
    if (modalId === "otpVerificationModal" && window.otpTimerInterval) {
      clearInterval(window.otpTimerInterval)
      window.otpTimerInterval = null
    }

    console.log(`Modal ${modalId} closed`)
  } else {
    console.error(`Modal element ${modalId} not found`)
  }
}

// Authentication functions
async function handleLogin(e) {
  e.preventDefault()
  console.log("Login form submitted")

  const email = document.getElementById("loginEmail").value.trim()
  const password = document.getElementById("loginPassword").value.trim()
  const adminLogin = document.getElementById("isAdmin").checked

  console.log("Login attempt:", { email, adminLogin })

  // Validate inputs
  if (!email || !password) {
    alert("Please enter both email and password")
    return
  }

  // Add loading state to the button
  const loginButton = e.submitter
  const originalText = loginButton.querySelector("span").textContent
  loginButton.disabled = true
  loginButton.querySelector("span").textContent = "Signing In..."

  try {
    if (adminLogin) {
      // Admin login - use localStorage for demo purposes
      const admin = JSON.parse(localStorage.getItem("admin"))
      console.log("Admin credentials:", admin)
      if (email === "srkrcup@gmail.com" && password === "Srkrcup@25") {
        isAdmin = true
        currentUser = { name: "Admin", email: admin.email }
        localStorage.setItem("currentUser", JSON.stringify(currentUser))
        localStorage.setItem("isAdmin", "true")
        console.log("Admin login successful")

        try {
          // Store admin notification locally
          const notifications = JSON.parse(localStorage.getItem("notifications") || "[]")
          notifications.push({
            id: Date.now(),
            message: "Admin logged in",
            type: "system",
            timestamp: new Date().toISOString(),
            read: false,
          })
          localStorage.setItem("notifications", JSON.stringify(notifications))

          showDashboard()
          closeModal("loginModal")
          updateNotificationBadge()
        } catch (error) {
          console.error("Error showing dashboard:", error)
          throw new Error("Error loading dashboard. Please try again.")
        }
      } else {
        throw new Error("Invalid admin credentials. Please contact system administrator.")
      }
    } else {
      // User login - use API
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      let data
      try {
        data = await response.json()
      } catch (error) {
        console.error("Error parsing response:", error)
        throw new Error("Server response was not in the expected format. Please try again.")
      }

      if (!response.ok) {
        if (data.message === "Email not verified") {
          alert("Your email is not verified. Please check your inbox for the verification OTP.")
          showOTPVerificationModal(email)
          return
        }
        throw new Error(data.message || "Login failed")
      }

      if (!data.success) {
        throw new Error(data.message || "Login was not successful")
      }

      // Login successful
      isAdmin = data.user.role === "admin"
      currentUser = data.user
      localStorage.setItem("currentUser", JSON.stringify(currentUser))
      localStorage.setItem("isAdmin", isAdmin ? "true" : "false")
      localStorage.setItem("token", data.token)

      console.log("User login successful")
      try {
        showDashboard()
        closeModal("loginModal")
        addNotification(`${currentUser.name} logged in`, "system")
      } catch (error) {
        console.error("Error showing dashboard:", error)
        throw new Error("Error loading dashboard. Please try again.")
      }
    }
  } catch (error) {
    console.error("Login error:", error)
    alert(error.message || "An error occurred during login. Please try again.")
  } finally {
    // Remove loading state
    loginButton.disabled = false
    loginButton.querySelector("span").textContent = originalText
  }
}

async function handleSignup(e) {
  e.preventDefault()

  const name = document.getElementById("signupName").value.trim()
  const regdNo = document.getElementById("signupRegdNo").value.trim()
  const email = document.getElementById("signupEmail").value.trim()
  const password = document.getElementById("signupPassword").value.trim()
  const phone = document.getElementById("signupPhone").value.trim()

  // Validate required fields
  if (!name || !regdNo || !email || !password || !phone) {
    alert("All fields are required!")
    return
  }

  // Validate registration number format
  const regdNoPattern = /^(22|23|24|25)B91[A-Za-z0-9]+$/
  if (!regdNoPattern.test(regdNo)) {
    alert("Invalid registration number format. Please use format like 22B91..., 23B91..., 24B91..., or 25B91...")
    return
  }

  // Validate email format
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailPattern.test(email)) {
    alert("Please enter a valid email address")
    return
  }

  // Validate password strength
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  if (!passwordPattern.test(password)) {
    alert(
      "Password must contain at least 8 characters with one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)",
    )
    return
  }

  // Add loading state to the button
  const signupButton = e.submitter
  const originalText = signupButton.querySelector("span").textContent
  signupButton.disabled = true
  signupButton.querySelector("span").textContent = "Creating Account..."

  try {
    // Send signup request to the server
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        regdNo,
        email,
        password,
        phone,
      }),
    })

    let data
    try {
      data = await response.json()
    } catch (error) {
      console.error("Error parsing response:", error)
      throw new Error("Server response was not in the expected format. Please try again.")
    }

    if (!response.ok) {
      throw new Error(data.message || "Signup failed")
    }

    if (!data.success) {
      throw new Error(data.message || "Signup was not successful")
    }

    // Show success message
    alert("Account created successfully! Please check your email for the verification code.")

    // Show OTP verification modal
    showOTPVerificationModal(email)
    closeModal("signupModal")
  } catch (error) {
    console.error("Signup error:", error)
    alert(error.message || "An error occurred during signup. Please try again.")
  } finally {
    // Remove loading state
    signupButton.disabled = false
    signupButton.querySelector("span").textContent = originalText
  }
}

function logout() {
  try {
    if (currentUser) {
      addNotification(`${currentUser.name} logged out`, "system")
    }
    currentUser = null
    isAdmin = false
    localStorage.removeItem("currentUser")
    localStorage.removeItem("isAdmin")
    localStorage.removeItem("token")

    // Hide dashboards and show home
    showMainContent()

    // Close any open sidebars on logout - with null checks
    const userSidebar = document.getElementById("user-sidebar")
    if (userSidebar) userSidebar.classList.remove("active")

    const adminSidebar = document.getElementById("admin-sidebar")
    if (adminSidebar) adminSidebar.classList.remove("active")
  } catch (error) {
    console.error("Error during logout:", error)
  }
}

// Helper function to set up OTP verification form listeners
function setupOTPVerificationListeners() {
  // Add event listener to OTP verification form
  const otpForm = document.getElementById("otpVerificationForm")
  if (otpForm) {
    // Remove existing event listeners to prevent duplicates
    const newOtpForm = otpForm.cloneNode(true)
    otpForm.parentNode.replaceChild(newOtpForm, otpForm)
    newOtpForm.addEventListener("submit", handleOTPVerification)
  }

  // Add event listener to resend OTP link
  const resendOtpLink = document.getElementById("resendOtpLink")
  if (resendOtpLink) {
    // Remove existing event listeners to prevent duplicates
    const newResendOtpLink = resendOtpLink.cloneNode(true)
    resendOtpLink.parentNode.replaceChild(newResendOtpLink, resendOtpLink)
    newResendOtpLink.addEventListener("click", handleResendOTP)
  }
}

// OTP Verification Functions
function showOTPVerificationModal(email) {
  // Create modal if it doesn't exist
  let otpModal = document.getElementById("otpVerificationModal")
  if (!otpModal) {
    otpModal = document.createElement("div")
    otpModal.id = "otpVerificationModal"
    otpModal.className = "modal"
    otpModal.innerHTML = `
            <div class="modal-overlay" onclick="closeModal('otpVerificationModal')"></div>
            <div class="modal-container fade-in">
                <div class="modal-header">
                    <h2 class="pulse-animation">Verify Your Email</h2>
                    <p>We've sent a verification code to your email</p>
                    <button class="modal-close" onclick="closeModal('otpVerificationModal')">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <form id="otpVerificationForm" class="modal-form">
                    <input type="hidden" id="otpEmail">
                    <div class="form-group">
                        <label for="otpCode">Enter Verification Code</label>
                        <div class="otp-input-container">
                            <input type="text" class="otp-input" maxlength="1" autofocus>
                            <input type="text" class="otp-input" maxlength="1">
                            <input type="text" class="otp-input" maxlength="1">
                            <input type="text" class="otp-input" maxlength="1">
                            <input type="text" class="otp-input" maxlength="1">
                            <input type="text" class="otp-input" maxlength="1">
                            <input type="hidden" id="otpCode">
                        </div>
                    </div>

                    <div class="form-group">
                        <div class="timer-container">
                            <p class="form-hint">Code expires in <span id="otpTimer" class="countdown-timer">05:00</span></p>
                        </div>
                        <p class="form-hint">Didn't receive the code? <a href="javascript:void(0)" id="resendOtpLink" class="resend-link">Resend</a></p>
                    </div>

                    <button type="submit" class="btn btn-primary btn-full btn-animated">
                        <span>Verify Email</span>
                        <i class="fas fa-arrow-right"></i>
                    </button>
                </form>

                <div class="modal-footer">
                    <p>Already verified? <a href="javascript:void(0)" onclick="showLogin()">Sign in</a></p>
                </div>
            </div>
        `
    document.body.appendChild(otpModal)

    // Set up OTP input fields
    setupOTPInputFields()

    // Start countdown timer
    startOTPCountdownTimer()
  }

  // Set email in hidden field
  document.getElementById("otpEmail").value = email

  // Show the modal
  otpModal.style.display = "block"

  // Set up event listeners for the OTP form
  setupOTPVerificationListeners()
}

// Set up OTP input fields for better UX
function setupOTPInputFields() {
  const otpInputs = document.querySelectorAll(".otp-input")
  const otpCodeField = document.getElementById("otpCode")
  const firstInput = otpInputs[0]

  function handleOTPInput(e) {
    const input = e.target
    let value = input.value

    // Remove non-digits
    value = value.replace(/\D/g, '')

    // Take only first 6 digits
    value = value.substring(0, 6)

    // Update display
    otpInputs.forEach((input, index) => {
      input.value = value[index] || ''
    })

    // Update hidden field
    otpCodeField.value = value

    // Focus next empty input if available
    if (value.length < 6) {
      const nextEmptyInput = Array.from(otpInputs).find(input => !input.value)
      if (nextEmptyInput) nextEmptyInput.focus()
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Backspace') {
      const input = e.target
      if (input.value === '') {
        // Clear all inputs when backspacing an empty first input
        otpInputs.forEach(input => input.value = '')
        otpCodeField.value = ''
        firstInput.focus()
      }
    }
  }

  function handlePaste(e) {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text')
    const value = pastedData.replace(/\D/g, '').substring(0, 6)

    // Update display
    otpInputs.forEach((input, index) => {
      input.value = value[index] || ''
    })

    // Update hidden field
    otpCodeField.value = value

    // Focus last filled input
    const lastFilledIndex = Math.min(value.length, otpInputs.length) - 1
    if (lastFilledIndex >= 0) otpInputs[lastFilledIndex].focus()
  }

  // Set up event listeners
  otpInputs.forEach((input, index) => {
    if (index === 0) {
      input.addEventListener("input", handleOTPInput)
      input.addEventListener("keydown", handleKeyDown)
      input.addEventListener("paste", handlePaste)
    } else {
      input.readOnly = true
    }
  })

  // Focus first input initially
  firstInput.focus()
}

// Function to update the hidden OTP field with combined values
function updateOTPValue() {
  let otpValue = ""
  otpInputs.forEach((input) => {
    otpValue += input.value || "" // Handle empty inputs
  })
  otpCodeField.value = otpValue
  console.log("Combined OTP:", otpCodeField.value) // Debug log
}


// Start countdown timer for OTP expiration
function startOTPCountdownTimer() {
  // Clear any existing timer
  if (window.otpTimerInterval) {
    clearInterval(window.otpTimerInterval)
  }

  const timerElement = document.getElementById("otpTimer")
  const resendLink = document.getElementById("resendOtpLink")
  const form = document.getElementById("otpVerificationForm")
  const inputs = document.querySelectorAll('.otp-input')
  let timeLeft = 5 * 60 // 5 minutes in seconds
  let warningShown = false
  let criticalShown = false

  // Store timer start time for accurate countdown
  const startTime = Date.now()

  // Initially disable resend link and enable inputs
  resendLink.classList.remove("active")
  resendLink.style.pointerEvents = "none"
  resendLink.style.opacity = "0.5"
  inputs.forEach(input => input.disabled = false)

  // Reset timer classes and state
  timerElement.classList.remove("timer-warning", "timer-critical", "timer-expired", "pulse-animation")

  // Function to update timer display
  function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60)
    const seconds = timeLeft % 60
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  window.otpTimerInterval = setInterval(() => {
    // Calculate time passed since start
    const timePassed = Math.floor((Date.now() - startTime) / 1000)
    timeLeft = Math.max(5 * 60 - timePassed, 0)

    // Update display
    timerElement.textContent = updateTimerDisplay()

    // Warning state - 1 minute remaining
    if (timeLeft <= 60 && !warningShown) {
      warningShown = true
      timerElement.classList.add("timer-warning", "pulse-animation")
      // Optional: Show warning toast/message
    }

    // Critical state - 30 seconds remaining
    if (timeLeft <= 30 && !criticalShown) {
      criticalShown = true
      timerElement.classList.add("timer-critical")
      timerElement.classList.add("pulse-animation-fast")
      // Optional: Show critical toast/message
    }

    // Expired state
    if (timeLeft <= 0) {
      clearInterval(window.otpTimerInterval)
      window.otpTimerInterval = null

      timerElement.textContent = "Code Expired!"
      timerElement.classList.remove("timer-warning", "timer-critical", "pulse-animation", "pulse-animation-fast")
      timerElement.classList.add("timer-expired")

      // Show expired message
      const expiredMessage = document.createElement("div")
      expiredMessage.className = "verification-error"
      expiredMessage.innerHTML = '<i class="fas fa-exclamation-circle"></i> Code expired. Please request a new one.'
      form.insertBefore(expiredMessage, form.querySelector(".form-group:last-child"))

      // Enable resend link when timer expires
      resendLink.classList.add("active")
      resendLink.style.pointerEvents = "auto"
      resendLink.style.opacity = "1"

      // Clear form fields
      document.querySelectorAll('.otp-input').forEach(input => {
        input.value = ''
        input.disabled = true
      })
    }

    timeLeft--
  }, 1000)
}

async function handleOTPVerification(e) {
  e.preventDefault()

  const email = document.getElementById("otpEmail").value
  const otpInputs = document.querySelectorAll('.otp-input')
  const otp = Array.from(otpInputs).map(input => input.value).join('')
  const otpForm = document.getElementById("otpVerificationForm")
  const timerElement = document.getElementById("otpTimer")

  // Check if OTP is expired
  if (timerElement.classList.contains('timer-expired')) {
    const errorMessage = document.createElement("div")
    errorMessage.className = "verification-error"
    errorMessage.innerHTML = '<i class="fas fa-exclamation-circle"></i> OTP has expired. Please request a new one.'
    otpForm.insertBefore(errorMessage, otpForm.querySelector(".form-group:last-child"))

    setTimeout(() => {
      if (errorMessage.parentNode) {
        errorMessage.parentNode.removeChild(errorMessage)
      }
    }, 3000)
    return
  }

  // Validate OTP format
  if (!email || !otp || otp.length !== 6 || !/^\d+$/.test(otp)) {
    // Add shake animation to the form
    otpForm.classList.add("shake-animation")

    // Create and show error message
    const errorMessage = document.createElement("div")
    errorMessage.className = "verification-error"
    errorMessage.innerHTML =
      '<i class="fas fa-exclamation-circle"></i> Please enter the complete 6-digit verification code'

    // Remove any existing error messages
    const existingError = otpForm.querySelector(".verification-error")
    if (existingError) {
      existingError.remove()
    }

    otpForm.appendChild(errorMessage)

    // Remove the animation class after it completes
    setTimeout(() => {
      otpForm.classList.remove("shake-animation")
      // Remove error message after a delay
      setTimeout(() => {
        if (errorMessage.parentNode) {
          errorMessage.parentNode.removeChild(errorMessage)
        }
      }, 3000)
    }, 500)

    return
  }

  // Add loading state to the button
  const verifyButton = e.submitter
  addLoadingState(verifyButton)

  try {
    // Send OTP verification request to the server
    const response = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        otp,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Verification failed")
    }

    // Show success animation and message
    const modalContainer = document.querySelector("#otpVerificationModal .modal-container")
    modalContainer.classList.add("bounce-animation")

    // Create and show success message
    const successMessage = document.createElement("div")
    successMessage.className = "verification-success"
    successMessage.innerHTML = '<i class="fas fa-check-circle"></i> Verification successful!'

    // Remove any existing messages
    const existingMessage = otpForm.querySelector(".verification-error, .verification-success")
    if (existingMessage) {
      existingMessage.remove()
    }

    otpForm.appendChild(successMessage)

    // Check if direct login is enabled
    if (data.directLogin && data.token && data.user) {
      // Store user data and token
      currentUser = data.user
      isAdmin = data.user.role === "admin"
      localStorage.setItem("currentUser", JSON.stringify(currentUser))
      localStorage.setItem("isAdmin", isAdmin ? "true" : "false")
      localStorage.setItem("token", data.token)

      // Wait for animation to complete before redirecting
      setTimeout(() => {
        // Close the modal and show dashboard
        closeModal("otpVerificationModal")
        showDashboard()
        addNotification(`${currentUser.name} verified and logged in`, "system")
      }, 1500)
    } else {
      // Fallback to the old behavior
      setTimeout(() => {
        closeModal("otpVerificationModal")
        showLogin()
      }, 1500)
    }
  } catch (error) {
    // Add shake animation to the form
    otpForm.classList.add("shake-animation")

    // Create and show error message
    const errorMessage = document.createElement("div")
    errorMessage.className = "verification-error"
    errorMessage.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${error.message}`

    // Remove any existing error messages
    const existingError = otpForm.querySelector(".verification-error")
    if (existingError) {
      existingError.remove()
    }

    otpForm.appendChild(errorMessage)

    // Remove the animation class after it completes
    setTimeout(() => {
      otpForm.classList.remove("shake-animation")
      // Remove error message after a delay
      setTimeout(() => {
        if (errorMessage.parentNode) {
          errorMessage.parentNode.removeChild(errorMessage)
        }
      }, 3000)
    }, 500)
  } finally {
    removeLoadingState(verifyButton, "Verify Email")
  }
}

async function handleResendOTP(e) {
  e.preventDefault()

  const email = document.getElementById("otpEmail").value
  const resendLink = document.getElementById("resendOtpLink")
  const form = document.getElementById("otpVerificationForm")

  if (!email) {
    alert("Email address is missing. Please try again.")
    return
  }

  // Add loading state to the resend link
  resendLink.classList.remove("active")
  const originalText = resendLink.textContent
  resendLink.textContent = "Sending..."
  resendLink.style.pointerEvents = "none"
  resendLink.style.opacity = "0.5"

  // Remove any existing error messages
  const existingError = form.querySelector(".verification-error")
  if (existingError) {
    existingError.remove()
  }

  // Re-enable OTP input fields
  document.querySelectorAll('.otp-input').forEach(input => {
    input.value = ''
    input.disabled = false
  })

  // Remove expired/warning classes from timer
  const timerElement = document.getElementById("otpTimer")
  timerElement.classList.remove("timer-expired", "timer-warning", "pulse-animation")

  try {
    // Send resend OTP request to the server
    const response = await fetch("/api/auth/resend-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Failed to resend verification code")
    }

    // Show success animation and message
    const successMessage = document.createElement("div")
    successMessage.className = "verification-success"
    successMessage.innerHTML = '<i class="fas fa-check-circle"></i> New code sent successfully!'
    form.appendChild(successMessage)

    // Clear and focus first input
    document.querySelectorAll('.otp-input').forEach((input, index) => {
      input.value = ''
      if (index === 0) input.focus()
    })

    // Clear old timer if exists
    if (window.otpTimerInterval) {
      clearInterval(window.otpTimerInterval)
    }

    // Restart the countdown timer
    startOTPCountdownTimer()

    // Remove success message after 3 seconds
    setTimeout(() => {
      if (successMessage.parentNode) {
        successMessage.parentNode.removeChild(successMessage)
      }
    }, 3000)
  } catch (error) {
    const errorMessage = document.createElement("div")
    errorMessage.className = "verification-error"
    errorMessage.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${error.message}`
    form.appendChild(errorMessage)

    setTimeout(() => {
      if (errorMessage.parentNode) {
        errorMessage.parentNode.removeChild(errorMessage)
      }
    }, 3000)
  } finally {
    // Reset the link
    resendLink.textContent = originalText
    resendLink.style.pointerEvents = "auto"
    resendLink.style.opacity = "1"
  }
}

async function handleForgotPassword(e) {
  e.preventDefault()

  const email = document.getElementById("forgotEmail").value

  if (!email) {
    alert("Please enter your email address")
    return
  }

  // Add loading state to the button
  const submitButton = e.submitter
  const originalText = submitButton.querySelector("span").textContent
  submitButton.disabled = true
  submitButton.querySelector("span").textContent = "Sending..."

  try {
    // Send forgot password request to the server
    const response = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Failed to send reset code")
    }

    alert("A password reset code has been sent to your email.")
    showPasswordReset(email)
  } catch (error) {
    alert(error.message)
  } finally {
    // Remove loading state
    submitButton.disabled = false
    submitButton.querySelector("span").textContent = originalText
  }
}

async function handlePasswordReset(e) {
  e.preventDefault()

  const email = document.getElementById("resetEmail").value
  const otp = document.getElementById("resetOTP").value
  const newPassword = document.getElementById("newPassword").value
  const confirmPassword = document.getElementById("confirmPassword").value

  if (!email || !otp || !newPassword || !confirmPassword) {
    alert("Please fill in all fields")
    return
  }

  if (newPassword !== confirmPassword) {
    alert("Passwords do not match")
    return
  }

  // Add loading state to the button
  const resetButton = e.submitter
  const originalText = resetButton.querySelector("span").textContent
  resetButton.disabled = true
  resetButton.querySelector("span").textContent = "Resetting..."

  try {
    // Send reset password request to the server
    const response = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        otp,
        newPassword,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Password reset failed")
    }

    alert("Your password has been reset successfully. You can now login with your new password.")
    closeModal("passwordResetModal")
    showLogin()
  } catch (error) {
    alert(error.message)
  } finally {
    // Remove loading state
    resetButton.disabled = false
    resetButton.querySelector("span").textContent = originalText
  }
}

async function handleResendResetOTP(e) {
  e.preventDefault()

  const email = document.getElementById("resetEmail").value

  if (!email) {
    alert("Email address is missing. Please try again.")
    return
  }

  // Add loading state to the resend link
  const resendLink = document.getElementById("resendResetOtpLink")
  const originalText = resendLink.textContent
  resendLink.textContent = "Sending..."
  resendLink.style.pointerEvents = "none"

  try {
    // Send forgot password request again to resend OTP
    const response = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "Failed to resend reset code")
    }

    alert("A new password reset code has been sent to your email.")
  } catch (error) {
    alert(error.message)
  } finally {
    // Reset the link
    resendLink.textContent = originalText
    resendLink.style.pointerEvents = "auto"
  }
}

function showMainContent() {
  document.body.setAttribute("data-page", "home")

  // Add null check for main-navbar
  const mainNavbar = document.getElementById("main-navbar")
  if (mainNavbar) mainNavbar.style.display = "flex" // Show main navbar

  const sections = ["home", "features", "about", "contact"]
  sections.forEach((id) => {
    const section = document.getElementById(id)
    if (section) section.style.display = "block"
  })

  const dashboards = ["userDashboard", "adminDashboard"]
  dashboards.forEach((id) => {
    const dashboard = document.getElementById(id)
    if (dashboard) dashboard.style.display = "none"
  })
}

function showDashboard() {
  console.log("showDashboard called, isAdmin:", isAdmin, currentUser)
  console.log("Attempting to show dashboard")
  try {
    // Hide all main sections
    document.body.setAttribute("data-page", "dashboard")

    // Hide main navbar
    const mainNavbar = document.getElementById("main-navbar")
    if (mainNavbar) mainNavbar.style.display = "none" // Hide main navbar

    const sections = ["home", "features", "about", "contact"]
    sections.forEach((id) => {
      const section = document.getElementById(id)
      if (section) section.style.display = "none"
    })

    if (isAdmin) {
      const adminDashboard = document.getElementById("adminDashboard")
      const userDashboard = document.getElementById("userDashboard")

      if (adminDashboard) adminDashboard.style.display = "flex"
      if (userDashboard) userDashboard.style.display = "none"
      loadAdminDashboard()
      updateNotificationBadge()
      // Set initial active tab for admin
      showTab("admin-overview", "admin", null)
    } else {
      const userDashboard = document.getElementById("userDashboard")
      const adminDashboard = document.getElementById("adminDashboard")
      const userName = document.getElementById("userName")

      if (userDashboard) userDashboard.style.display = "flex"
      if (adminDashboard) adminDashboard.style.display = "none"
      if (userName && currentUser) userName.textContent = currentUser.name
      loadUserDashboard()
      updateNotificationBadge()
      loadRecentNotifications()
      // Set initial active tab for user
      showTab("overview", "user", null)
    }
  } catch (error) {
    console.error("Error showing dashboard:", error)
    alert("Error loading dashboard. Please try refreshing the page.")
  }
}

// Tab functions
function showTab(tabName, userType, event) {
  console.log(`showTab called with tabName: ${tabName}, userType: ${userType}, event:`, event)
  // Hide all tab contents
  const tabContents = document.querySelectorAll(".tab-content")
  tabContents.forEach((tab) => tab.classList.remove("active"))

  // Remove active class from all nav items
  const navItems = document.querySelectorAll(".nav-item")
  navItems.forEach((item) => item.classList.remove("active"))

  // Show selected tab
  const tabElement = document.getElementById(tabName)
  if (tabElement) {
    tabElement.classList.add("active")
  } else {
    console.error(`Tab element with ID '${tabName}' not found`)
    return
  }

  // Set active class to the clicked nav item if event is provided
  if (event) {
    const clickedNavItem = event.target.closest(".nav-item")
    if (clickedNavItem) {
      clickedNavItem.classList.add("active")
    }
  } else {
    // If no event (called programmatically), find and activate the corresponding nav item
    const navItem = document.querySelector(`.nav-item[onclick*="showTab('${tabName}')"]`)
    if (navItem) {
      navItem.classList.add("active")
    }
  }

  // Update breadcrumb title
  const pageTitleElement =
    userType === "admin" ? document.getElementById("adminPageTitle") : document.getElementById("currentPageTitle")
  if (pageTitleElement) {
    // Capitalize first letter and replace hyphens with spaces for display
    pageTitleElement.textContent = tabName
      .replace(/-/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  // Load specific tab data
  if (tabName === "lost-found-user") {
    loadLostFoundItems()
  } else if (tabName === "marketplace-user") {
    loadMarketplaceItems()
  } else if (tabName === "notes-user") {
    loadNotes()
  } else if (tabName === "users-management") {
    loadUsersManagement()
  } else if (tabName === "pending-approvals") {
    loadPendingApprovals()
  } else if (tabName === "content-management") {
    loadContentManagement()
  }

  // Close sidebar on mobile after selecting a tab
  if (window.innerWidth <= 1024) {
    // Adjust breakpoint as per your CSS
    if (userType === "admin") {
      const sidebar = document.getElementById("admin-sidebar")
      if (sidebar) {
        sidebar.classList.remove("active")
      }
    } else {
      const sidebar = document.querySelector(".dashboard-sidebar")
      if (sidebar) {
        sidebar.classList.remove("active")
      }
    }
  }
}

// User Dashboard functions
function loadUserDashboard() {
  updateUserStats()

  loadLostFoundItems()
  loadMarketplaceItems()
  loadNotes()
  loadRecentNotifications()
}

function updateUserStats() {
  const lostItems = JSON.parse(localStorage.getItem("lostItems"))
  const marketplaceItems = JSON.parse(localStorage.getItem("marketplaceItems"))
  const notes = JSON.parse(localStorage.getItem("notes"))

  const userLostItems = lostItems.filter((item) => item.userId === currentUser.id)
  const userSaleItems = marketplaceItems.filter((item) => item.userId === currentUser.id)
  const userNotes = notes.filter((note) => note.userId === currentUser.id)

  document.getElementById("userLostItems").textContent = userLostItems.length
  document.getElementById("userSaleItems").textContent = userSaleItems.length
  document.getElementById("userNotes").textContent = userNotes.length
}

// Lost & Found functions
function showPostLostItem() {
  document.getElementById("postLostItemModal").style.display = "block"
}

function handlePostLostItem(e) {
  e.preventDefault()

  const title = document.getElementById("lostItemTitle").value
  const description = document.getElementById("lostItemDescription").value
  const location = document.getElementById("lostItemLocation").value
  const imageFile = document.getElementById("lostItemImage").files[0]

  const lostItems = JSON.parse(localStorage.getItem("lostItems"))

  const newItem = {
    id: Date.now(),
    title,
    description,
    location,
    userId: currentUser.id,
    userName: currentUser.name,
    userContact: currentUser.phone,
    status: "pending",
    datePosted: new Date().toISOString(),
    image: imageFile ? URL.createObjectURL(imageFile) : null,
  }

  lostItems.push(newItem)
  localStorage.setItem("lostItems", JSON.stringify(lostItems))

  // Add notification for admin
  addNotification(`New lost item reported: ${title}`, "lost-found", newItem.id)

  alert("Item posted successfully! Waiting for admin approval.")
  closeModal("postLostItemModal")
  document.getElementById("postLostItemForm").reset()
  updateUserStats()
  loadLostFoundItems()
}

function loadLostFoundItems() {
  const lostItems = JSON.parse(localStorage.getItem("lostItems"))
  const approvedItems = lostItems.filter((item) => item.status === "approved")

  const container = document.getElementById("lostItemsList")
  container.innerHTML = ""

  if (approvedItems.length === 0) {
    container.innerHTML = '<p class="text-center">No lost items found.</p>'
    return
  }

  approvedItems.forEach((item) => {
    const itemCard = createItemCard(item, "lost")
    container.appendChild(itemCard)
  })
}

function searchLostItems() {
  const searchTerm = document.getElementById("lostItemSearch").value.toLowerCase()
  const lostItems = JSON.parse(localStorage.getItem("lostItems"))
  const filteredItems = lostItems.filter(
    (item) =>
      item.status === "approved" &&
      (item.title.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm) ||
        item.location.toLowerCase().includes(searchTerm)),
  )

  const container = document.getElementById("lostItemsList")
  container.innerHTML = ""

  if (filteredItems.length === 0) {
    container.innerHTML = '<p class="text-center">No items found matching your search.</p>'
    return
  }

  filteredItems.forEach((item) => {
    const itemCard = createItemCard(item, "lost")
    container.appendChild(itemCard)
  })
}

// Marketplace functions
function showPostSaleItem() {
  document.getElementById("postSaleItemModal").style.display = "block"
}

function handlePostSaleItem(e) {
  e.preventDefault()

  const title = document.getElementById("saleItemTitle").value
  const description = document.getElementById("saleItemDescription").value
  const price = document.getElementById("saleItemPrice").value
  const contact = document.getElementById("saleItemContact").value
  const imageFile = document.getElementById("saleItemImage").files[0]

  const marketplaceItems = JSON.parse(localStorage.getItem("marketplaceItems"))

  const newItem = {
    id: Date.now(),
    title,
    description,
    price: Number.parseFloat(price),
    contact,
    userId: currentUser.id,
    userName: currentUser.name,
    datePosted: new Date().toISOString(),
    image: imageFile ? URL.createObjectURL(imageFile) : null,
  }

  marketplaceItems.push(newItem)
  localStorage.setItem("marketplaceItems", JSON.stringify(marketplaceItems))

  alert("Item posted successfully!")
  closeModal("postSaleItemModal")
  document.getElementById("postSaleItemForm").reset()
  updateUserStats()
  loadMarketplaceItems()
}

function loadMarketplaceItems() {
  const marketplaceItems = JSON.parse(localStorage.getItem("marketplaceItems"))

  const container = document.getElementById("marketplaceList")
  container.innerHTML = ""

  if (marketplaceItems.length === 0) {
    container.innerHTML = '<p class="text-center">No items for sale.</p>'
    return
  }

  marketplaceItems.forEach((item) => {
    const itemCard = createItemCard(item, "marketplace")
    container.appendChild(itemCard)
  })
}

function searchMarketplace() {
  const searchTerm = document.getElementById("marketplaceSearch").value.toLowerCase()
  const marketplaceItems = JSON.parse(localStorage.getItem("marketplaceItems"))
  const filteredItems = marketplaceItems.filter(
    (item) => item.title.toLowerCase().includes(searchTerm) || item.description.toLowerCase().includes(searchTerm),
  )

  const container = document.getElementById("marketplaceList")
  container.innerHTML = ""

  if (filteredItems.length === 0) {
    container.innerHTML = '<p class="text-center">No items found matching your search.</p>'
    return
  }

  filteredItems.forEach((item) => {
    const itemCard = createItemCard(item, "marketplace")
    container.appendChild(itemCard)
  })
}

// Notes functions
function showUploadNotes() {
  document.getElementById("uploadNotesModal").style.display = "block"
}

function handleUploadNotes(e) {
  e.preventDefault()

  const title = document.getElementById("notesTitle").value
  const subject = document.getElementById("notesSubject").value
  const semester = document.getElementById("notesSemester").value
  const description = document.getElementById("notesDescription").value
  const file = document.getElementById("notesFile").files[0]

  if (!file) {
    alert("Please select a file to upload.")
    return
  }

  const notes = JSON.parse(localStorage.getItem("notes"))

  const newNote = {
    id: Date.now(),
    title,
    subject,
    semester,
    description,
    userId: currentUser.id,
    userName: currentUser.name,
    status: "pending",
    dateUploaded: new Date().toISOString(),
    fileName: file.name,
    fileSize: file.size,
    fileUrl: URL.createObjectURL(file),
  }

  notes.push(newNote)
  localStorage.setItem("notes", JSON.stringify(notes))

  // Add notification for admin
  addNotification(`New notes uploaded: ${title}`, "notes", newNote.id)

  alert("Notes uploaded successfully! Waiting for admin approval.")
  closeModal("uploadNotesModal")
  document.getElementById("uploadNotesForm").reset()
  updateUserStats()
  loadNotes()
}

function loadNotes() {
  const notes = JSON.parse(localStorage.getItem("notes"))
  const approvedNotes = notes.filter((note) => note.status === "approved")

  const container = document.getElementById("notesList")
  container.innerHTML = ""

  if (approvedNotes.length === 0) {
    container.innerHTML = '<p class="text-center">No notes available.</p>'
    return
  }

  approvedNotes.forEach((note) => {
    const noteCard = createItemCard(note, "notes")
    container.appendChild(noteCard)
  })
}

function filterNotes() {
  const semester = document.getElementById("semesterFilter").value
  const subject = document.getElementById("subjectFilter").value.toLowerCase()

  const notes = JSON.parse(localStorage.getItem("notes"))
  let filteredNotes = notes.filter((note) => note.status === "approved")

  if (semester) {
    filteredNotes = filteredNotes.filter((note) => note.semester === semester)
  }

  if (subject) {
    filteredNotes = filteredNotes.filter(
      (note) => note.subject.toLowerCase().includes(subject) || note.title.toLowerCase().includes(subject),
    )
  }

  const container = document.getElementById("notesList")
  container.innerHTML = ""

  if (filteredNotes.length === 0) {
    container.innerHTML = '<p class="text-center">No notes found matching your criteria.</p>'
    return
  }

  filteredNotes.forEach((note) => {
    const noteCard = createItemCard(note, "notes")
    container.appendChild(noteCard)
  })
}

// Admin Dashboard functions
function loadAdminDashboard() {
  updateAdminStats()
  loadUsersManagement()
  loadPendingApprovals()
  loadContentManagement()
  loadRecentNotifications()
}

function updateAdminStats() {
  const users = JSON.parse(localStorage.getItem("users"))
  const lostItems = JSON.parse(localStorage.getItem("lostItems"))
  const notes = JSON.parse(localStorage.getItem("notes"))

  const pendingItems = lostItems.filter((item) => item.status === "pending").length
  const pendingNotes = notes.filter((note) => note.status === "pending").length
  const approvedItems =
    lostItems.filter((item) => item.status === "approved").length +
    notes.filter((note) => note.status === "approved").length

  document.getElementById("totalUsers").textContent = users.length
  document.getElementById("pendingApprovals").textContent = pendingItems + pendingNotes
  document.getElementById("approvedItems").textContent = approvedItems

  // Update pending count badge
  const pendingCount = pendingItems + pendingNotes
  document.getElementById("pendingCount").textContent = pendingCount

  if (pendingCount > 0) {
    document.getElementById("pendingCount").style.display = "block"
  } else {
    document.getElementById("pendingCount").style.display = "none"
  }
}

function loadUsersManagement() {
  const users = JSON.parse(localStorage.getItem("users"))
  const tbody = document.getElementById("usersTableBody")
  tbody.innerHTML = ""

  users.forEach((user) => {
    const row = document.createElement("tr")
    row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.phone}</td>
            <td>${new Date(user.joinDate).toLocaleDateString()}</td>
            <td>
                <button class="btn btn-danger btn-sm" onclick="deleteUser(${user.id})">Delete</button>
            </td>
        `
    tbody.appendChild(row)
  })
}

function deleteUser(userId) {
  if (confirm("Are you sure you want to delete this user?")) {
    const users = JSON.parse(localStorage.getItem("users"))
    const user = users.find((u) => u.id === userId)
    const updatedUsers = users.filter((user) => user.id !== userId)
    localStorage.setItem("users", JSON.stringify(updatedUsers))

    addNotification(`User deleted: ${user.name}`, "user")
    loadUsersManagement()
    updateAdminStats()
  }
}

function loadPendingApprovals() {
  const lostItems = JSON.parse(localStorage.getItem("lostItems"))
  const notes = JSON.parse(localStorage.getItem("notes"))

  const pendingLostItems = lostItems.filter((item) => item.status === "pending")
  const pendingNotes = notes.filter((note) => note.status === "pending")

  // Update counts
  document.getElementById("pendingLostCount").textContent = `${pendingLostItems.length} pending`
  document.getElementById("pendingNotesCount").textContent = `${pendingNotes.length} pending`

  // Load pending lost items
  const lostItemsContainer = document.getElementById("pendingLostItems")
  lostItemsContainer.innerHTML = ""

  if (pendingLostItems.length === 0) {
    lostItemsContainer.innerHTML = "<p>No pending lost items.</p>"
  } else {
    pendingLostItems.forEach((item) => {
      const approvalCard = createApprovalCard(item, "lostItem")
      lostItemsContainer.appendChild(approvalCard)
    })
  }

  // Load pending notes
  const notesContainer = document.getElementById("pendingNotes")
  notesContainer.innerHTML = ""

  if (pendingNotes.length === 0) {
    notesContainer.innerHTML = "<p>No pending notes.</p>"
  } else {
    pendingNotes.forEach((note) => {
      const approvalCard = createApprovalCard(note, "note")
      notesContainer.appendChild(approvalCard)
    })
  }
}

function loadContentManagement() {
  const lostItems = JSON.parse(localStorage.getItem("lostItems"))
  const notes = JSON.parse(localStorage.getItem("notes"))

  // Load all lost items
  const lostItemsContainer = document.getElementById("allLostItems")
  lostItemsContainer.innerHTML = ""

  if (lostItems.length === 0) {
    lostItemsContainer.innerHTML = "<p>No lost items.</p>"
  } else {
    lostItems.forEach((item) => {
      const contentCard = createContentCard(item, "lostItem")
      lostItemsContainer.appendChild(contentCard)
    })
  }

  // Load all notes
  const notesContainer = document.getElementById("allNotes")
  notesContainer.innerHTML = ""

  if (notes.length === 0) {
    notesContainer.innerHTML = "<p>No notes.</p>"
  } else {
    notes.forEach((note) => {
      const contentCard = createContentCard(note, "note")
      notesContainer.appendChild(contentCard)
    })
  }
}

// Approval functions
function approveItem(itemId, type) {
  if (type === "lostItem") {
    const lostItems = JSON.parse(localStorage.getItem("lostItems"))
    const item = lostItems.find((item) => item.id === itemId)
    if (item) {
      item.status = "approved"
      localStorage.setItem("lostItems", JSON.stringify(lostItems))
      addNotification(`Lost item approved: ${item.title}`, "approval")
    }
  } else if (type === "note") {
    const notes = JSON.parse(localStorage.getItem("notes"))
    const note = notes.find((note) => note.id === itemId)
    if (note) {
      note.status = "approved"
      localStorage.setItem("notes", JSON.stringify(notes))
      addNotification(`Notes approved: ${note.title}`, "approval")
    }
  }

  loadPendingApprovals()
  updateAdminStats()
  updateNotificationBadge()
  alert("Item approved successfully!")
}

function rejectItem(itemId, type) {
  if (type === "lostItem") {
    const lostItems = JSON.parse(localStorage.getItem("lostItems"))
    const item = lostItems.find((item) => item.id === itemId)
    if (item) {
      item.status = "rejected"
      localStorage.setItem("lostItems", JSON.stringify(lostItems))
      addNotification(`Lost item rejected: ${item.title}`, "approval")
    }
  } else if (type === "note") {
    const notes = JSON.parse(localStorage.getItem("notes"))
    const note = notes.find((note) => note.id === itemId)
    if (note) {
      note.status = "rejected"
      localStorage.setItem("notes", JSON.stringify(notes))
      addNotification(`Notes rejected: ${note.title}`, "approval")
    }
  }

  loadPendingApprovals()
  updateAdminStats()
  updateNotificationBadge()
  alert("Item rejected successfully!")
}

function deleteItem(itemId, type) {
  if (confirm("Are you sure you want to delete this item?")) {
    if (type === "lostItem") {
      const lostItems = JSON.parse(localStorage.getItem("lostItems"))
      const item = lostItems.find((item) => item.id === itemId)
      const updatedItems = lostItems.filter((item) => item.id !== itemId)
      localStorage.setItem("lostItems", JSON.stringify(updatedItems))
      addNotification(`Lost item deleted: ${item.title}`, "system")
    } else if (type === "note") {
      const notes = JSON.parse(localStorage.getItem("notes"))
      const note = notes.find((note) => note.id === itemId)
      const updatedNotes = notes.filter((note) => note.id !== itemId)
      localStorage.setItem("notes", JSON.stringify(updatedNotes))
      addNotification(`Notes deleted: ${note.title}`, "system")
    }

    loadContentManagement()
    updateAdminStats()
    alert("Item deleted successfully!")
  }
}

// Notification functions
function addNotification(message, type, itemId = null) {
  // Only create notifications if user is logged in
  if (!currentUser) return

  // Create notification via API
  fetch("/api/notifications", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      message,
      type,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Notification created:", data)
      updateNotificationBadge()
    })
    .catch((error) => {
      console.error("Error creating notification:", error)
    })
}

function updateNotificationBadge() {
  if (!currentUser) return

  // Fetch unread notifications count from API
  fetch("/api/notifications/unread", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const unreadCount = data.length

      const notificationDot = document.getElementById("adminNotificationDot")
      if (notificationDot) {
        if (unreadCount > 0) {
          notificationDot.style.display = "block"
        } else {
          notificationDot.style.display = "none"
        }
      }
    })
    .catch((error) => {
      console.error("Error fetching notifications:", error)
    })
}

function showNotifications() {
  if (!currentUser) return

  const modal = document.getElementById("notificationModal")
  const list = document.getElementById("notificationList")

  list.innerHTML = "<p class='text-center'>Loading notifications...</p>"
  modal.style.display = "block"

  // Fetch notifications from API
  fetch("/api/notifications", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then((response) => response.json())
    .then((notifications) => {
      list.innerHTML = ""

      if (notifications.length === 0) {
        list.innerHTML = "<p class='text-center'>No notifications</p>"
      } else {
        notifications.forEach((notification) => {
          const item = document.createElement("div")
          item.className = `activity-item ${!notification.read ? "unread" : ""}`

          // Create the notification content
          const content = document.createElement("div")
          content.className = "notification-content d-flex"
          content.innerHTML = `
                    <div class="activity-icon">
                        <i class="fas fa-${getNotificationIcon(notification.type)}"></i>
                    </div>
                    <div class="activity-content">
                        <div class="activity-title">${notification.message}</div>
                        <div class="activity-time">${formatTimeAgo(new Date(notification.createdAt))}</div>
                    </div>
                `

          // Add a mark as read button for unread notifications
          if (!notification.read) {
            const markReadBtn = document.createElement("button")
            markReadBtn.className = "btn btn-sm btn-outline-primary ml-auto"
            markReadBtn.innerHTML = '<i class="fas fa-check"></i>'
            markReadBtn.title = "Mark as read"
            markReadBtn.addEventListener("click", (e) => {
              e.stopPropagation() // Prevent event bubbling
              markNotificationAsRead(notification._id)
            })
            content.appendChild(markReadBtn)
          }

          item.appendChild(content)
          list.appendChild(item)
        })

        // Add a button to mark all as read if there are unread notifications
        if (notifications.some((n) => !n.read)) {
          const markAllBtn = document.createElement("button")
          markAllBtn.className = "btn btn-primary w-100 mt-3"
          markAllBtn.textContent = "Mark all as read"
          markAllBtn.addEventListener("click", markAllNotificationsAsRead)
          list.appendChild(markAllBtn)
        }
      }
    })
    .catch((error) => {
      console.error("Error fetching notifications:", error)
      list.innerHTML = "<p class='text-center text-danger'>Error loading notifications</p>"
    })
}

function markNotificationAsRead(notificationId) {
  fetch(`/api/notifications/${notificationId}/read`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Marked notification as read:", data)
      updateNotificationBadge()
      showNotifications() // Refresh the notifications list
    })
    .catch((error) => {
      console.error("Error marking notification as read:", error)
    })
}

function markAllNotificationsAsRead() {
  fetch("/api/notifications/read-all", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Marked all notifications as read:", data)
      updateNotificationBadge()
      showNotifications() // Refresh the notifications list
    })
    .catch((error) => {
      console.error("Error marking notifications as read:", error)
    })
}

function loadRecentNotifications() {
  if (!currentUser) return

  const container = document.getElementById("recentNotifications")
  container.innerHTML = "<p class='text-center'>Loading...</p>"

  // Fetch notifications from API
  fetch("/api/notifications", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then((response) => response.json())
    .then((notifications) => {
      container.innerHTML = ""

      if (notifications.length === 0) {
        container.innerHTML = "<p class='text-center'>No recent activity</p>"
        return
      }

      // Display only the 5 most recent notifications
      notifications.slice(0, 5).forEach((notification) => {
        const item = document.createElement("div")
        item.className = `activity-item ${!notification.read ? "unread" : ""}`
        item.innerHTML = `
                <div class="activity-icon">
                    <i class="fas fa-${getNotificationIcon(notification.type)}"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-title">${notification.message}</div>
                    <div class="activity-time">${formatTimeAgo(new Date(notification.createdAt))}</div>
                </div>
            `
        container.appendChild(item)
      })
    })
    .catch((error) => {
      console.error("Error fetching recent notifications:", error)
      container.innerHTML = "<p class='text-center text-danger'>Error loading notifications</p>"
    })
}

function getNotificationIcon(type) {
  switch (type) {
    case "lost-found":
      return "search-location"
    case "notes":
      return "graduation-cap"
    case "user":
      return "user"
    case "approval":
      return "check-circle"
    case "rejection":
      return "times-circle"
    case "system":
      return "cog"
    default:
      return "bell"
  }
}

function formatTimeAgo(timestamp) {
  const now = new Date()
  const time = new Date(timestamp)
  const diffInSeconds = Math.floor((now - time) / 1000)

  if (diffInSeconds < 60) return "Just now"
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  return `${Math.floor(diffInSeconds / 86400)} days ago`
}

// Helper functions to create cards
function createItemCard(item, type) {
  const card = document.createElement("div")
  card.className = "item-card"

  let cardContent = ""

  if (type === "lost") {
    cardContent = `
            <div class="item-image">
                ${item.image ? `<img src="${item.image}" alt="${item.title}" style="width: 100%; height: 100%; object-fit: cover;">` : '<i class="fas fa-image fa-3x"></i>'}
            </div>
            <div class="item-content">
                <div class="item-title">${item.title}</div>
                <div class="item-description">${item.description}</div>
                <div class="item-meta">
                    <span>📍 ${item.location}</span>
                    <span>📅 ${new Date(item.datePosted).toLocaleDateString()}</span>
                </div>
                <div class="item-actions">
                    <button class="btn btn-primary btn-sm" onclick="contactUser('${item.userContact}', '${item.userName}')">
                        <i class="fas fa-phone"></i> Contact
                    </button>
                </div>
            </div>
        `
  } else if (type === "marketplace") {
    cardContent = `
            <div class="item-image">
                ${item.image ? `<img src="${item.image}" alt="${item.title}" style="width: 100%; height: 100%; object-fit: cover;">` : '<i class="fas fa-image fa-3x"></i>'}
            </div>
            <div class="item-content">
                <div class="item-title">${item.title}</div>
                <div class="item-description">${item.description}</div>
                <div class="item-price">₹${item.price}</div>
                <div class="item-meta">
                    <span>👤 ${item.userName}</span>
                    <span>📅 ${new Date(item.datePosted).toLocaleDateString()}</span>
                </div>
                <div class="item-actions">
                    <button class="btn btn-primary btn-sm" onclick="contactUser('${item.contact}', '${item.userName}')">
                        <i class="fas fa-phone"></i> Contact Seller
                    </button>
                </div>
            </div>
        `
  } else if (type === "notes") {
    cardContent = `
            <div class="item-image">
                <i class="fas fa-file-pdf fa-3x"></i>
            </div>
            <div class="item-content">
                <div class="item-title">${item.title}</div>
                <div class="item-description">${item.description || "No description provided"}</div>
                <div class="item-meta">
                    <span>📚 ${item.subject}</span>
                    <span>🎓 Semester ${item.semester}</span>
                    <span>👤 ${item.userName}</span>
                    <span>📅 ${new Date(item.dateUploaded).toLocaleDateString()}</span>
                </div>
                <div class="item-actions">
                    <button class="btn btn-primary btn-sm" onclick="downloadFile('${item.fileUrl}', '${item.fileName}')">
                        <i class="fas fa-download"></i> Download
                    </button>
                </div>
            </div>
        `
  }

  card.innerHTML = cardContent
  return card
}

function createApprovalCard(item, type) {
  const card = document.createElement("div")
  card.className = "approval-item"

  let cardContent = ""

  if (type === "lostItem") {
    cardContent = `
            <div class="approval-header">
                <div class="approval-info">
                    <h4>${item.title}</h4>
                    <p><strong>Description:</strong> ${item.description}</p>
                    <p><strong>Location:</strong> ${item.location}</p>
                    <p><strong>Posted by:</strong> ${item.userName}</p>
                    <p><strong>Date:</strong> ${new Date(item.datePosted).toLocaleDateString()}</p>
                </div>
                <div class="approval-actions">
                    <button class="btn btn-success btn-sm" onclick="approveItem(${item.id}, 'lostItem')">
                        <i class="fas fa-check"></i> Approve
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="rejectItem(${item.id}, 'lostItem')">
                        <i class="fas fa-times"></i> Reject
                    </button>
                </div>
            </div>
        `
  } else if (type === "note") {
    cardContent = `
            <div class="approval-header">
                <div class="approval-info">
                    <h4>${item.title}</h4>
                    <p><strong>Subject:</strong> ${item.subject}</p>
                    <p><strong>Semester:</strong> ${item.semester}</p>
                    <p><strong>Description:</strong> ${item.description || "No description"}</p>
                    <p><strong>Uploaded by:</strong> ${item.userName}</p>
                    <p><strong>Date:</strong> ${new Date(item.dateUploaded).toLocaleDateString()}</p>
                    <p><strong>File:</strong> ${item.fileName}</p>
                </div>
                <div class="approval-actions">
                    <button class="btn btn-success btn-sm" onclick="approveItem(${item.id}, 'note')">
                        <i class="fas fa-check"></i> Approve
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="rejectItem(${item.id}, 'note')">
                        <i class="fas fa-times"></i> Reject
                    </button>
                </div>
            </div>
        `
  }

  card.innerHTML = cardContent
  return card
}

function createContentCard(item, type) {
  const card = document.createElement("div")
  card.className = "approval-item"

  let statusBadge = ""
  if (item.status === "pending") {
    statusBadge = '<span class="status-badge status-pending">Pending</span>'
  } else if (item.status === "approved") {
    statusBadge = '<span class="status-badge status-approved">Approved</span>'
  } else if (item.status === "rejected") {
    statusBadge = '<span class="status-badge status-rejected">Rejected</span>'
  }

  let cardContent = ""

  if (type === "lostItem") {
    cardContent = `
            <div class="approval-header">
                <div class="approval-info">
                    <h4>${item.title} ${statusBadge}</h4>
                    <p><strong>Description:</strong> ${item.description}</p>
                    <p><strong>Location:</strong> ${item.location}</p>
                    <p><strong>Posted by:</strong> ${item.userName}</p>
                    <p><strong>Date:</strong> ${new Date(item.datePosted).toLocaleDateString()}</p>
                </div>
                <div class="approval-actions">
                    <button class="btn btn-danger btn-sm" onclick="deleteItem(${item.id}, 'lostItem')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `
  } else if (type === "note") {
    cardContent = `
            <div class="approval-header">
                <div class="approval-info">
                    <h4>${item.title} ${statusBadge}</h4>
                    <p><strong>Subject:</strong> ${item.subject}</p>
                    <p><strong>Semester:</strong> ${item.semester}</p>
                    <p><strong>Description:</strong> ${item.description || "No description"}</p>
                    <p><strong>Uploaded by:</strong> ${item.userName}</p>
                    <p><strong>Date:</strong> ${new Date(item.dateUploaded).toLocaleDateString()}</p>
                    <p><strong>File:</strong> ${item.fileName}</p>
                </div>
                <div class="approval-actions">
                    <button class="btn btn-danger btn-sm" onclick="deleteItem(${item.id}, 'note')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `
  }

  card.innerHTML = cardContent
  return card
}

// Utility functions
function contactUser(contact, userName) {
  alert(`Contact ${userName} at: ${contact}`)
}

function downloadFile(fileUrl, fileName) {
  const link = document.createElement("a")
  link.href = fileUrl
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Initialize sample data
function initializeSampleData() {
  // Add sample lost items
  const lostItems = JSON.parse(localStorage.getItem("lostItems"))
  if (lostItems.length === 0) {
    const sampleLostItems = [
      {
        id: 1,
        title: "Blue Backpack",
        description: "Navy blue backpack with laptop compartment. Contains important documents.",
        location: "Library - 2nd Floor",
        userId: 1,
        userName: "John Doe",
        userContact: "1234567890",
        status: "approved",
        datePosted: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        image: null,
      },
      {
        id: 2,
        title: "iPhone 12",
        description: "Black iPhone 12 with cracked screen protector. Has a blue case.",
        location: "Cafeteria",
        userId: 2,
        userName: "Jane Smith",
        userContact: "0987654321",
        status: "approved",
        datePosted: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        image: null,
      },
    ]
    localStorage.setItem("lostItems", JSON.stringify(sampleLostItems))
  }

  // Add sample marketplace items
  const marketplaceItems = JSON.parse(localStorage.getItem("marketplaceItems"))
  if (marketplaceItems.length === 0) {
    const sampleMarketplaceItems = [
      {
        id: 1,
        title: "Physics Textbook",
        description: "University Physics 14th Edition. Good condition, minimal highlighting.",
        price: 2500,
        contact: "john@example.com",
        userId: 1,
        userName: "John Doe",
        datePosted: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
        image: null,
      },
      {
        id: 2,
        title: "Scientific Calculator",
        description: "Casio FX-991ES Plus. Perfect working condition.",
        price: 800,
        contact: "jane@example.com",
        userId: 2,
        userName: "Jane Smith",
        datePosted: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
        image: null,
      },
    ]
    localStorage.setItem("marketplaceItems", JSON.stringify(sampleMarketplaceItems))
  }

  // Add sample notes
  const notes = JSON.parse(localStorage.getItem("notes"))
  if (notes.length === 0) {
    const sampleNotes = [
      {
        id: 1,
        title: "Data Structures Complete Notes",
        subject: "Computer Science",
        semester: "3",
        description: "Comprehensive notes covering all topics including arrays, linked lists, trees, and graphs.",
        userId: 1,
        userName: "John Doe",
        status: "approved",
        dateUploaded: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
        fileName: "data-structures-notes.pdf",
        fileSize: 2048000,
        fileUrl: "#",
      },
      {
        id: 2,
        title: "Calculus Formula Sheet",
        subject: "Mathematics",
        semester: "1",
        description: "Quick reference sheet for all important calculus formulas.",
        userId: 2,
        userName: "Jane Smith",
        status: "approved",
        dateUploaded: new Date(Date.now() - 518400000).toISOString(), // 6 days ago
        fileName: "calculus-formulas.pdf",
        fileSize: 512000,
        fileUrl: "#",
      },
    ]
    localStorage.setItem("notes", JSON.stringify(sampleNotes))
  }
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  })
})

// Add loading states to buttons
function addLoadingState(button) {
  if (!button) return
  button.setAttribute("data-original-html", button.innerHTML)
  button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...'
  button.disabled = true
  button.classList.add("loading")
}

function removeLoadingState(button, originalText) {
  if (!button) return
  button.innerHTML = button.getAttribute("data-original-html") || originalText
  button.disabled = false
  button.classList.remove("loading")
  button.removeAttribute("data-original-html")
}

// Add click handlers for buttons that need loading states
document.addEventListener("click", (e) => {
  if (e.target.matches(".btn-primary[type='submit']") && !e.target.classList.contains("loading")) {
  }

  // Handle sidebar toggle
  if (e.target.matches(".sidebar-toggle") || e.target.closest(".sidebar-toggle")) {
    const sidebar = document.querySelector(".dashboard-sidebar")
    if (sidebar) {
      sidebar.classList.toggle("active")
    }
  }
})
