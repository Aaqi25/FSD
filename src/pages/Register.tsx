import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, User as UserIcon, ArrowRight, AtSign } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';

export const Register: React.FC = () => {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password) {
      setError('Please provide all registration fields');
      return;
    }

    setError('');
    try {
      await register({
        name: name.trim(),
        username: username.trim() || email.split('@')[0],
        email: email.trim(),
        password,
      });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-xl font-bold tracking-tight text-slate-900">
          Create SmartHome Account
        </h2>
        <p className="mt-1 text-center text-xs text-slate-500">
          Register homeowner profile to link IoT gateway and appliance clusters
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
              label="Full Name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Jordan Miller"
              leftIcon={<UserIcon className="w-4 h-4 text-slate-400" />}
            />

            <Input
              label="Username (optional)"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="jordan_m"
              leftIcon={<AtSign className="w-4 h-4 text-slate-400" />}
            />

            <Input
              label="Email Address"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jordan@example.com"
              leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
            />

            <Input
              label="Account Password"
              type="password"
              required
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              leftIcon={<Lock className="w-4 h-4 text-slate-400" />}
              helperText="Minimum 6 characters for local session authentication"
            />

            <Button
              type="submit"
              className="w-full"
              size="md"
              isLoading={loading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Create Account
            </Button>
          </form>

          <div className="text-center pt-2 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              Already have an active account?{' '}
              <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
