#!/bin/bash

# 120-Day Placement Prep Todo App - Quick Start Script

echo "🚀 Starting 120-Day Placement Prep Todo App..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js from https://nodejs.org"
    exit 1
fi

# Check if MongoDB is running
if ! command -v mongosh &> /dev/null && ! command -v mongo &> /dev/null; then
    echo "⚠️  MongoDB not found. Make sure MongoDB is running or use MongoDB Atlas."
fi

# Start backend
echo "📦 Starting backend server..."
cd backend
npm install > /dev/null 2>&1
npm run dev &
BACKEND_PID=$!
echo "✓ Backend starting on port 5000 (PID: $BACKEND_PID)"

# Wait for backend to start
sleep 3

# Start frontend
echo "📱 Starting frontend server..."
cd ../frontend
npm install > /dev/null 2>&1
npm run dev &
FRONTEND_PID=$!
echo "✓ Frontend starting on port 3000 (PID: $FRONTEND_PID)"

# Wait for frontend to start
sleep 3

echo ""
echo "✅ Application is running!"
echo ""
echo "📍 Frontend: http://localhost:3000"
echo "📍 Backend:  http://localhost:5000"
echo ""
echo "To stop the application, press Ctrl+C or run:"
echo "  kill $BACKEND_PID $FRONTEND_PID"
echo ""

# Keep the script running
wait
