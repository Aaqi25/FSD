import React from 'react';

export type BadgeVariant =
  | 'online'
  | 'active'
  | 'offline'
  | 'inactive'
  | 'low'
  | 'high'
  | 'critical'
  | 'neutral'
  | 'info';

export interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  children,
  size = 'sm',
  className = '',
}) => {
  const sizeClasses = size === 'sm' ? 'text-[11px] px-2 py-0.5 gap-1.5' : 'text-xs px-2.5 py-1 gap-1.5';

  const variantStyles = {
    online: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    active: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    offline: 'bg-slate-100 text-slate-600 border-slate-200',
    inactive: 'bg-slate-100 text-slate-600 border-slate-200',
    low: 'bg-slate-100 text-slate-700 border-slate-200',
    high: 'bg-amber-50 text-amber-800 border-amber-200',
    critical: 'bg-rose-50 text-rose-800 border-rose-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
  }[variant];

  // Dot color for dual-channel indicator (not relying on color alone)
  const dotColor = {
    online: 'bg-emerald-500',
    active: 'bg-emerald-500',
    offline: 'bg-slate-400',
    inactive: 'bg-slate-400',
    low: 'bg-slate-400',
    high: 'bg-amber-500',
    critical: 'bg-rose-600 animate-pulse',
    info: 'bg-blue-500',
    neutral: 'bg-slate-400',
  }[variant];

  return (
    <span
      className={`inline-flex items-center font-medium rounded border whitespace-nowrap leading-none ${sizeClasses} ${variantStyles} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} />
      <span>{children}</span>
    </span>
  );
};
