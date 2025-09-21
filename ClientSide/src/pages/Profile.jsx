import React from 'react';
import { ProfileForm } from '../components/profile/ProfileForm';
import { useAuth } from '../contexts/AuthContext';
export const Profile = () => {
  const {
    currentUser
  } = useAuth();
  if (!currentUser) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }
  return <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-neutral-900 mb-6">Profile Settings</h1>
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200">
          <div className="p-6">
            <ProfileForm user={currentUser} />
          </div>
        </div>
      </div>
    </div>;
};