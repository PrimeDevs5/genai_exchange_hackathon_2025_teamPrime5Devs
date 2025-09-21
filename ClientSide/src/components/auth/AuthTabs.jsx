import React, { useState } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { GoogleAuthButton } from './GoogleAuthButton';
export const AuthTabs = ({
  initialTab = 'login'
}) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  return <div className="w-full max-w-md">
      <div className="flex border-b border-neutral-200 mb-6">
        <button className={`flex-1 py-4 text-center font-medium text-sm ${activeTab === 'login' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-neutral-500 hover:text-neutral-700'}`} onClick={() => setActiveTab('login')}>
          Log In
        </button>
        <button className={`flex-1 py-4 text-center font-medium text-sm ${activeTab === 'register' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-neutral-500 hover:text-neutral-700'}`} onClick={() => setActiveTab('register')}>
          Sign Up
        </button>
      </div>
      <div className="mb-6">
        <GoogleAuthButton />
      </div>
      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-neutral-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-neutral-500">or continue with</span>
        </div>
      </div>
      {activeTab === 'login' ? <LoginForm /> : <RegisterForm />}
    </div>;
};