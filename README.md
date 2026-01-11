# 120-Day Placement Preparation Challenge App

A clean, beginner-friendly full-stack web application for tracking daily progress over a 120-day placement preparation journey.

## Features

✅ **120-Day Circular Progress Ring** - Visual representation of your journey completion  
✅ **Calendar-Style Task Grid** - One task per day, organized in a clean grid layout  
✅ **24-Hour Task Timers** - Countdown timers for each task with automatic missed detection  
✅ **JWT Authentication** - Secure login and registration system  
✅ **MongoDB Persistence** - All data stored securely in the cloud  
✅ **Responsive Design** - Works perfectly on desktop, tablet, and mobile devices  
✅ **No Postman Required** - Everything managed through an intuitive web interface  

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB Atlas** for cloud database
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Nodemon** for development hot reload

### Frontend
- **React 18** with hooks
- **Vite** for ultra-fast development and bundling
- **Axios** for API communication
- **SVG** for the circular progress ring visualization
- **Vanilla CSS** with gradient themes (no heavy UI libraries)

## Key Components

### Backend Architecture
- **User Model**: Stores user credentials and cycle start date
- **Task Model**: Tracks individual tasks with dayNumber (1-120), completion status, and deadline
- **Authentication Routes**: Signup, login, and user info endpoints
- **Task Routes**: CRUD operations with missed task detection
- **Progress Endpoint**: Calculates completion statistics

### Frontend Components
- **ProgressRing.jsx** - SVG circular progress visualization
- **DayCard.jsx** - Individual day card with task creation/display
- **Timer.jsx** - 24-hour countdown timer with warning states
- **Login.jsx** - Secure login form
- **Signup.jsx** - User registration with password validation
- **Dashboard.jsx** - Main interface with 120-day grid layout

## Installation & Setup

### Prerequisites
- Node.js 16+ and npm
- MongoDB Atlas account (free tier works)
- Git

### Backend Setup

```bash
cd backend
npm install

# Create .env with:
MONGODB_URI=mongodb+srv://admin:Vansh%402004@cluster0.bjuty6b.mongodb.net/daily-tracker
JWT_SECRET=your-secret-key
PORT=5000

npm run dev  # Starts on http://localhost:5000
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev  # Starts on http://localhost:3000
```

## Usage Workflow

1. **Sign Up** - Create account with email and password
2. **Login** - Cycle starts automatically
3. **View Dashboard** - See circular progress ring (Day X of 120) and 120-day calendar grid
4. **Add Tasks** - Click on any day card to add a task
5. **Track Progress** - Watch timers count down (24 hours per task)
6. **Mark Complete** - Check checkbox to complete task
7. **Monitor Progress** - Circular ring fills as you progress

## Task Lifecycle

```
Created → Pending (24h timer) → [Completed OR Missed]
  ↓                                    ↓
[Timer running]                   [Logged in history]
```

## API Reference

### Auth Endpoints
- `POST /api/auth/signup` - Register with name, email, password
- `POST /api/auth/login` - Login with email, password
- `GET /api/auth/me` - Get current user info

### Task Endpoints
- `GET /api/tasks` - Get all tasks with current day info
- `POST /api/tasks` - Create task (body: { title, dayNumber })
- `PATCH /api/tasks/:taskId` - Update task (body: { completed: bool })
- `DELETE /api/tasks/:taskId` - Delete task

### Progress Endpoint
- `GET /api/progress` - Get stats (currentDay, completed, missed, percentage)

## Database Schema

**Users Collection**
```javascript
{
  name: String,
  email: String (unique),
  password: String (bcrypt hashed),
  cycleStartDate: Date,
  createdAt: Date
}
```

**Tasks Collection**
```javascript
{
  userId: ObjectId,
  dayNumber: Number (1-120, unique per user),
  title: String,
  completed: Boolean,
  missed: Boolean (auto-set if deadline passes),
  deadline: Date (24 hours from creation),
  createdAt: Date
}
```

## Design Decisions

### One Task Per Day
- Enforced at database level with unique index on (userId, dayNumber)
- Ensures focus and manageable workload
- Simplified UI without overwhelming options

### 24-Hour Timers
- Auto-detect missed tasks when deadline passes
- Clear deadline for accountability
- Timer persists across page refreshes (stored in DB)

### Circular Progress Ring
- Visual motivation showing journey completion
- Percentage-based fill for quick understanding
- SVG for crisp rendering on all devices

### No Heavy UI Libraries
- Minimal CSS using semantic HTML
- Fast load times
- Full control over styling and animations
- Easy to customize and extend

## Troubleshooting

### "Port 5000 already in use"
```powershell
taskkill /F /IM node.exe
```

### "Cannot connect to MongoDB"
- Check MongoDB Atlas whitelist includes your IP
- Verify connection string in .env
- Ensure cluster is running

### "Signup/Login not working"
- Clear localStorage: `localStorage.clear()`
- Restart both servers
- Check backend console for errors

### "Timers not updating"
- Check browser console for API errors
- Verify backend is running
- Ensure token is valid (may need to re-login)

## Development Commands

```bash
# Backend
cd backend && npm run dev

# Frontend
cd frontend && npm run dev

# Production build
npm run build
npm run preview
```

## Git Workflow

```bash
git add .
git commit -m "message"
git push origin main  # After setting up GitHub remote
```

## Performance

- **Frontend**: Vite handles hot module replacement
- **Backend**: Nodemon auto-restarts on changes
- **Database**: Indexed queries for fast lookups
- **API**: Minimal endpoints, efficient JSON payloads

## Future Enhancements

- Statistics dashboard
- Dark mode
- Email notifications
- Mobile app (React Native)
- Offline support
- Custom challenge lengths
- Team challenges
- Achievement badges

## Deployment

### Backend
- Deploy to Heroku, Railway, or AWS
- Set env variables on hosting platform
- Run `node server.js` as start command

### Frontend  
- Build: `npm run build`
- Deploy to Vercel, Netlify, or GitHub Pages
- Update API endpoint in code

## License

MIT License - Open source and free to use

## Support

Questions? Check:
1. Terminal console for error messages
2. Browser DevTools Network tab for API issues
3. MongoDB Atlas dashboard for database status
4. Backend logs at http://localhost:5000

---

**Ready to start your 120-day challenge?** 🚀
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
