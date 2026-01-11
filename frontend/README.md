# 120-Day Placement Prep Todo Frontend

React frontend for the placement preparation todo application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

## Features

- **Authentication**: Signup and Login with JWT tokens
- **120-Day Cycle**: Automatic cycle start on first login
- **Daily Tasks**: Create one task per day with 24-hour deadline
- **Timer**: Real-time countdown that persists across page refreshes
- **Task Management**: Check off completed tasks and view task history
- **Responsive Design**: Works on desktop and mobile devices

## Environment

The frontend is configured to proxy API requests to `http://localhost:5000` via Vite's proxy configuration.
