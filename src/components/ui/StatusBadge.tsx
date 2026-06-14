import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'available' | 'claimed' | 'collected' | 'expired' | 'urgent';
  className?: string;
}

const statusConfig = {
  available: {
    label: 'Available',
    className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  },
  claimed: {
    label: 'Claimed',
    className: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  },
  collected: {
    label: 'Collected',
    className: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  },
  expired: {
    label: 'Expired',
    className: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  },
  urgent: {
    label: 'Urgent',
    className:
      'bg-red-500/10 text-red-400 border-red-500/20 animate-pulse',
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
