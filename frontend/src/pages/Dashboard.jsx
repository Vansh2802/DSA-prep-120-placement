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

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchTasks();
    // Refresh every 10 seconds to update timers
    const interval = setInterval(fetchTasks, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.get('/api/tasks');
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

  const handleAddTask = async (dayNumber, title) => {
    if (!title.trim()) {
      setError('Task cannot be empty');
      return;
    }

    try {
      const response = await api.post('/api/tasks', 
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
        `/api/tasks/${taskId}`,
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
        await api.delete(`/api/tasks/${taskId}`);
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
        <button className="logout-btn" onClick={onLogout}>Logout</button>
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
