import React, { useState, useEffect } from 'react';
import './Timer.css';

export default function Timer({ deadline, completed }) {
  const [timeLeft, setTimeLeft] = useState('');
  const [isOverdue, setIsOverdue] = useState(false);

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const deadlineDate = new Date(deadline);
      const diff = deadlineDate - now;

      if (diff <= 0) {
        setTimeLeft('Overdue');
        setIsOverdue(true);
        return;
      }

      setIsOverdue(false);
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, [deadline]);

  return (
    <div className={`timer ${completed ? 'completed' : isOverdue ? 'overdue' : 'active'}`}>
      {completed ? '✓ Completed' : isOverdue ? '✗ Missed' : `⏱ ${timeLeft}`}
    </div>
  );
}
