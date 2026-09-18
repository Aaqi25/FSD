import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  isLoading?: boolean;
  label?: string;
  size?: 'sm' | 'md';
  id?: string;
}

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  disabled = false,
  isLoading = false,
  label,
  size = 'md',
  id,
}) => {
  const isSm = size === 'sm';
  const toggleId = id || (label ? `toggle-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled || isLoading) return;
    onChange(!checked);
  };

  return (
    <div className="inline-flex items-center gap-2 select-none">
      <button
        id={toggleId}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label || (checked ? 'Device is ON' : 'Device is OFF')}
        disabled={disabled || isLoading}
        onClick={handleClick}
        className={`relative inline-flex shrink-0 transition-colors duration-200 ease-in-out rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-1 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 ${
          isSm ? 'h-5 w-9 p-0.5' : 'h-6 w-11 p-0.5'
        } ${checked ? 'bg-blue-600' : 'bg-slate-300 hover:bg-slate-400'}`}
      >
        <span
          className={`pointer-events-none flex items-center justify-center rounded-full bg-white shadow-xs transition-transform duration-200 ease-in-out ${
            isSm ? 'h-4 w-4' : 'h-5 w-5'
          } ${checked ? (isSm ? 'translate-x-4' : 'translate-x-5') : 'translate-x-0'}`}
        >
          {isLoading ? (
            <Loader2 className="w-2.5 h-2.5 animate-spin text-blue-600" />
          ) : null}
        </span>
      </button>
      {label && (
        <span
          onClick={handleClick}
          className={`text-xs font-semibold uppercase tracking-wider cursor-pointer ${
            disabled ? 'text-slate-400 cursor-not-allowed' : checked ? 'text-blue-700' : 'text-slate-500'
          }`}
        >
          {checked ? 'ON' : 'OFF'}
        </span>
      )}
    </div>
  );
};
