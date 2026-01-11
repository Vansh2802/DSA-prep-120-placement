# Quick Start Guide

## Prerequisites
- Node.js 14+ (https://nodejs.org)
- MongoDB (local or MongoDB Atlas)

## Windows Users

Double-click `start.bat` to run everything with one click!

```bash
start.bat
```

This will:
1. Install backend dependencies
2. Start backend server on port 5000
3. Install frontend dependencies
4. Start frontend server on port 3000

Then open: http://localhost:3000

## Mac/Linux Users

Make the script executable:
```bash
chmod +x start.sh
./start.sh
```

Or manually start each service:

### Terminal 1 - Backend
```bash
cd backend
npm install
npm run dev
```

### Terminal 2 - Frontend
```bash
cd frontend
npm install
npm run dev
```

## Verify Everything Works

1. **Backend Health Check**
   ```
   curl http://localhost:5000/api/health
   ```
   Should return: `{"status":"Server is running"}`

2. **Frontend**
   Open http://localhost:3000 in browser
   Should see login/signup page

3. **MongoDB**
   If local: `mongosh` should connect
   If Atlas: Check connection string in `.env`

## Create Test Account

1. Go to http://localhost:3000
2. Click "Sign up"
3. Enter any credentials (e.g., demo@test.com / password123)
4. 120-day cycle automatically starts
5. Create your first daily task!

## Stopping the Application

### Windows
- Close the command windows or press Ctrl+C in each

### Mac/Linux
- Press Ctrl+C in each terminal or run:
```bash
pkill -f "npm run dev"
```

## Troubleshooting

### "MongoDB connection error"
- Make sure MongoDB is running
- Check connection string in `.env`
- If using MongoDB Atlas, check IP whitelist

### "Port already in use"
- Backend uses 5000, Frontend uses 3000
- Change ports in `.env` (backend) and `vite.config.js` (frontend)

### "Cannot find module"
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

### "CORS error"
- Backend CORS is configured for `localhost:3000`
- Update if using different frontend URL

## Development Commands

### Backend
```bash
cd backend

# Start development server with auto-reload
npm run dev

# Start production server
npm start

# Run tests (when added)
npm test
```

### Frontend
```bash
cd frontend

# Start Vite development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

## File Structure Quick Reference

```
├── backend/           # Express server
│   ├── server.js      # Entry point
│   ├── routes/        # API endpoints
│   └── models/        # MongoDB schemas
│
└── frontend/          # React app
    ├── src/main.jsx   # Entry point
    ├── src/App.jsx    # Main component
    └── src/pages/     # Page components
```

## Next Steps

1. **Sign up** and create test account
2. **Explore** the 120-day cycle
3. **Create tasks** daily and track progress
4. **Customize** colors/styles in CSS files
5. **Deploy** using DEPLOYMENT.md guide

## Getting Help

- Check README.md for full documentation
- See DEPLOYMENT.md for production setup
- Look at individual component files for code comments
- MongoDB docs: docs.mongodb.com
- React docs: react.dev

Happy coding! 🚀
