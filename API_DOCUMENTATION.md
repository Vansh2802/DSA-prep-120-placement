# API Documentation

## Base URL
- **Development**: `http://localhost:5000`
- **Production**: Your deployed backend URL

## Authentication

All authenticated endpoints require:
```
Headers:
Authorization: Bearer <JWT_TOKEN>
```

---

## Auth Endpoints

### POST /api/auth/signup

Create a new user account and get JWT token.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secure_password_123"
}
```

**Response (201 Created):**
```json
{
  "message": "User created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error Responses:**
```json
// Missing fields
{ "message": "Please provide name, email, and password" }

// User already exists
{ "message": "User already exists" }
```

---

### POST /api/auth/login

Login with email and password. Automatically starts 120-day cycle on first login.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "secure_password_123"
}
```

**Response (200 OK):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "cycleStartDate": "2024-01-11T10:30:00.000Z"
  }
}
```

**Error Responses:**
```json
// Invalid credentials
{ "message": "Invalid credentials" }

// Missing fields
{ "message": "Please provide email and password" }
```

---

### GET /api/auth/me

Get current authenticated user details.

**Headers Required:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "cycleStartDate": "2024-01-11T10:30:00.000Z",
  "createdAt": "2024-01-11T09:15:00.000Z"
}
```

**Error Responses:**
```json
// No token provided
{ "message": "No token, authorization denied" }

// Invalid token
{ "message": "Token is not valid" }
```

---

## Task Endpoints

### GET /api/tasks

Get all tasks for current user along with current day information.

**Headers Required:** `Authorization: Bearer <token>`

**Query Parameters:** None

**Response (200 OK):**
```json
{
  "tasks": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "userId": "507f1f77bcf86cd799439011",
      "text": "Study Array Data Structures",
      "dayNumber": 5,
      "completed": true,
      "createdAt": "2024-01-15T08:00:00.000Z",
      "deadline": "2024-01-16T08:00:00.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439013",
      "userId": "507f1f77bcf86cd799439011",
      "text": "Solve 10 LeetCode problems",
      "dayNumber": 6,
      "completed": false,
      "createdAt": "2024-01-16T09:30:00.000Z",
      "deadline": "2024-01-17T09:30:00.000Z"
    }
  ],
  "currentDay": 6,
  "cycleStartDate": "2024-01-11T10:30:00.000Z"
}
```

**Error Responses:**
```json
// Cycle not started
{ "message": "Cycle not started" }
```

---

### GET /api/tasks/day/:dayNumber

Get task for a specific day.

**Headers Required:** `Authorization: Bearer <token>`

**Path Parameters:**
- `dayNumber` (number): Day number (1-120)

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "userId": "507f1f77bcf86cd799439011",
  "text": "Study Array Data Structures",
  "dayNumber": 5,
  "completed": true,
  "createdAt": "2024-01-15T08:00:00.000Z",
  "deadline": "2024-01-16T08:00:00.000Z"
}
```

**Response (200 OK) - No task:**
```json
null
```

---

### POST /api/tasks

Create a new task for today. Only one task per day is allowed.

**Headers Required:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "text": "Complete system design project"
}
```

**Response (201 Created):**
```json
{
  "message": "Task created successfully",
  "task": {
    "_id": "507f1f77bcf86cd799439014",
    "userId": "507f1f77bcf86cd799439011",
    "text": "Complete system design project",
    "dayNumber": 6,
    "completed": false,
    "createdAt": "2024-01-16T10:00:00.000Z",
    "deadline": "2024-01-17T10:00:00.000Z"
  },
  "currentDay": 6
}
```

**Error Responses:**
```json
// Empty task text
{ "message": "Task text is required" }

// Task already exists for today
{ "message": "Task already exists for today" }

// Cycle not started
{ "message": "Cycle not started" }

// Cycle complete
{ "message": "120-day cycle is complete" }
```

---

### PATCH /api/tasks/:taskId

Update task completion status.

**Headers Required:** `Authorization: Bearer <token>`

**Path Parameters:**
- `taskId` (ObjectId): Task ID

**Request Body:**
```json
{
  "completed": true
}
```

**Response (200 OK):**
```json
{
  "message": "Task updated",
  "task": {
    "_id": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439011",
    "text": "Study Array Data Structures",
    "dayNumber": 5,
    "completed": true,
    "createdAt": "2024-01-15T08:00:00.000Z",
    "deadline": "2024-01-16T08:00:00.000Z"
  }
}
```

**Error Responses:**
```json
// Task not found
{ "message": "Task not found" }

// Not task owner
{ "message": "Not authorized" }
```

---

### DELETE /api/tasks/:taskId

Delete a task.

**Headers Required:** `Authorization: Bearer <token>`

**Path Parameters:**
- `taskId` (ObjectId): Task ID

**Response (200 OK):**
```json
{
  "message": "Task deleted"
}
```

**Error Responses:**
```json
// Task not found
{ "message": "Task not found" }

// Not task owner
{ "message": "Not authorized" }
```

---

## Health Check

### GET /api/health

Check if backend server is running.

**Response (200 OK):**
```json
{
  "status": "Server is running"
}
```

---

## Error Handling

### Common HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request succeeded |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input or validation error |
| 401 | Unauthorized - Missing or invalid token |
| 403 | Forbidden - Authenticated but not authorized |
| 404 | Not Found - Resource doesn't exist |
| 500 | Server Error - Internal server error |

### Error Response Format

```json
{
  "message": "Error description",
  "error": "Additional error details (production: omitted)"
}
```

---

## Data Models

### User Schema
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique, lowercase),
  password: String (hashed with bcrypt),
  cycleStartDate: Date (null until first login),
  createdAt: Date
}
```

### Task Schema
```javascript
{
  _id: ObjectId,
  userId: ObjectId (references User),
  text: String,
  dayNumber: Number (1-120),
  completed: Boolean,
  createdAt: Date,
  deadline: Date
}
```

**Unique Index:** (userId, dayNumber) - Ensures one task per user per day

---

## Rate Limiting (Production Recommended)

Consider adding rate limiting:
```javascript
npm install express-rate-limit

const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

app.use('/api/', limiter);
```

---

## Testing API with cURL

### Signup
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Create Task
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "text": "Learn MongoDB"
  }'
```

### Get All Tasks
```bash
curl -X GET http://localhost:5000/api/tasks \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Testing API with Postman

1. Create a new Postman collection
2. Add environment variable `token` for storing JWT
3. Create requests for each endpoint
4. Use pre-request scripts to automatically update `token` after login

---

## Notes

- JWT tokens expire in 7 days
- Passwords are hashed with bcrypt (salt rounds: 10)
- All timestamps are in UTC
- Task deadline is always 24 hours from creation
- Day number is calculated from cycle start date, not task creation date
