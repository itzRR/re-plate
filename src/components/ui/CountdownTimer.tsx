'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  expiryTime: string;
  className?: string;
  showIcon?: boolean;
}

export function CountdownTimer({
  expiryTime,
  className,
  showIcon = true,
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState('');
  const [urgency, setUrgency] = useState<'safe' | 'warning' | 'critical'>(
    'safe'
  );

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const expiry = new Date(expiryTime);
      const diff = expiry.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft('Expired');
        setUrgency('critical');
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (hours > 6) {
        setTimeLeft(`${hours}h ${minutes}m`);
        setUrgency('safe');
      } else if (hours > 1) {
        setTimeLeft(`${hours}h ${minutes}m`);
        setUrgency('warning');
      } else {
        setTimeLeft(`${minutes}m ${seconds}s`);
        setUrgency('critical');
      }
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [expiryTime]);

  const colorMap = {
    safe: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    warning: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    critical: 'text-red-400 bg-red-500/10 border-red-500/20 animate-pulse',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
        colorMap[urgency],
        className
      )}
    >
      {showIcon && <Clock className="w-3 h-3" />}
      {timeLeft}
    </span>
  );
}
