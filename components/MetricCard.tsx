'use client';

import { LucideIcon } from 'lucide-react';
import { GlassCard } from './GlassCard';
import { motion } from 'framer-motion';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  delay?: number;
}

export function MetricCard({
  title,
  value,
  icon: Icon,
  change,
  changeType = 'neutral',
  delay = 0,
}: MetricCardProps) {
  const changeColors = {
    positive: 'text-green-400',
    negative: 'text-red-400',
    neutral: 'text-gray-400',
  };

  return (
    <GlassCard hover delay={delay} gradient>
      <div className="flex items-start justify-between font-mono">
        <div className="space-y-1">
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">[ {title} ]</p>
          <motion.p
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: delay + 0.2 }}
            className="text-xl font-bold text-white"
          >
            {value}
          </motion.p>
          {change && (
            <p className="text-[10px] text-gray-400">{change}</p>
          )}
        </div>
        <div className="relative">
          <div className="p-2 border border-white/20">
            <Icon className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

