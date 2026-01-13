const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Task = require('../models/Task');
const User = require('../models/User');

// Get user progress
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || !user.cycleStartDate) {
      return res.status(400).json({ message: 'Cycle not started' });
    }

    const tasks = await Task.find({ userId: req.userId });
    const currentDay = Math.max(1, user.currentDay || 1);

    // Calculate progress
    const completedTasks = tasks.filter(t => t.completed).length;
    const missedTasks = tasks.filter(t => t.missed).length;
    const pendingTasks = tasks.filter(t => !t.completed && !t.missed).length;

    const percentageComplete = (currentDay / 120) * 100;

    res.json({
      currentDay,
      totalDays: 120,
      cycleStartDate: user.cycleStartDate,
      completedTasks,
      missedTasks,
      pendingTasks,
      percentageComplete: Math.round(percentageComplete),
      isComplete: currentDay >= 120,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Advance to next day (requires all current-day tasks completed)
router.post('/advance-day', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || !user.cycleStartDate) {
      return res.status(400).json({ message: 'Cycle not started' });
    }

    const currentDay = Math.max(1, user.currentDay || 1);
    if (currentDay >= 120) {
      return res.status(400).json({ message: 'Challenge already complete' });
    }

    const todaysTasks = await Task.find({ userId: req.userId, dayNumber: currentDay });
    if (!todaysTasks.length) {
      return res.status(400).json({ message: 'Add and complete today\'s tasks before starting the next day' });
    }

    const incomplete = todaysTasks.some(t => !t.completed);
    if (incomplete) {
      return res.status(400).json({ message: 'Complete all tasks for today before starting the next day' });
    }

    user.currentDay = currentDay + 1;
    await user.save();

    res.json({ message: 'Advanced to next day', currentDay: user.currentDay });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Reset cycle: wipe tasks and restart at day 1
router.post('/reset-cycle', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await Task.deleteMany({ userId: req.userId });
    user.currentDay = 1;
    user.cycleStartDate = new Date();
    await user.save();

    res.json({ message: 'Cycle reset to Day 1', currentDay: 1, cycleStartDate: user.cycleStartDate });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
