import { Clock, Pause, Play } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function Timer({ totalSeconds, onTimeUp }) {
  const [remaining, setRemaining] = useState(totalSeconds);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (paused) return;
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          onTimeUp?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [paused, onTimeUp]);

  const hours = Math.floor(remaining / 3600);
  const mins = Math.floor((remaining % 3600) / 60);
  const secs = remaining % 60;

  const isWarning = remaining < 60;
  const isCritical = remaining < 30;

  const format = (n) => String(n).padStart(2, '0');

  return (
    <div
      className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono font-bold text-sm border-2 transition-all ${
        isCritical
          ? 'bg-red-50 dark:bg-red-950 border-red-400 text-red-600 dark:text-red-400 animate-pulse'
          : isWarning
          ? 'bg-yellow-50 dark:bg-yellow-950 border-yellow-400 text-yellow-600 dark:text-yellow-400'
          : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
      }`}
    >
      <Clock className="w-4 h-4" />
      <span>
        {hours > 0 ? `${format(hours)}:` : ''}{format(mins)}:{format(secs)}
      </span>
      <button
        onClick={() => setPaused((p) => !p)}
        className="ml-1 hover:scale-110 transition-transform"
        aria-label={paused ? 'Resume timer' : 'Pause timer'}
      >
        {paused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
}
