'use client';

import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: 'success' | 'failed' | 'pending';
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = {
    success: {
      icon: CheckCircle,
      text: 'Success',
      color: 'text-primary-gold',
      bg: 'bg-primary-gold/10',
      border: 'border-primary-gold/30',
    },
    failed: {
      icon: XCircle,
      text: 'Failed',
      color: 'text-red-400',
      bg: 'bg-red-400/10',
      border: 'border-red-400/30',
    },
    pending: {
      icon: Clock,
      text: 'Pending',
      color: 'text-yellow-400',
      bg: 'bg-yellow-400/10',
      border: 'border-yellow-400/30',
    },
  };

  const { icon: Icon, text, color, bg, border } = config[status];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium border font-mono',
        color,
        bg,
        border,
        className
      )}
    >
      <Icon className="w-2.5 h-2.5" />
      [{text.toUpperCase()}]
    </span>
  );
}

