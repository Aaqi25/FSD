import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Communication Failure',
  message,
  onRetry,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-6 bg-rose-50/50 rounded-lg border border-rose-200 text-center ${className}`}
    >
      <div className="w-9 h-9 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 mb-2.5">
        <AlertTriangle className="w-5 h-5" />
      </div>
      <h3 className="text-sm font-semibold text-rose-900">{title}</h3>
      <p className="text-xs text-rose-700 max-w-md mt-1 mb-4">{message}</p>
      {onRetry && (
        <Button
          size="sm"
          variant="outline"
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          onClick={onRetry}
        >
          Retry Request
        </Button>
      )}
    </div>
  );
};
