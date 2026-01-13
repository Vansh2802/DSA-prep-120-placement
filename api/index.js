const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// --- Config --------------------------------------------------------------
const FRONTEND_ORIGIN = process.env.FRONTEND_URL || '*';
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('✗ MONGODB_URI is missing. Set it in Vercel project env vars.');
}
if (!process.env.JWT_SECRET) {
  console.error('✗ JWT_SECRET is missing. Set it in Vercel project env vars.');
}

// --- Middleware ----------------------------------------------------------
app.use(cors({ origin: FRONTEND_ORIGIN, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

// --- Database (reuse connection across invocations) ----------------------
mongoose.set('strictQuery', true);
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      autoIndex: true,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    }).then((mongooseInstance) => {
      console.log('✓ MongoDB connected');
      return mongooseInstance;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

// Ensure DB is connected before handling any route
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    return next();
  } catch (err) {
    console.error('✗ MongoDB connection error:', err.message);
    return res.status(500).json({ message: 'Database connection failed' });
  }
});

// --- Routes --------------------------------------------------------------
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/progress', require('./routes/progress'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Server error', error: err.message });
});

module.exports = app;
