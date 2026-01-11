const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  dayNumber: {
    type: Number,
    required: true,
    min: 1,
    max: 120,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  deadline: {
    type: Date,
    required: true,
  },
});

// Index to ensure only one task per user per day
TaskSchema.index({ userId: 1, dayNumber: 1 }, { unique: true });

module.exports = mongoose.model('Task', TaskSchema);
