import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
// Your Firebase configuration
// Replace with your own Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAU1SLPdMZnSNH8LX3f25x0WfFz0k10c54",
  authDomain: "genai-95361.firebaseapp.com",
  projectId: "genai-95361",
  storageBucket: "genai-95361.firebasestorage.app",
  messagingSenderId: "693410313167",
  appId: "1:693410313167:web:7ccd1d6418d657942958ba",
  measurementId: "G-Z7RW4B0DHB"
};// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export default app;