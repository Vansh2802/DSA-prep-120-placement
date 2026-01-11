const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Task = require('../models/Task');
const User = require('../models/User');

// Helper function to calculate current day
function getCurrentDay(cycleStartDate) {
  const now = new Date();
  const startDate = new Date(cycleStartDate);
  const diffTime = Math.abs(now - startDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.min(diffDays + 1, 120);
}

// Get all tasks for current user
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || !user.cycleStartDate) {
      return res.status(400).json({ message: 'Cycle not started' });
    }

    const tasks = await Task.find({ userId: req.userId });
    const currentDay = getCurrentDay(user.cycleStartDate);

    res.json({
      tasks,
      currentDay,
      cycleStartDate: user.cycleStartDate,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get task for specific day
router.get('/day/:dayNumber', auth, async (req, res) => {
  try {
    const { dayNumber } = req.params;

    const task = await Task.findOne({
      userId: req.userId,
      dayNumber: parseInt(dayNumber),
    });

    res.json(task || null);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create task for today
router.post('/', auth, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === '') {
      return res.status(400).json({ message: 'Task text is required' });
    }

    const user = await User.findById(req.userId);
    if (!user || !user.cycleStartDate) {
      return res.status(400).json({ message: 'Cycle not started' });
    }

    const currentDay = getCurrentDay(user.cycleStartDate);

    // Check if task already exists for today
    const existingTask = await Task.findOne({
      userId: req.userId,
      dayNumber: currentDay,
    });

    if (existingTask) {
      return res.status(400).json({ message: 'Task already exists for today' });
    }

    // Check if cycle is complete
    if (currentDay > 120) {
      return res.status(400).json({ message: '120-day cycle is complete' });
    }

    // Create deadline (24 hours from now)
    const deadline = new Date();
    deadline.setHours(deadline.getHours() + 24);

    const task = new Task({
      userId: req.userId,
      text: text.trim(),
      dayNumber: currentDay,
      deadline,
    });

    await task.save();

    res.status(201).json({
      message: 'Task created successfully',
      task,
      currentDay,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update task (mark as complete/incomplete)
router.patch('/:taskId', auth, async (req, res) => {
  try {
    const { completed } = req.body;

    const task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Verify ownership
    if (task.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    task.completed = completed;
    await task.save();

    res.json({
      message: 'Task updated',
      task,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete task
router.delete('/:taskId', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Verify ownership
    if (task.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Task.findByIdAndDelete(req.params.taskId);

    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
