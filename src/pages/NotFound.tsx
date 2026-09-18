import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/common/Button';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6 text-center">
      <h1 className="text-2xl font-bold text-slate-900 tracking-tight">404 - Page Not Found</h1>
      <p className="text-xs text-slate-500 max-w-sm mt-1 mb-6">
        The requested subsystem route does not exist in this SmartHome operational build.
      </p>
      <Link to="/dashboard">
        <Button size="md" leftIcon={<ArrowLeft className="w-4 h-4" />}>
          Return to Dashboard
        </Button>
      </Link>
    </div>
  );
};
