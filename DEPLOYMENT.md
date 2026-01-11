# Deployment Guide

## Quick Start (Local Development)

### Prerequisites
1. **MongoDB**: Install locally from mongodb.com or use MongoDB Atlas
2. **Node.js**: v14+ from nodejs.org
3. **Git**: For version control

### Step 1: Start MongoDB

**Local MongoDB:**
```bash
mongod
```

**MongoDB Atlas (Cloud):**
- Create account at mongodb.com
- Create a cluster
- Get connection string
- Update `.env` with connection string

### Step 2: Start Backend

```bash
cd backend
npm install
npm run dev
```

Expected output:
```
✓ MongoDB connected
✓ Server running on port 5000
```

### Step 3: Start Frontend

In a new terminal:
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## Production Deployment

### Option 1: Render.com (Recommended)

**Backend Deployment:**

1. Push code to GitHub
2. Create account at render.com
3. Click "New" → "Web Service"
4. Connect GitHub repository
5. Configure:
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Environment Variables**:
     ```
     MONGODB_URI=<your-mongodb-atlas-uri>
     JWT_SECRET=<generate-random-string>
     NODE_ENV=production
     ```
6. Deploy

**Frontend Deployment:**

1. Build frontend: `cd frontend && npm run build`
2. Create new "Static Site" on Render
3. Connect GitHub repository (point to frontend folder)
4. Set build command: `npm install && npm run build`
5. Set publish directory: `dist`
6. Update frontend API calls to point to backend URL

### Option 2: Vercel (Frontend) + Heroku (Backend)

**Heroku Backend:**
```bash
# Login to Heroku
heroku login

# Create app
heroku create placement-prep-backend

# Set environment variables
heroku config:set MONGODB_URI=<uri>
heroku config:set JWT_SECRET=<secret>

# Deploy
git push heroku main
```

**Vercel Frontend:**
```bash
npm install -g vercel
vercel
```

During setup, configure environment variable for backend URL.

### Option 3: AWS (Complete Solution)

**Using EC2 + S3 + RDS:**

1. Launch EC2 instance (Ubuntu 20.04)
2. Install Node.js and MongoDB
3. Clone repository
4. Configure security groups
5. Use S3 for frontend static files
6. CloudFront for CDN

See AWS documentation for detailed steps.

---

## Environment Variables

### Backend (.env)

```env
# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/placement-prep-todo

# JWT
JWT_SECRET=generate_random_secret_32_chars_min

# Server
PORT=5000
NODE_ENV=production
```

**Generate secure JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Frontend (vite.config.js)

Update API proxy for production:
```javascript
server: {
  proxy: {
    '/api': {
      target: 'https://your-backend-url.com',
      changeOrigin: true,
    }
  }
}
```

---

## Database Setup

### MongoDB Atlas (Cloud - Recommended)

1. Create account: https://www.mongodb.com/cloud/atlas
2. Create cluster
3. Add IP whitelist (or 0.0.0.0 for all)
4. Create database user
5. Get connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/placement-prep-todo
   ```

### Local MongoDB

```bash
# Install MongoDB Community
# macOS with Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Ubuntu/Debian
sudo apt-get install -y mongodb-org
sudo systemctl start mongod

# Windows
# Download from mongodb.com and run installer
```

**Connect with local string:**
```
MONGODB_URI=mongodb://localhost:27017/placement-prep-todo
```

---

## SSL/HTTPS Setup

### Using Let's Encrypt (Free)

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --standalone -d yourdomain.com

# Certificate location
# /etc/letsencrypt/live/yourdomain.com/fullchain.pem
# /etc/letsencrypt/live/yourdomain.com/privkey.pem
```

### Node.js HTTPS Setup

```javascript
const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('/path/to/privkey.pem'),
  cert: fs.readFileSync('/path/to/fullchain.pem')
};

https.createServer(options, app).listen(443);
```

---

## Scaling Considerations

### Load Balancing
- Use Nginx/HAProxy for multiple backend instances
- Round-robin or least-connection algorithms

### Caching
- Redis for session storage
- Cache static assets with CDN
- Database query optimization with indexes

### Monitoring
- New Relic, DataDog, or similar
- Error tracking with Sentry
- Uptime monitoring

### Database Optimization
- Create indexes on frequently queried fields
- MongoDB sharding for large datasets
- Regular backups

---

## Troubleshooting

### Connection Issues

**Backend can't connect to MongoDB:**
```bash
# Test connection
mongosh "your-connection-string"
```

**Frontend can't reach API:**
- Check CORS in backend
- Verify backend URL in frontend config
- Check firewall/security groups

### Performance Issues

1. Check database indexes
2. Implement pagination for large task lists
3. Use Redis for session caching
4. Enable gzip compression
5. Minify/optimize assets

---

## Maintenance

### Regular Backups

**MongoDB Atlas**: Automatic daily backups (included)

**Local MongoDB**:
```bash
# Backup
mongodump --db placement-prep-todo --out ./backup

# Restore
mongorestore ./backup/placement-prep-todo
```

### Updates

```bash
# Check for security updates
npm audit
npm audit fix

# Update dependencies (test first!)
npm update
```

### Monitoring

Set up alerts for:
- High error rates
- Slow API responses
- Database connection issues
- Disk space
- Memory usage

---

## Cost Estimation

- **MongoDB Atlas**: Free tier available (512MB storage)
- **Render.com**: $7/month (backend) + free (frontend)
- **Vercel**: Free (frontend)
- **Total Minimum**: ~$7/month for small usage

---

## Support & Help

- MongoDB Docs: docs.mongodb.com
- Express Docs: expressjs.com
- React Docs: react.dev
- Deployment Guides: Your platform's documentation
