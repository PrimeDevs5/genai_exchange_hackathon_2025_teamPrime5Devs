import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
export const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const {
    resetPassword
  } = useAuth();
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      setError('');
      setMessage('');
      setLoading(true);
      await resetPassword(email);
      setMessage('Check your email for password reset instructions');
    } catch (err) {
      setError('Failed to reset password: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
  return <div className="w-full max-w-md">
      <h2 className="text-2xl font-bold text-center text-neutral-900 mb-6">Reset your password</h2>
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <p>{error}</p>
        </div>}
      {message && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4" role="alert">
          <p>{message}</p>
        </div>}
      <p className="text-neutral-600 mb-6">
        Enter your email address and we'll send you a link to reset your password.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
            Email
          </label>
          <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="input w-full" placeholder="your@email.com" required />
        </div>
        <button type="submit" className="btn btn-primary w-full" disabled={loading}>
          {loading ? 'Sending...' : 'Reset Password'}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-neutral-600">
        Remember your password?{' '}
        <Link to="/auth/login" className="text-primary-600 hover:text-primary-500 font-medium">
          Back to login
        </Link>
      </p>
    </div>;
};