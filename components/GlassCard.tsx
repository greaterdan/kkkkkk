'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
  gradient?: boolean;
}

export function GlassCard({
  children,
  className,
  hover = false,
  delay = 0,
  gradient = false,
}: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={cn(
        'glass-panel p-4 relative overflow-hidden',
        hover && 'glass-panel-hover cursor-pointer',
        className
      )}
    >
      {gradient && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary-accent/5 via-transparent to-primary-purple/5 pointer-events-none" />
      )}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

