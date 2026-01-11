# Testing & Verification Guide

## Pre-Launch Checklist

Before running the application, verify everything is installed and configured correctly.

### 1. Prerequisites Check

```bash
# Check Node.js version (should be 14+)
node --version

# Check npm version
npm --version

# Check MongoDB is running
mongosh --version  # For Atlas, just need the connection string
```

### 2. Environment Setup

**Backend:**
```bash
cd backend

# Check .env file exists and has correct MongoDB URI
cat .env

# Verify MongoDB connection
# Uncomment test code in server.js to test connection
```

**Frontend:**
```bash
cd frontend

# Verify vite.config.js has correct backend proxy
cat vite.config.js
```

---

## Manual Testing Scenarios

### Scenario 1: User Registration & First Login

**Steps:**
1. Go to http://localhost:3000
2. Click "Sign up"
3. Enter:
   - Name: "Test Student"
   - Email: "student001@test.com"
   - Password: "Password123!"
4. Click "Create Account"

**Expected Results:**
- ✅ Redirects to dashboard
- ✅ Shows "Welcome, Test Student"
- ✅ Shows "Day 1 of 120"
- ✅ Task input form appears
- ✅ Progress bar at 0%

**Verify in MongoDB:**
```bash
# Connect to MongoDB
mongosh mongodb://localhost:27017/placement-prep-todo

# Check user created
db.users.findOne({ email: "student001@test.com" })

# Verify cycleStartDate is set to today
```

---

### Scenario 2: Create First Task

**Steps:**
1. Enter task: "Learn Array Concepts"
2. Click "Add Task"

**Expected Results:**
- ✅ Task appears on dashboard
- ✅ Shows timer with ~24 hours countdown
- ✅ Checkbox unchecked
- ✅ Shows "Day 1: Learn Array Concepts"
- ✅ Cannot create another task today (shows "already created")

**Verify in MongoDB:**
```bash
db.tasks.findOne({ dayNumber: 1 })

# Should show:
# - text: "Learn Array Concepts"
# - completed: false
# - dayNumber: 1
# - deadline: (today + 24 hours)
```

---

### Scenario 3: Timer Functionality

**Steps:**
1. Note the time displayed in timer (e.g., "23h 59m 45s")
2. Wait 5 seconds
3. Observe timer countdown

**Expected Results:**
- ✅ Timer decrements every second
- ✅ Format always shows "Xh Ym Zs"
- ✅ Can see ~5 seconds elapsed
- ✅ Timer shows red background

**Advanced Test:**
1. Open browser DevTools
2. Go to Application > Storage > Local Storage
3. Find entry with deadline timestamp
4. Refresh page
5. Timer should continue from same position (not reset)

---

### Scenario 4: Task Completion

**Steps:**
1. Click checkbox next to task
2. Task should be marked complete

**Expected Results:**
- ✅ Checkbox becomes checked
- ✅ Task text becomes strikethrough
- ✅ Timer shows "✓ Completed" (green)
- ✅ Unclick to mark incomplete again

**Verify in MongoDB:**
```bash
db.tasks.findOne({ _id: ObjectId("...") })
# completed should be: true
```

---

### Scenario 5: Multi-Day Testing

**Manual Test (Real-time):**
1. Create task on Day 1
2. Mark as complete
3. Check "Day 1 of 120" in dashboard
4. Next day, create new task
5. Verify shows "Day 2 of 120"

**Fast-track Testing (Modify cycleStartDate):**

In MongoDB:
```javascript
// Set cycleStartDate to 10 days ago
db.users.updateOne(
  { email: "student001@test.com" },
  { $set: { cycleStartDate: new Date(new Date().getTime() - 10*24*60*60*1000) } }
)
```

Refresh frontend:
- Should show "Day 11 of 120"
- Can create task for Day 11

---

### Scenario 6: 120-Day Completion

**Testing the cycle completion:**

In MongoDB:
```javascript
// Set cycleStartDate to 119 days ago
db.users.updateOne(
  { email: "student001@test.com" },
  { $set: { cycleStartDate: new Date(new Date().getTime() - 119*24*60*60*1000) } }
)

// Create tasks for days 1-119 (optional for quick test)
```

Refresh frontend:
- Should show "Day 120 of 120"
- Can create one more task
- After day 120, should show "🎉 Congratulations!" message
- Cannot create more tasks

---

### Scenario 7: Multi-User Isolation

**Steps:**
1. Logout from first account
2. Create new account:
   - Email: "student002@test.com"
   - Password: "Password456!"
3. Create a task for this user
4. Login with first account
5. Verify only your tasks appear

**Expected Results:**
- ✅ Each user sees only their own tasks
- ✅ Separate cycle start dates
- ✅ Independent progress tracking

**Verify in MongoDB:**
```bash
db.tasks.find({ userId: <user1_id> })
db.tasks.find({ userId: <user2_id> })
# Should have completely different task sets
```

---

### Scenario 8: Session Persistence

**Steps:**
1. Login to application
2. Create a task
3. Close browser completely
4. Reopen browser to http://localhost:3000
5. Page should show logged in user and task

**Expected Results:**
- ✅ Still logged in (token in localStorage)
- ✅ Dashboard loads with existing tasks
- ✅ Timer continues correctly
- ✅ No need to login again

**Verify localStorage:**
```javascript
// In browser console (F12)
localStorage.getItem('token')        // Should show JWT token
localStorage.getItem('user')         // Should show user JSON
```

---

### Scenario 9: Timer After Deadline

**Testing overdue tasks:**

In MongoDB:
```javascript
// Set deadline to 1 hour ago
db.tasks.updateOne(
  { dayNumber: 1 },
  { $set: { deadline: new Date(new Date().getTime() - 60*60*1000) } }
)
```

Refresh frontend:
- Task should show "✗ Missed" in red
- Timer text replaced with "Overdue"
- Can still mark as complete (shows "✓ Completed")

---

### Scenario 10: Logout & Security

**Steps:**
1. Click "Logout" button
2. Should redirect to login page
3. Verify localStorage cleared:
   ```javascript
   // Console check
   localStorage.getItem('token')      // Should be null
   localStorage.getItem('user')       // Should be null
   ```

**Expected Results:**
- ✅ Redirected to login page
- ✅ Cannot access dashboard without logging in
- ✅ Token removed from storage
- ✅ Can login with any account

---

## API Testing with cURL

### Test Signup
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "TestPass123"
  }'
```

### Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123"
  }'
```

**Save token from response**, then use in subsequent requests:
```bash
TOKEN="eyJhbGciOiJIUzI1NiIs..."
```

### Test Get Current User
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

### Test Create Task
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "text": "Learn React Hooks"
  }'
```

### Test Get All Tasks
```bash
curl -X GET http://localhost:5000/api/tasks \
  -H "Authorization: Bearer $TOKEN"
```

### Test Get Specific Day Task
```bash
curl -X GET http://localhost:5000/api/tasks/day/1 \
  -H "Authorization: Bearer $TOKEN"
```

### Test Update Task (Mark Complete)
```bash
TASK_ID="507f1f77bcf86cd799439012"

curl -X PATCH http://localhost:5000/api/tasks/$TASK_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "completed": true
  }'
```

### Test Delete Task
```bash
curl -X DELETE http://localhost:5000/api/tasks/$TASK_ID \
  -H "Authorization: Bearer $TOKEN"
```

---

## Testing with Postman

1. **Create Collection**: "120-Day Prep API"

2. **Add Environment Variable**:
   ```
   baseUrl = http://localhost:5000
   token = <leave empty initially>
   ```

3. **Create Requests**:

**POST /auth/signup**
```json
POST {{baseUrl}}/api/auth/signup

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "Password123"
}

Pre-request Script:
// None needed

Tests:
pm.environment.set("token", pm.response.json().token);
```

**POST /auth/login**
```json
POST {{baseUrl}}/api/auth/login

{
  "email": "test@example.com",
  "password": "Password123"
}

Tests:
pm.environment.set("token", pm.response.json().token);
```

**GET /tasks**
```json
GET {{baseUrl}}/api/tasks
Headers:
Authorization: Bearer {{token}}

Tests:
pm.test("Status is 200", () => {
  pm.response.to.have.status(200);
});
pm.test("Has tasks array", () => {
  pm.expect(pm.response.json().tasks).to.be.an('array');
});
```

**POST /tasks**
```json
POST {{baseUrl}}/api/tasks
Headers:
Authorization: Bearer {{token}}

{
  "text": "Complete system design"
}

Tests:
pm.test("Task created", () => {
  pm.response.to.have.status(201);
});
```

---

## Browser Console Testing

### Check Authentication
```javascript
// Show token
console.log(localStorage.getItem('token'));

// Show user
console.log(JSON.parse(localStorage.getItem('user')));

// Manually set token (testing)
localStorage.setItem('token', 'your-token-here');
```

### Check API Calls
```javascript
// In DevTools Network tab, filter for /api/
// Should see all API calls with status codes

// Check for CORS errors
console.log('Check Console tab for any red errors')
```

### Inspect Database (if using MongoDB Compass)
```javascript
// Connect: mongodb://localhost:27017
// Database: placement-prep-todo
// Collections: users, tasks
// View documents and verify structure
```

---

## Performance Testing

### Response Time Measurement
```bash
# Time a request
time curl -X GET http://localhost:5000/api/tasks \
  -H "Authorization: Bearer $TOKEN"

# Should complete in < 100ms (local)
```

### Load Testing (Advanced)
```bash
# Install Apache Bench
# macOS: brew install httpd

# Run load test
ab -n 100 -c 10 http://localhost:5000/api/health

# Results show requests per second and response times
```

---

## Common Test Failures & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| Cannot connect to backend | Server not running | `npm run dev` in backend folder |
| "MongoDB connection error" | MongoDB not running | Start MongoDB: `mongod` |
| CORS error | Proxy not configured | Check vite.config.js proxy settings |
| "No token" error | Not logged in | Signup/Login first |
| Timer shows "NaN" | Invalid deadline timestamp | Check database deadline field |
| Cannot create task | "Task already exists" | Already created today, wait until tomorrow |
| Tasks not visible | Wrong user logged in | Logout and login with correct account |

---

## Quality Checklist

- [ ] **Code Quality**
  - [ ] No console.error in production builds
  - [ ] Proper error handling in all functions
  - [ ] Comments on complex logic
  - [ ] Consistent code formatting

- [ ] **Security**
  - [ ] Passwords properly hashed
  - [ ] JWT tokens properly validated
  - [ ] No sensitive data in localStorage (only token)
  - [ ] CORS properly restricted

- [ ] **Performance**
  - [ ] API responses < 200ms
  - [ ] Timer updates smoothly
  - [ ] Page load < 3 seconds
  - [ ] No memory leaks

- [ ] **Functionality**
  - [ ] All endpoints working
  - [ ] All UI components rendering
  - [ ] Timer persists across refresh
  - [ ] Data saves to database

- [ ] **Responsiveness**
  - [ ] Works on mobile (320px+)
  - [ ] Works on tablet (768px+)
  - [ ] Works on desktop (1024px+)
  - [ ] Touch-friendly buttons

---

## Next Steps

After successful testing:
1. Deploy backend to Render/Heroku
2. Deploy frontend to Vercel/Netlify
3. Update frontend API URL for production
4. Test production deployment
5. Monitor error logs
6. Gather user feedback
7. Iterate and improve

Good luck with testing! 🧪✅
