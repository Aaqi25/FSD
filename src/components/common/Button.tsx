import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  className = '',
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed select-none whitespace-nowrap cursor-pointer';

  const sizeClasses = {
    sm: 'text-xs h-8 px-3 rounded-md gap-1.5',
    md: 'text-sm h-9 px-4 rounded-md gap-2',
    lg: 'text-base h-11 px-5 rounded-md gap-2.5',
  }[size];

  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs',
    secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200',
    outline: 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-xs',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs',
    ghost: 'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900',
  }[variant];

  return (
    <button
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};
