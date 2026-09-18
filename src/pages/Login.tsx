import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';

export const Login: React.FC = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('alex@smarthome.io');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login({ email: email.trim(), password });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    }
  };

  const handleFillDemo = () => {
    setEmail('alex@smarthome.io');
    setPassword('password123');
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-xl font-bold tracking-tight text-slate-900">
          SmartHome Operations Platform
        </h2>
        <p className="mt-1 text-center text-xs text-slate-500">
          Centralized appliance control, automation, security & energy monitoring
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-6 px-6 sm:px-8 rounded-lg border border-slate-200 shadow-sm space-y-5">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded text-xs text-rose-700 font-medium">
              {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <Input
              label="Email Address"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@smarthome.io"
              leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
            />

            <Input
              label="Password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
            />

            <Button
              type="submit"
              className="w-full"
              size="md"
              isLoading={loading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In to System
            </Button>
          </form>

          {/* Demo Helper Box for evaluation convenience */}
          <div className="p-3 bg-slate-50 rounded border border-slate-200 text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                Default Demo Credentials:
              </span>
              <button
                type="button"
                onClick={handleFillDemo}
                className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
              >
                Auto-fill
              </button>
            </div>
            <p className="text-slate-500 font-mono text-[11px]">
              Email: alex@smarthome.io / Pass: password123
            </p>
          </div>

          <div className="text-center pt-2 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              Need a new residence profile?{' '}
              <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-700">
                Register Homeowner
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
