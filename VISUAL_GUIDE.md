# 🎯 120-Day Placement Prep Todo App - Visual Guide

## What Does This App Do?

### The Concept
```
Day 1          Day 50         Day 100        Day 120
 |              |              |              |
 v              v              v              v
[Start] -----> [Progress] -----> [Progress] -----> [END - Celebrate! 🎉]
 
Each day: Create 1 task → 24h deadline → Complete or Miss
```

---

## User Interface Preview

### 1. Login / Signup Screen
```
┌─────────────────────────────────┐
│                                 │
│    120-Day Placement Prep       │
│   Continue your journey         │
│                                 │
│  Email: [_______________]       │
│  Password: [___________]        │
│                                 │
│  [Login Button]                 │
│                                 │
│  Don't have account? Sign up    │
└─────────────────────────────────┘
```

### 2. Main Dashboard
```
┌──────────────────────────────────────────────────────┐
│ 120-Day Placement Prep          Welcome, John    [Logout] │
├──────────────────────────────────────────────────────┤
│                                                      │
│ Day 15 of 120                                        │
│ ███████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│                                                      │
├──────────────────────────────────────────────────────┤
│ TODAY'S TASK (Day 15)                                │
│                                                      │
│ [What will you accomplish today?_____________]      │
│                                   [Add Task]        │
│                                                      │
├──────────────────────────────────────────────────────┤
│ ☑ Learn sorting algorithms      ⏱ 23h 45m 20s      │
│                                                      │
├──────────────────────────────────────────────────────┤
│ PREVIOUS TASKS (14)                                  │
│                                                      │
│ ☑ Day 1: Study arrays           ✓ Completed        │
│ ☑ Day 2: Learn linked lists     ✓ Completed        │
│ ☑ Day 3: Understand stacks      ✓ Completed        │
│ ...                                                  │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### 3. Task States

#### Pending Task (Active)
```
☐ Study Dynamic Programming    ⏱ 12h 34m 15s
  (Red timer, not completed yet)
```

#### Completed Task
```
☑ Study Dynamic Programming    ✓ Completed
  (Green checkmark, strikethrough text)
```

#### Overdue Task
```
☐ Study Dynamic Programming    ✗ Missed
  (Red background, missed status)
```

#### Task with Different Completion
```
(After task is marked complete)
☑ Study Dynamic Programming    ✓ Completed
  (Green background, text strikethrough)
```

---

## How the 120-Day Cycle Works

### Timeline Example
```
Day 1:   User signs up
         Cycle start date set to today
         Can create first task
         
Day 2:   New day available
         Create second task
         First task visible in history
         
...

Day 119: Almost there!
         Second to last day
         
Day 120: Last day of cycle
         Final task can be created
         
Day 121: Cycle complete
         ✅ Cannot create new tasks
         🎉 Celebration message shown
         All tasks visible in history
```

---

## Timer Behavior Over 24 Hours

```
Task Created:    23h 59m 59s remaining  ← Full 24 hours
After 1 hour:    22h 59m 59s remaining
After 12 hours:  11h 59m 59s remaining
After 23 hours:   0h 59m 59s remaining
After 23:59:     ✗ MISSED (deadline passed)

But if you mark complete:
                 ✓ COMPLETED (green indicator)
```

---

## Data Structures

### User Object
```javascript
{
  _id: "507f1f77bcf86cd799439011",
  name: "John Doe",
  email: "john@example.com",
  password: "hashed_password_with_bcrypt",
  cycleStartDate: "2024-01-11T10:30:00.000Z",
  createdAt: "2024-01-11T10:30:00.000Z"
}
```

### Task Object
```javascript
{
  _id: "507f1f77bcf86cd799439012",
  userId: "507f1f77bcf86cd799439011",  // Link to user
  text: "Study Array Data Structures",
  dayNumber: 5,                         // Which day in 120
  completed: false,
  createdAt: "2024-01-15T08:00:00.000Z",
  deadline: "2024-01-16T08:00:00.000Z" // 24 hours later
}
```

---

## API Communication Sequence

### Login Flow
```
Frontend                          Backend                  Database
   |                                |                         |
   |--POST /auth/login---->        |                         |
   |                               |--Query User---->        |
   |                               |<---Return User----      |
   |                               |                         |
   |                    (Verify password with bcrypt)        |
   |                               |                         |
   |                    (Generate JWT token)                 |
   |                               |                         |
   |<----Token + User Data-----    |                         |
   |                               |                         |
   |(Store token in localStorage)  |                         |
```

### Task Creation Flow
```
Frontend                          Backend                  Database
   |                                |                         |
   |--POST /api/tasks---->         |                         |
   |(with JWT token)               |                         |
   |                    (Verify JWT token)                   |
   |                               |--Get User---->          |
   |                               |<---Return User--        |
   |                               |                         |
   |                    (Calculate current day)              |
   |                               |                         |
   |                               |--Check duplicate---->  |
   |                               |<---No duplicate----     |
   |                               |                         |
   |                  (Create deadline = now + 24h)          |
   |                               |                         |
   |                               |--Save Task---->        |
   |                               |<---Task saved---       |
   |                               |                         |
   |<----Task + CurrentDay----     |                         |
   |                               |                         |
   |(Update local state, render)   |                         |
```

---

## Component Hierarchy

```
App.jsx (Root)
├── Signup.jsx
│   └── Auth.css
├── Login.jsx
│   └── Auth.css
└── Dashboard.jsx
    ├── Timer.jsx
    │   └── Timer.css
    ├── Dashboard.css
    └── (Task components inline)
```

---

## Deployment Architecture

### Development
```
Laptop/Computer
├── Frontend (http://localhost:3000)
├── Backend (http://localhost:5000)
└── MongoDB (localhost:27017)
```

### Production (Recommended)
```
Internet (Users)
    ↓
Vercel (Frontend) ← static files
    ↓
Render (Backend) ← API requests
    ↓
MongoDB Atlas (Database) ← data persistence
```

---

## Security Visualization

### Password Security
```
User Types:    "MyPassword123"
                       ↓
             Bcrypt Hashing (10 rounds)
                       ↓
Stored as:     "$2b$10$N9qo8uLOickgx2ZMRZoMye..."
                       ↓
During Login:  Compare typed password with hash
               (never store plain text!)
```

### JWT Token Flow
```
User Logs In
    ↓
Generate JWT: {
  header: { alg: "HS256" },
  payload: { id: "user123" },
  signature: "encrypted..."
}
    ↓
Send to Client
    ↓
Client Stores in localStorage
    ↓
Client Sends with Every Request
    ↓
Server Verifies & Processes Request
    ↓
Token Expires in 7 Days (user must re-login)
```

---

## Database Schema Visualization

### Users Collection
```
users
├── _id (ObjectId)
├── name (String)
├── email (String) [UNIQUE INDEX]
├── password (String - hashed)
├── cycleStartDate (Date)
└── createdAt (Date)
```

### Tasks Collection
```
tasks
├── _id (ObjectId)
├── userId (ObjectId - references users)
├── text (String)
├── dayNumber (Number 1-120)
├── completed (Boolean)
├── createdAt (Date)
├── deadline (Date)
└── UNIQUE INDEX: (userId, dayNumber)
```

---

## Responsive Design Breakpoints

```
Mobile      Tablet         Desktop
(320px)     (768px)        (1024px)
  |           |              |
  v           v              v
┌──────┐   ┌─────────┐   ┌──────────────┐
│ Task │   │  Task   │   │    Task      │
│List  │   │  List   │   │    List      │
└──────┘   └─────────┘   └──────────────┘
 Stacked    Side by      Full width
 Layout     side Layout   Layout
```

---

## Error Handling Flow

### Network Error
```
User Action (e.g., create task)
    ↓
Axios Request
    ↓
Network Fails (no connection)
    ↓
Catch Block Triggered
    ↓
Show User: "Network error. Check your connection."
    ↓
Retry Option Available
```

### Validation Error
```
User submits empty task text
    ↓
Frontend Validation catches it
    ↓
Show: "Please enter a task"
    ↓
Request never sent to server
```

### Authorization Error
```
User without token tries to access /api/tasks
    ↓
Backend receives request without "Authorization" header
    ↓
Returns: 401 Unauthorized
    ↓
Frontend catches 401
    ↓
Redirect to login page
    ↓
Clear localStorage
```

---

## Feature Roadmap

### Completed ✅
```
[✓] User authentication (signup/login)
[✓] 120-day cycle management
[✓] Daily task creation
[✓] 24-hour timer
[✓] Task completion tracking
[✓] Progress visualization
[✓] Responsive UI
[✓] Data persistence
```

### Future Enhancements 📋
```
[ ] Email notifications
[ ] Task categories
[ ] Analytics dashboard
[ ] Leaderboard
[ ] Mobile app
[ ] Dark mode
[ ] Advanced statistics
[ ] Social sharing
```

---

## Performance Metrics

### Expected Response Times
```
Signup:         < 500ms  (password hashing takes time)
Login:          < 300ms
Create Task:    < 100ms
Update Task:    < 100ms
Fetch Tasks:    < 50ms   (local database)
```

### Page Load Times
```
Frontend:       < 3 seconds (initial load)
Timer Update:   Every 1 second (smooth)
Page Refresh:   < 1 second (data reload)
```

---

## Testing Checklist Visualized

### Happy Path (Everything Works)
```
Signup → Login → Create Task → See Timer → Mark Complete → Logout
  ✓       ✓         ✓            ✓              ✓           ✓
```

### Edge Cases
```
Create task twice same day          → ✗ Should fail
Try to access without login         → ✗ Should redirect
Create task after day 120           → ✗ Should block
Mark task complete then incomplete  → ✓ Should toggle
```

---

## Summary

This application follows modern web development best practices:
- ✅ Clean separation of concerns (frontend/backend)
- ✅ Secure authentication (JWT + bcrypt)
- ✅ Responsive design for all devices
- ✅ Real-time updates (timer)
- ✅ Data persistence (MongoDB)
- ✅ Error handling at all levels
- ✅ Production-ready code

**Ready to launch!** 🚀
