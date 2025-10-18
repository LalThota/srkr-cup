@echo off
echo ========================================
echo   SRKR College Utility Portal
echo ========================================
echo.

echo Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js is installed
echo.

echo Creating necessary directories...
if not exist "uploads" mkdir uploads
if not exist "uploads\lostfound" mkdir uploads\lostfound
if not exist "uploads\marketplace" mkdir uploads\marketplace
if not exist "uploads\notes" mkdir uploads\notes
echo ✅ Directories created
echo.

echo Installing dependencies...
call npm install
if errorlevel 1 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)
echo ✅ Dependencies installed
echo.

echo Checking environment configuration...
if not exist ".env" (
    echo ⚠️  .env file not found. Creating from template...
    echo MONGODB_URI=mongodb+srv://ishvar_07:ishvar12345@cluster0.vly1sn1.mongodb.net/project_cup > .env
    echo JWT_SECRET=your_super_secret_jwt_key_here_make_it_very_long_and_secure_for_production >> .env
    echo EMAIL_USER=your_email@gmail.com >> .env
    echo EMAIL_PASS=your_app_password >> .env
    echo PORT=3002 >> .env
    echo NODE_ENV=development >> .env
    echo.
    echo ✅ .env file created with default values
    echo ⚠️  Please update EMAIL_USER and EMAIL_PASS in .env file for OTP functionality
) else (
    echo ✅ .env file found
)
echo.

echo ========================================
echo Starting the server...
echo ========================================
echo.
echo 🚀 Server will start on http://localhost:3002
echo 📧 OTP emails will work in demo mode if email not configured
echo 🔐 Admin login: srkrcup@gmail.com / Srkrcup@25
echo.

call npm start

pause
