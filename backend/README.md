# 120-Day Placement Prep Todo Backend

Node.js/Express backend for the placement preparation todo application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up MongoDB locally or update `.env` with your MongoDB URI

3. Configure JWT secret in `.env` (change in production)

4. Start the server:
```bash
npm run dev
```

Server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Tasks
- `GET /api/tasks` - Get all tasks for current user
- `GET /api/tasks/day/:dayNumber` - Get task for specific day
- `POST /api/tasks` - Create new task for today
- `PATCH /api/tasks/:taskId` - Update task (mark complete)
- `DELETE /api/tasks/:taskId` - Delete task

## Environment Variables

```
MONGODB_URI=mongodb://localhost:27017/placement-prep-todo
JWT_SECRET=your_secret_key
PORT=5000
NODE_ENV=development
```
