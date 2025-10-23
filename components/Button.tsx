'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  children,
  className,
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary:
      'bg-gradient-to-r from-primary-accent to-primary-purple text-primary-dark hover:shadow-lg hover:shadow-primary-accent/50 hover:scale-105',
    secondary:
      'glass-panel-hover text-white',
    ghost: 'hover:bg-white/5 text-gray-300 hover:text-white',
    outline:
      'border-2 border-primary-accent text-primary-accent hover:bg-primary-accent hover:text-primary-dark',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-8 py-3.5 text-lg',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
      {Icon && iconPosition === 'left' && (
        <Icon className={cn('w-5 h-5', children && 'mr-2')} />
      )}
      {children}
      {Icon && iconPosition === 'right' && (
        <Icon className={cn('w-5 h-5', children && 'ml-2')} />
      )}
      </button>
    </motion.div>
  );
}

