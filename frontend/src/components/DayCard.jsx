import React, { useState, useEffect } from 'react';
import Timer from './Timer';

export default function DayCard({
  dayNumber,
  task,
  isToday,
  isPast,
  onAddTask,
  onToggleTask,
  onDeleteTask,
}) {
  const [inputValue, setInputValue] = useState('');
  const [showInput, setShowInput] = useState(false);

  // Determine status
  let status = 'pending';
  if (task?.completed) {
    status = 'completed';
  } else if (task?.missed) {
    status = 'missed';
  }

  // Determine if user can add task (only for today or past days)
  const canAddTask = !task && (isToday || isPast);

  const handleAddTask = () => {
    if (inputValue.trim()) {
      onAddTask(dayNumber, inputValue);
      setInputValue('');
      setShowInput(false);
    }
  };

  const className = `day-card ${isToday ? 'today' : ''} ${status === 'completed' ? 'completed' : ''} ${status === 'missed' ? 'missed' : ''}`;

  return (
    <div className={className}>
      {/* Day Number */}
      <div className="day-number">Day {dayNumber}</div>

      {/* Status Badge */}
      {task && (
        <div className={`day-status ${status}`}>
          {status === 'completed' && '✓ Completed'}
          {status === 'missed' && '✗ Missed'}
          {status === 'pending' && '○ Pending'}
        </div>
      )}

      {/* Task Content */}
      {task ? (
        <div className="day-task">
          <label>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => onToggleTask(task._id, task.completed)}
            />
            <span className={`day-task-text ${task.completed ? 'completed' : ''}`}>
              {task.title}
            </span>
          </label>

          {/* Timer */}
          {!task.completed && !task.missed && (
            <Timer deadline={task.deadline} />
          )}

          {/* Delete Button */}
          <div className="task-actions">
            <button onClick={() => onDeleteTask(task._id)}>Delete</button>
          </div>
        </div>
      ) : canAddTask ? (
        // Add Task Form
        <div>
          {showInput ? (
            <div>
              <input
                type="text"
                className="task-input"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="What's your task today?"
                autoFocus
                onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
              />
              <div className="task-actions">
                <button onClick={handleAddTask}>Add</button>
                <button onClick={() => {
                  setShowInput(false);
                  setInputValue('');
                }} style={{ background: '#ccc' }}>Cancel</button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowInput(true)}
              style={{
                width: '100%',
                padding: '8px',
                background: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px',
                marginTop: '10px',
              }}
            >
              + Add Task
            </button>
          )}
        </div>
      ) : (
        <p style={{ fontSize: '12px', color: '#999', margin: '10px 0' }}>
          Future day - not yet available
        </p>
      )}
    </div>
  );
}
