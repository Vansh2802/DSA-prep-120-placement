# 🚀 120-Day Placement Prep - Full Stack Application

A modern, full-stack web application to help you prepare for placements over 120 days with daily task tracking, progress monitoring, and a beautiful UI.

## ✨ Features

- **User Authentication** - Secure login & signup with JWT tokens
- **Start Cycle** - Begin your 120-day placement preparation journey with one click
- **Daily Tasks** - Create, track, and complete one task per day
- **Progress Tracking** - Visual progress bar showing your journey (Day X of 120)
- **Task Management** - Mark tasks complete, delete tasks, view past tasks
- **Timer** - Countdown timer for each task (24-hour deadline)
- **Responsive Design** - Beautiful UI that works on desktop and mobile
- **MongoDB Integration** - Secure data persistence

## 🛠️ Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Frontend
- **React 18** - UI library
- **Vite** - Build tool & dev server
- **Axios** - HTTP client
- **CSS3** - Modern styling with gradients

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB Atlas account (or local MongoDB)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd daily-progress-tracker
```

### 2. Setup Backend

```bash
cd backend
npm install

# Create .env file
cat > .env << EOF
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/daily-tracker
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
EOF

npm run dev
```

Backend will start on **http://localhost:5000**

### 3. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend will start on **http://localhost:3000**

## 📱 How to Use

1. **Sign Up** - Create a new account with your name, email, and password
2. **Start Cycle** - Click "Start 120-Day Cycle" button to begin
3. **Add Daily Task** - Enter your task for the day (Day 1 of 120)
4. **Track Progress** - Check off completed tasks and watch your progress grow
5. **View History** - See all your previous tasks and completion status

## 🔑 Environment Variables

Create a `.env` file in the `backend` folder:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database-name
JWT_SECRET=your-secret-key-here
PORT=5000
```

**Important:** Keep your `.env` file private and never commit it to GitHub.

## 📚 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/start-cycle` - Start the 120-day cycle

### Tasks
- `GET /api/tasks` - Get all tasks for current user
- `POST /api/tasks` - Create a new task for today
- `PATCH /api/tasks/:taskId` - Update task (mark complete/incomplete)
- `DELETE /api/tasks/:taskId` - Delete a task

## 🎨 UI Features

- **Gradient Background** - Beautiful purple gradient theme
- **Smooth Animations** - Slide-up animations and transitions
- **Progress Bar** - Visual representation of 120-day progress
- **Task Cards** - Color-coded cards (today's task highlighted)
- **Responsive Layout** - Mobile-friendly design

## 📦 Project Structure

```
daily-progress-tracker/
├── backend/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   ├── middleware/      # Auth middleware
│   ├── server.js        # Main server file
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── api/         # API utilities
│   │   ├── App.jsx      # Main app component
│   │   └── main.jsx     # Entry point
│   └── package.json
└── package.json         # Root package config
```

## 🔐 Security

- Passwords are hashed using bcryptjs
- JWT tokens expire after 7 days
- API routes are protected with authentication middleware
- MongoDB credentials stored in environment variables

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000 (backend)
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Kill process on port 3000 (frontend)
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### MongoDB Connection Error
- Check MONGODB_URI in .env file
- Ensure MongoDB Atlas IP whitelist includes your IP
- Verify database credentials

### "Cycle not started" Error
- Click "Start 120-Day Cycle" button when you see this screen
- You only need to do this once per account

## 🚀 Deployment

### Deploy Backend (Vercel/Heroku)
```bash
# Add engine info to package.json
{
  "engines": {
    "node": "18"
  }
}
```

### Deploy Frontend (Vercel/Netlify)
```bash
npm run build
# Upload dist/ folder
```

## 📝 License

MIT License - Feel free to use this project for learning and personal use.

## 👨‍💻 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## 📧 Support

For issues or questions, please open an issue on GitHub.

---

**Happy Coding! 🎉**

Start your 120-day placement preparation journey today!
