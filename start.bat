@echo off
REM 120-Day Placement Prep Todo App - Quick Start Script (Windows)

echo.
echo ========================================
echo Starting 120-Day Placement Prep Todo App
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

REM Start backend in new window
echo.
echo Starting Backend Server...
start "Backend - Placement Prep Todo" cmd /k "cd backend && npm install && npm run dev"

REM Wait for backend to start
timeout /t 3 /nobreak

REM Start frontend in new window
echo Starting Frontend Server...
start "Frontend - Placement Prep Todo" cmd /k "cd frontend && npm install && npm run dev"

REM Wait for frontend to start
timeout /t 3 /nobreak

echo.
echo ========================================
echo Application is running!
echo ========================================
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5000
echo.
echo Make sure MongoDB is running!
echo.
pause
