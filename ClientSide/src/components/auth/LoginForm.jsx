import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const {
    login
  } = useAuth();
  const handleSubmit = async e => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      // Successful login will be handled by AuthContext
    } catch (err) {
      setError('Failed to log in: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
  return <div className="w-full max-w-md">
      <h2 className="text-2xl font-bold text-center text-neutral-900 mb-6">Log in to your account</h2>
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <p>{error}</p>
        </div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
            Email
          </label>
          <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="input w-full" placeholder="your@email.com" required />
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="password" className="block text-sm font-medium text-neutral-700">
              Password
            </label>
            <Link to="/auth/forgot-password" className="text-sm text-primary-600 hover:text-primary-500">
              Forgot password?
            </Link>
          </div>
          <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} className="input w-full" placeholder="••••••••" required />
        </div>
        <button type="submit" className="btn btn-primary w-full" disabled={loading}>
          {loading ? 'Logging in...' : 'Log in'}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-neutral-600">
        Don't have an account?{' '}
        <Link to="/auth/register" className="text-primary-600 hover:text-primary-500 font-medium">
          Sign up
        </Link>
      </p>
    </div>;
};