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

    // Calculate current day
    const now = new Date();
    const startDate = new Date(user.cycleStartDate);
    const diffTime = Math.abs(now - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const currentDay = Math.min(diffDays, 120);

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

module.exports = router;
