import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { updateProfile, updateEmail, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { UserIcon, AlertCircleIcon, CheckCircleIcon } from 'lucide-react';
export const ProfileForm = ({
  user
}) => {
  const {
    currentUser
  } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [activeTab, setActiveTab] = useState('personal');
  useEffect(() => {
    if (currentUser) {
      setDisplayName(currentUser.displayName || '');
      setEmail(currentUser.email || '');
      setPhotoURL(currentUser.photoURL || '');
    }
  }, [currentUser]);
  const handlePersonalInfoUpdate = async e => {
    e.preventDefault();
    setError('');
    setMessage('');
    setUpdating(true);
    try {
      // Update display name
      if (displayName !== currentUser.displayName) {
        await updateProfile(currentUser, {
          displayName: displayName
        });
      }
      // Update email (requires recent authentication)
      if (email !== currentUser.email && currentPassword) {
        const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
        await reauthenticateWithCredential(currentUser, credential);
        await updateEmail(currentUser, email);
      }
      setMessage('Profile information updated successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(false);
      setCurrentPassword('');
    }
  };
  const handlePasswordUpdate = async e => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (newPassword !== confirmPassword) {
      return setError('Passwords do not match');
    }
    if (newPassword.length < 6) {
      return setError('Password should be at least 6 characters');
    }
    setUpdating(true);
    try {
      // Re-authenticate user
      const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, newPassword);
      setMessage('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };
  return <div>
      {/* Profile Header */}
      <div className="flex items-center mb-8">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center">
            {photoURL ? <img src={photoURL} alt="Profile" className="w-20 h-20 rounded-full object-cover" /> : <UserIcon className="w-8 h-8 text-primary-600" />}
          </div>
          {/* Photo upload button - in a real app, implement file upload */}
          <button className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 shadow-sm border border-neutral-200" onClick={() => alert('Photo upload would be implemented here')}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-neutral-600" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
        </div>
        <div className="ml-6">
          <h2 className="text-xl font-semibold text-neutral-900">
            {currentUser.displayName || 'User'}
          </h2>
          <p className="text-neutral-600">{currentUser.email}</p>
        </div>
      </div>
      {/* Tabs */}
      <div className="border-b border-neutral-200 mb-6">
        <div className="flex -mb-px">
          <button className={`py-3 px-4 text-sm font-medium border-b-2 ${activeTab === 'personal' ? 'border-primary-500 text-primary-600' : 'border-transparent text-neutral-600 hover:text-neutral-800'}`} onClick={() => setActiveTab('personal')}>
            Personal Information
          </button>
          <button className={`py-3 px-4 text-sm font-medium border-b-2 ${activeTab === 'password' ? 'border-primary-500 text-primary-600' : 'border-transparent text-neutral-600 hover:text-neutral-800'}`} onClick={() => setActiveTab('password')}>
            Password
          </button>
        </div>
      </div>
      {/* Error and success messages */}
      {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-start">
          <AlertCircleIcon className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-red-700">{error}</p>
        </div>}
      {message && <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md flex items-start">
          <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-green-700">{message}</p>
        </div>}
      {/* Personal Information Form */}
      {activeTab === 'personal' && <form onSubmit={handlePersonalInfoUpdate} className="space-y-6">
          <div>
            <label htmlFor="displayName" className="block text-sm font-medium text-neutral-700 mb-1">
              Display Name
            </label>
            <input id="displayName" type="text" value={displayName} onChange={e => setDisplayName(e.target.value)} className="input w-full" placeholder="Your name" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
              Email Address
            </label>
            <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="input w-full" placeholder="your@email.com" />
          </div>
          {email !== currentUser.email && <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-neutral-700 mb-1">
                Current Password (required to update email)
              </label>
              <input id="currentPassword" type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="input w-full" placeholder="Enter current password" required={email !== currentUser.email} />
            </div>}
          <div>
            <button type="submit" className="btn btn-primary" disabled={updating}>
              {updating ? 'Updating...' : 'Update Profile'}
            </button>
          </div>
        </form>}
      {/* Password Update Form */}
      {activeTab === 'password' && <form onSubmit={handlePasswordUpdate} className="space-y-6">
          <div>
            <label htmlFor="currentPasswordForUpdate" className="block text-sm font-medium text-neutral-700 mb-1">
              Current Password
            </label>
            <input id="currentPasswordForUpdate" type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="input w-full" placeholder="Enter current password" required />
          </div>
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-neutral-700 mb-1">
              New Password
            </label>
            <input id="newPassword" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="input w-full" placeholder="Enter new password" required minLength={6} />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 mb-1">
              Confirm New Password
            </label>
            <input id="confirmPassword" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="input w-full" placeholder="Confirm new password" required />
          </div>
          <div>
            <button type="submit" className="btn btn-primary" disabled={updating}>
              {updating ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>}
      <div className="mt-8 pt-6 border-t border-neutral-200">
        <h3 className="text-lg font-medium text-neutral-900 mb-4">Account Information</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-neutral-600">Account created</span>
            <span className="text-neutral-900 font-medium">
              {currentUser.metadata?.creationTime ? new Date(currentUser.metadata.creationTime).toLocaleDateString() : 'N/A'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-600">Last sign in</span>
            <span className="text-neutral-900 font-medium">
              {currentUser.metadata?.lastSignInTime ? new Date(currentUser.metadata.lastSignInTime).toLocaleDateString() : 'N/A'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-600">Email verified</span>
            <span className={`font-medium ${currentUser.emailVerified ? 'text-green-600' : 'text-amber-600'}`}>
              {currentUser.emailVerified ? 'Yes' : 'No'}
            </span>
          </div>
        </div>
      </div>
    </div>;
};