import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import ProgressRing from '../components/ProgressRing';
import DayCard from '../components/DayCard';
import '../styles/index.css';

export default function Dashboard({ user, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [currentDay, setCurrentDay] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cycleStartDate, setCycleStartDate] = useState(null);
  const [advancing, setAdvancing] = useState(false);
  const [resetting, setResetting] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchTasks();
    // Refresh every 10 seconds to update timers
    const interval = setInterval(fetchTasks, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks');
      setTasks(response.data.tasks);
      setCurrentDay(response.data.currentDay);
      setCycleStartDate(response.data.cycleStartDate);
      setError('');
    } catch (err) {
      if (err.response?.status !== 400) {
        setError(err.response?.data?.message || 'Failed to load tasks');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const canAdvance = () => {
    const todaysTasks = tasks.filter(t => t.dayNumber === currentDay);
    if (!todaysTasks.length) return false;
    return todaysTasks.every(t => t.completed);
  };

  const handleAdvanceDay = async () => {
    setError('');
    setAdvancing(true);
    try {
      const response = await api.post('/progress/advance-day');
      setCurrentDay(response.data.currentDay);
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not start next day');
    } finally {
      setAdvancing(false);
    }
  };

  const handleResetCycle = async () => {
    const confirm = window.confirm('This will delete ALL tasks and restart at Day 1. Continue?');
    if (!confirm) return;

    setError('');
    setResetting(true);
    try {
      const response = await api.post('/progress/reset-cycle');
      setCurrentDay(response.data.currentDay);
      setTasks([]);
      setCycleStartDate(response.data.cycleStartDate);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not reset cycle');
    } finally {
      setResetting(false);
    }
  };

  const handleAddTask = async (dayNumber, title) => {
    if (!title.trim()) {
      setError('Task cannot be empty');
      return;
    }

    try {
      const response = await api.post('/tasks', 
        { title: title.trim(), dayNumber }
      );
      setTasks([...tasks, response.data.task]);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task');
    }
  };

  const handleToggleTask = async (taskId, completed) => {
    try {
      const response = await api.patch(
        `/tasks/${taskId}`,
        { completed: !completed }
      );
      setTasks(tasks.map(t => t._id === taskId ? response.data.task : t));
    } catch (err) {
      setError('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Delete this task?')) {
      try {
        await api.delete(`/tasks/${taskId}`);
        setTasks(tasks.filter(t => t._id !== taskId));
      } catch (err) {
        setError('Failed to delete task');
      }
    }
  };

  if (loading) {
    return <div className="loading-container">Loading your progress...</div>;
  }

  // Create array of days 1-120
  const allDays = Array.from({ length: 120 }, (_, i) => i + 1);

  // Get task for each day
  const getTaskForDay = (dayNumber) => {
    return tasks.find(t => t.dayNumber === dayNumber);
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-left">
          <h1>120-Day Challenge</h1>
          <p>Welcome, {user?.name}</p>
        </div>
        <div className="header-actions">
          <button
            className="danger-btn"
            onClick={handleResetCycle}
            disabled={resetting}
            title="Delete all tasks and restart from Day 1"
          >
            {resetting ? 'Resetting...' : 'Reset Cycle'}
          </button>
          <button
            className="primary-btn"
            onClick={handleAdvanceDay}
            disabled={!canAdvance() || advancing}
            title={!canAdvance() ? 'Complete today\'s tasks to start next day' : 'Start next day'}
          >
            {advancing ? 'Starting...' : `Start Day ${currentDay + 1}`}
          </button>
          <button className="logout-btn" onClick={onLogout}>Logout</button>
        </div>
      </div>

      {/* Error Message */}
      {error && <div className="error-message">{error}</div>}

      {/* Progress Ring */}
      <div className="progress-section">
        <ProgressRing currentDay={currentDay} />
        <div className="progress-info">
          <p>You're on <strong>Day {currentDay}</strong> of your 120-day journey</p>
          {currentDay >= 120 && (
            <p style={{ color: '#4caf50', fontWeight: 'bold' }}>🎉 Congratulations! You've completed the challenge!</p>
          )}
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="calendar-section">
        <h2>Your Challenge Calendar</h2>
        <div className="calendar-grid">
          {allDays.map((dayNumber) => {
            const task = getTaskForDay(dayNumber);
            const isToday = dayNumber === currentDay;
            const isPast = dayNumber < currentDay;

            return (
              <DayCard
                key={dayNumber}
                dayNumber={dayNumber}
                task={task}
                isToday={isToday}
                isPast={isPast}
                onAddTask={handleAddTask}
                onToggleTask={handleToggleTask}
                onDeleteTask={handleDeleteTask}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
