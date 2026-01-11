import React, { useState, useEffect } from 'react';

export default function Timer({ deadline }) {
  const [timeLeft, setTimeLeft] = useState('');
  const [isWarning, setIsWarning] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const deadlineDate = new Date(deadline);
      const diffMs = deadlineDate - now;

      if (diffMs <= 0) {
        setTimeLeft('Expired');
        setIsExpired(true);
        setIsWarning(false);
        return;
      }

      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

      setTimeLeft(`${diffHours}h ${diffMinutes}m left`);
      setIsWarning(diffHours <= 2);
      setIsExpired(false);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [deadline]);

  const timerClass = `timer ${isWarning ? 'warning' : ''} ${isExpired ? 'expired' : ''}`;

  return <div className={timerClass}>⏱️ {timeLeft}</div>;
}
