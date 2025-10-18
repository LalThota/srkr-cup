@echo off
echo Setting up College Utility Portal Backend...
echo.

echo Creating necessary directories...
if not exist "uploads" mkdir uploads
if not exist "uploads\lostfound" mkdir uploads\lostfound
if not exist "uploads\marketplace" mkdir uploads\marketplace
if not exist "uploads\notes" mkdir uploads\notes

echo.
echo Installing dependencies...
npm install

echo.
echo Setting up environment...
if not exist ".env" (
    echo Creating .env file...
    copy .env.example .env 2>nul || echo Please create a .env file with your configuration
)

echo.
echo ========================================
echo IMPORTANT: Please update your .env file with:
echo 1. Your email credentials for OTP functionality
echo 2. A secure JWT secret key
echo ========================================
echo.

echo Starting the server...
npm run dev
