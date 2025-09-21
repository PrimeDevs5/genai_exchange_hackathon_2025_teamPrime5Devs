import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { AuthTabs } from '../components/auth/AuthTabs';
import { ForgotPasswordForm } from '../components/auth/ForgotPasswordForm';
import { useAuth } from '../contexts/AuthContext';
export const Auth = () => {
  const location = useLocation();
  const {
    currentUser
  } = useAuth();
  // Get the auth mode from the pathname
  const authMode = location.pathname.split('/auth/')[1] || 'login';
  // If user is already logged in, redirect to dashboard
  if (currentUser) {
    return <Navigate to="/dashboard" replace />;
  }
  return <div className="min-h-screen bg-neutral-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-lg bg-primary-500 flex items-center justify-center">
            <span className="text-white font-bold text-2xl">L</span>
          </div>
        </div>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {authMode === 'forgot-password' ? <ForgotPasswordForm /> : <AuthTabs initialTab={authMode === 'register' ? 'register' : 'login'} />}
        </div>
      </div>
    </div>;
};