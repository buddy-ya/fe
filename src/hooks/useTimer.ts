// src/hooks/useTimer.ts
import { useState, useEffect } from "react";

interface UseTimerProps {
  seconds: number;
  onExpire?: () => void;
}

export function useTimer({ seconds, onExpire }: UseTimerProps) {
  const [remainingSeconds, setRemainingSeconds] = useState(seconds);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          setIsExpired(true);
          clearInterval(timer);
          onExpire?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onExpire]);

  const formatTime = () => {
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const restart = () => {
    setRemainingSeconds(seconds);
    setIsExpired(false);
  };

  return {
    timeLeft: formatTime(),
    isExpired,
    restart,
  };
}
