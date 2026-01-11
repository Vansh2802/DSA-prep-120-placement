import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Timer from '../components/Timer';
import './Dashboard.css';

export default function Dashboard({ user, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [currentDay, setCurrentDay] = useState(1);
  const [taskText, setTaskText] = useState('');
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [cycleComplete, setCycleComplete] = useState(false);
  const [cycleStarted, setCycleStarted] = useState(true);
  const [startingCycle, setStartingCycle] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/tasks', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(response.data.tasks);
      setCurrentDay(response.data.currentDay);
      setCycleComplete(response.data.currentDay > 120);
      setCycleStarted(true);
    } catch (err) {
      if (err.response?.status === 400 && err.response?.data?.message === 'Cycle not started') {
        setCycleStarted(false);
      } else {
        setError('Failed to load tasks');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartCycle = async () => {
    try {
      setStartingCycle(true);
      setError('');
      const response = await axios.post('/api/auth/start-cycle', {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCycleStarted(true);
      setCurrentDay(1);
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start cycle');
    } finally {
      setStartingCycle(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!taskText.trim()) {
      setError('Please enter a task');
      return;
    }

    try {
      setCreating(true);
      setError('');
      const response = await axios.post('/api/tasks', 
        { text: taskText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks([...tasks, response.data.task]);
      setTaskText('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task');
    } finally {
      setCreating(false);
    }
  };

  const handleToggleTask = async (task) => {
    try {
      const response = await axios.patch(
        `/api/tasks/${task._id}`,
        { completed: !task.completed },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks(tasks.map(t => t._id === task._id ? response.data.task : t));
    } catch (err) {
      setError('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.filter(t => t._id !== taskId));
    } catch (err) {
      setError('Failed to delete task');
    }
  };

  const todayTask = tasks.find(t => t.dayNumber === currentDay);
  const pastTasks = tasks.filter(t => t.dayNumber < currentDay);

  // Show start cycle screen
  if (!cycleStarted) {
    return (
      <div className="dashboard">
        <div className="dashboard-header">
          <div className="header-left">
            <h1>120-Day Placement Prep</h1>
            <p className="user-info">Welcome, {user?.name}</p>
          </div>
          <button className="logout-btn" onClick={onLogout}>Logout</button>
        </div>

        <div className="start-cycle-container">
          <div className="start-cycle-card">
            <div className="start-cycle-icon">🚀</div>
            <h2>Ready to Begin Your Journey?</h2>
            <p>Start your 120-day placement preparation journey today.</p>
            <p className="cycle-description">
              Commit to 120 days of consistent learning and preparation. You'll track daily tasks and build momentum towards your placement goal.
            </p>
            {error && <div className="error-message">{error}</div>}
            <button 
              className="start-cycle-btn"
              onClick={handleStartCycle}
              disabled={startingCycle}
            >
              {startingCycle ? 'Starting...' : 'Start 120-Day Cycle'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="header-left">
          <h1>120-Day Placement Prep</h1>
          <p className="user-info">Welcome, {user?.name}</p>
        </div>
        <button className="logout-btn" onClick={onLogout}>Logout</button>
      </div>

      <div className="progress-section">
        <div className="progress-info">
          <span className="day-counter">Day {currentDay} of 120</span>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${(currentDay / 120) * 100}%` }}></div>
          </div>
        </div>
        {cycleComplete && <p className="cycle-complete">🎉 Congratulations! You've completed the 120-day cycle!</p>}
      </div>

      {error && <div className="error-banner">{error}</div>}

      {!cycleComplete && (
        <div className="task-input-section">
          <h2>Today's Task (Day {currentDay})</h2>
          {todayTask ? (
            <div className="task-exists">
              <p>✓ You've already created a task for today.</p>
            </div>
          ) : (
            <form onSubmit={handleCreateTask} className="task-form">
              <input
                type="text"
                value={taskText}
                onChange={(e) => setTaskText(e.target.value)}
                placeholder="What will you accomplish today?"
                maxLength="200"
                disabled={creating}
              />
              <button type="submit" disabled={creating || !taskText.trim()} className="create-btn">
                {creating ? 'Creating...' : 'Add Task'}
              </button>
            </form>
          )}
        </div>
      )}

      {todayTask && (
        <div className="current-task-section">
          <h2>Today's Task</h2>
          <div className="task-card today">
            <div className="task-content">
              <label className="task-checkbox-label">
                <input
                  type="checkbox"
                  checked={todayTask.completed}
                  onChange={() => handleToggleTask(todayTask)}
                  disabled={loading}
                />
                <span className={`task-text ${todayTask.completed ? 'done' : ''}`}>
                  {todayTask.text}
                </span>
              </label>
            </div>
            <div className="task-actions">
              <Timer deadline={todayTask.deadline} completed={todayTask.completed} />
              <button 
                className="delete-btn" 
                onClick={() => handleDeleteTask(todayTask._id)}
                title="Delete task"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {pastTasks.length > 0 && (
        <div className="past-tasks-section">
          <h2>Previous Tasks ({pastTasks.length})</h2>
          <div className="tasks-list">
            {pastTasks.map(task => (
              <div key={task._id} className="task-card past">
                <div className="task-content">
                  <label className="task-checkbox-label">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => handleToggleTask(task)}
                      disabled={loading}
                    />
                    <span className={`task-text ${task.completed ? 'done' : ''}`}>
                      Day {task.dayNumber}: {task.text}
                    </span>
                  </label>
                </div>
                <div className="task-actions">
                  <Timer deadline={task.deadline} completed={task.completed} />
                  <button 
                    className="delete-btn" 
                    onClick={() => handleDeleteTask(task._id)}
                    title="Delete task"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {loading && !tasks.length && <p className="loading">Loading tasks...</p>}
    </div>
  );
}
