import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
export const RegisterForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const {
    register
  } = useAuth();
  const handleSubmit = async e => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    if (password.length < 6) {
      return setError('Password must be at least 6 characters');
    }
    try {
      setError('');
      setLoading(true);
      await register(email, password, name);
      // Successful registration will be handled by AuthContext
    } catch (err) {
      setError('Failed to create an account: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
  return <div className="w-full max-w-md">
      <h2 className="text-2xl font-bold text-center text-neutral-900 mb-6">Create an account</h2>
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <p>{error}</p>
        </div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">
            Full Name
          </label>
          <input id="name" type="text" value={name} onChange={e => setName(e.target.value)} className="input w-full" placeholder="John Doe" required />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
            Email
          </label>
          <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="input w-full" placeholder="your@email.com" required />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1">
            Password
          </label>
          <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} className="input w-full" placeholder="••••••••" required />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 mb-1">
            Confirm Password
          </label>
          <input id="confirmPassword" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="input w-full" placeholder="••••••••" required />
        </div>
        <button type="submit" className="btn btn-primary w-full" disabled={loading}>
          {loading ? 'Creating account...' : 'Sign up'}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-neutral-600">
        Already have an account?{' '}
        <Link to="/auth/login" className="text-primary-600 hover:text-primary-500 font-medium">
          Log in
        </Link>
      </p>
    </div>;
};