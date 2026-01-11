# 120-Day Placement Preparation Todo App

A full-stack web application designed to help students prepare for placement interviews over a structured 120-day cycle.

## Features

✅ **User Authentication**: Secure signup and login with JWT tokens
✅ **120-Day Cycle**: Automatically starts on first login
✅ **Daily Tasks**: Create exactly one task per day
✅ **24-Hour Timer**: Countdown for each task with persistence across page refreshes
✅ **Task Completion**: Checkbox to mark tasks as done
✅ **Task History**: View all past tasks with completion status
✅ **Progress Tracking**: Visual progress bar showing days completed
✅ **Responsive Design**: Works seamlessly on desktop and mobile
✅ **Secure**: Password hashing with bcrypt, JWT authentication

## Tech Stack

### Backend
- **Node.js** with **Express.js**
- **MongoDB** for data persistence
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Mongoose** for database modeling

### Frontend
- **React 18** with functional components
- **Vite** for fast development and building
- **Axios** for API communication
- **CSS3** for responsive styling

## Project Structure

```
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── tasks.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   ├── package.json
│   ├── .env
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Timer.jsx
│   │   │   └── *.css
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   └── Dashboard.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── README.md
│
└── README.md (this file)
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or provide remote URI)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in `.env`:
```
MONGODB_URI=mongodb://localhost:27017/placement-prep-todo
JWT_SECRET=your_secret_key_here
PORT=5000
NODE_ENV=development
```

4. Start the server:
```bash
npm run dev
```

Server runs on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

Frontend runs on `http://localhost:3000`

## Usage

1. **Sign Up**: Create a new account with name, email, and password
2. **First Login**: The 120-day cycle automatically starts
3. **Create Tasks**: Each day, create one task for placement preparation
4. **Track Progress**: Monitor your task completion and days remaining
5. **Complete Tasks**: Check off tasks before the 24-hour deadline
6. **View History**: Review all past tasks and completion status

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user (starts cycle if first time)
- `GET /api/auth/me` - Get current user (requires authentication)

### Tasks
- `GET /api/tasks` - Get all tasks for current user
- `GET /api/tasks/day/:dayNumber` - Get task for specific day
- `POST /api/tasks` - Create new task for today
- `PATCH /api/tasks/:taskId` - Update task completion status
- `DELETE /api/tasks/:taskId` - Delete task

## How It Works

### 120-Day Cycle
- Starts automatically on the user's first login
- Allows one task per day (days 1-120)
- Each task has a 24-hour deadline from creation
- Progress is tracked visually with a progress bar

### Timer Persistence
- Timer is calculated from the task's deadline timestamp
- Works correctly even after page refresh
- Shows remaining hours, minutes, and seconds
- Displays "Overdue" status when deadline passes
- Shows "Completed" status when task is marked done

### Data Persistence
- All data stored in MongoDB
- JWT tokens stored in localStorage for authentication
- Tasks persist across browser sessions
- Timer calculations based on server-stored deadlines

## Deployment

### Using MongoDB Atlas (Recommended for Production)

1. Create a MongoDB Atlas account and cluster
2. Update `.env` with your MongoDB URI:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/placement-prep-todo
```

### Deploying Backend

Options:
- **Heroku**: `git push heroku main`
- **Render**: Connect GitHub repo and deploy
- **AWS EC2**: Deploy Node.js application
- **DigitalOcean**: Simple Node.js hosting

### Deploying Frontend

Build the frontend:
```bash
npm run build
```

Options:
- **Vercel**: Connect GitHub and deploy
- **Netlify**: Deploy the `dist` folder
- **Same server**: Serve static files from backend

## Production Checklist

- [ ] Change `JWT_SECRET` to a strong, random string
- [ ] Set `NODE_ENV=production`
- [ ] Use MongoDB Atlas or managed database
- [ ] Enable HTTPS
- [ ] Set up CORS properly for your domain
- [ ] Add rate limiting to API endpoints
- [ ] Set up error logging and monitoring
- [ ] Add email verification for signup
- [ ] Implement password reset functionality
- [ ] Set up automated backups

## Future Enhancements

- [ ] Email notifications for task reminders
- [ ] Analytics dashboard showing completion rates
- [ ] Leaderboard for competitive learning
- [ ] Task categories and tags
- [ ] Notes/comments on tasks
- [ ] Habit tracking integration
- [ ] Mobile app versions
- [ ] Dark mode support

## Troubleshooting

**MongoDB Connection Error**: Ensure MongoDB is running and connection string is correct
**CORS Error**: Check backend CORS configuration matches your frontend URL
**Timer Not Updating**: Ensure browser has JavaScript enabled
**Tasks Not Persisting**: Check browser's localStorage is enabled

## License

MIT

## Support

For issues or questions, please check the individual README files in `backend/` and `frontend/` directories.
