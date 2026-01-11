import React from 'react';

export default function ProgressRing({ currentDay = 1 }) {
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(currentDay / 120, 1);
  const strokeDashoffset = circumference - progress * circumference;
  const percentage = Math.round((currentDay / 120) * 100);

  return (
    <div className="progress-ring-container">
      <div className="progress-ring">
        <svg width="200" height="200" viewBox="0 0 200 200">
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#667eea" />
              <stop offset="100%" stopColor="#764ba2" />
            </linearGradient>
          </defs>
          {/* Background circle */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            className="progress-ring-bg"
          />
          {/* Progress circle */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            className="progress-ring-fill"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: strokeDashoffset,
            }}
          />
        </svg>

        {/* Center text */}
        <div className="progress-ring-text">
          <div className="day-number">{currentDay}</div>
          <div className="day-total">of 120 Days</div>
          <div style={{ fontSize: '12px', color: '#999', marginTop: '5px' }}>
            {percentage}% Complete
          </div>
        </div>
      </div>
    </div>
  );
}
