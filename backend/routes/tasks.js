const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Task = require('../models/Task');
const User = require('../models/User');

// Get all tasks for current user
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || !user.cycleStartDate) {
      return res.status(400).json({ message: 'Cycle not started' });
    }

    const tasks = await Task.find({ userId: req.userId }).sort({ dayNumber: 1 });
    const currentDay = Math.max(1, user.currentDay || 1);

    // Check for missed tasks and mark them
    for (let task of tasks) {
      if (!task.completed && !task.missed && task.deadline < new Date()) {
        task.missed = true;
        await task.save();
      }
    }

    res.json({
      tasks,
      currentDay,
      cycleStartDate: user.cycleStartDate,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create task for a specific day
router.post('/', auth, async (req, res) => {
  try {
    const { title, dayNumber } = req.body;

    if (!title || !dayNumber) {
      return res.status(400).json({ message: 'Title and day number required' });
    }

    const user = await User.findById(req.userId);
    if (!user || !user.cycleStartDate) {
      return res.status(400).json({ message: 'Cycle not started' });
    }

    const currentDay = Math.max(1, user.currentDay || 1);

    // Only allow creating tasks for current day or past days
    if (dayNumber > currentDay) {
      return res.status(400).json({ message: 'Cannot create task for future days' });
    }

    // Check if task already exists for this day
    const existingTask = await Task.findOne({
      userId: req.userId,
      dayNumber: dayNumber,
    });

    if (existingTask) {
      return res.status(400).json({ message: 'Task already exists for this day' });
    }

    // Create deadline (24 hours from now)
    const deadline = new Date();
    deadline.setHours(deadline.getHours() + 24);

    const task = new Task({
      userId: req.userId,
      title: title.trim(),
      dayNumber: dayNumber,
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
    task.missed = false; // Clear missed flag when task is completed
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
