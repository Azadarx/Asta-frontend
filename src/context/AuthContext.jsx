// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { getDatabase, ref, get, set } from 'firebase/database';
import { firebaseConfig } from '../firebase/config';
import { uploadToCloudinary, getCloudinaryFolder } from '../utils/cloudinaryUtils';

// Initialize Firebase app and RTDB (avoid duplicate initialization)
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const rtdb = getDatabase(app);

// Create context
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const ADMIN_EMAIL = 'inspiringshereen@gmail.com';

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRTDBData, setUserRTDBData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  // Fetch user data from RTDB or initialize
  const fetchUserData = async (user) => {
    if (!user) return;

    const uid = user.uid;
    const userRef = ref(rtdb, `users/${uid}`);

    try {
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        const data = snapshot.val();
        setUserRTDBData(data);
        setIsAdmin(data.email === ADMIN_EMAIL);
      } else {
        // If not found in RTDB, initialize
        const newUserData = {
          uid,
          email: user.email,
          displayName: user.displayName || '',
          role: user.email === ADMIN_EMAIL ? 'admin' : 'student',
          createdAt: new Date().toISOString(),
        };

        await set(userRef, newUserData);
        setUserRTDBData(newUserData);
        setIsAdmin(newUserData.role === 'admin');
      }
    } catch (err) {
      console.error('Failed to fetch RTDB user data:', err);
      setError('Error loading user data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        fetchUserData(user);
      } else {
        setUserRTDBData(null);
        setIsAdmin(false);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Signup logic
  const signup = async (email, password, fullName) => {
    setError('');
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCred.user, { displayName: fullName });
      await fetchUserData(userCred.user);
      return userCred.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Login logic
  const login = async (email, password) => {
    setError('');
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      await fetchUserData(userCred.user);
      return userCred.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Logout logic
  const logout = async () => {
    await signOut(auth);
    setCurrentUser(null);
    setUserRTDBData(null);
    setIsAdmin(false);
  };

  // Cloudinary upload function
  const uploadFile = async (file, customFolder = null) => {
    setError('');
    setUploadProgress(0);
    
    if (!currentUser) {
      setError('You must be logged in to upload files');
      return null;
    }
    
    try {
      // Determine the appropriate folder based on file type
      const folder = customFolder || getCloudinaryFolder(file);
      
      // Set progress to simulate upload progress
      setUploadProgress(30);
      
      // Upload to Cloudinary
      const result = await uploadToCloudinary(file, folder);
      
      setUploadProgress(100);
      
      // Return the result directly
      return result;
    } catch (err) {
      console.error('File upload error:', err);
      setError('Failed to upload file: ' + (err.message || 'Unknown error'));
      setUploadProgress(0);
      return null;
    }
  };

  const value = {
    currentUser,
    userRTDBData,
    isAdmin,
    loading,
    error,
    uploadProgress,
    setUploadProgress,
    setError,
    login,
    signup,
    logout,
    uploadFile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};