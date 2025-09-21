import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth, googleProvider } from '../utils/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut as firebaseSignOut, onAuthStateChanged, sendPasswordResetEmail } from 'firebase/auth';
import { setAuthToken, removeAuthToken, getAuthToken } from '../utils/auth';
const AuthContext = createContext(null);
export const AuthProvider = ({
  children
}) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async user => {
      setCurrentUser(user);
      setLoading(false);
      if (user) {
        // Get the ID token for JWT
        const token = await user.getIdToken();
        setAuthToken(token);
      } else {
        removeAuthToken();
      }
    });
    // Check for existing token on load
    const existingToken = getAuthToken();
    if (existingToken && !currentUser) {
      // Token exists but no user - will be handled by onAuthStateChanged
    }
    return unsubscribe;
  }, []);
  // Register with email and password
  const register = async (email, password, name) => {
    try {
      setError('');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Update profile with name
      await userCredential.user.updateProfile({
        displayName: name
      });
      return userCredential.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };
  // Login with email and password
  const login = async (email, password) => {
    try {
      setError('');
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };
  // Login with Google
  const loginWithGoogle = async () => {
    try {
      setError('');
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };
  // Logout
  const logout = async () => {
    try {
      setError('');
      await firebaseSignOut(auth);
      removeAuthToken();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };
  // Reset password
  const resetPassword = async email => {
    try {
      setError('');
      await sendPasswordResetEmail(auth, email);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };
  const value = {
    currentUser,
    login,
    register,
    loginWithGoogle,
    logout,
    resetPassword,
    error,
    loading
  };
  return <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>;
};
export const useAuth = () => {
  return useContext(AuthContext);
};