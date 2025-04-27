// src/LMSComponents/Auth/AdminSignup.jsx
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/config';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminSignup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [createdUserEmail, setCreatedUserEmail] = useState('');
  const navigate = useNavigate();

  // Base API URL - use environment variable or default to localhost
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Check if current user is admin with case-insensitive comparison
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && user.email.toLowerCase() === 'inspiringshereen@gmail.com'.toLowerCase()) {
        setIsAdmin(true);
      } else if (user) {
        // If logged in but not admin, redirect to LMS home
        navigate('/lms/home');
      } else {
        // If not logged in, redirect to login
        navigate('/lms/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Countdown timer for success page
  useEffect(() => {
    let timer;
    if (showSuccess && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (showSuccess && countdown === 0) {
      navigate('/lms/home');
    }
    return () => clearTimeout(timer);
  }, [showSuccess, countdown, navigate]);

  const handleSignup = async (e) => {
    e.preventDefault();

    // Check if current user is admin
    if (!isAdmin) {
      setError('Only admin can create new accounts');
      return;
    }

    // Password validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Get the admin token for backend requests
      const adminToken = await auth.currentUser.getIdToken();

      // Initialize a separate Firebase app instance for user creation
      // We're using the same config but with a different app name
      const firebaseConfig = {
        // Use the same config as your main app
        // This is just a reference - you'll use your actual Firebase config
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
        storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
        appId: import.meta.env.VITE_FIREBASE_APP_ID
      };

      // Create a secondary app just for user registration
      const secondaryApp = initializeApp(firebaseConfig, "secondaryApp");
      const secondaryAuth = getAuth(secondaryApp);

      // Create user with the secondary app
      const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, password);
      const newUser = userCredential.user;

      // Immediately sign out from the secondary app to avoid affecting main session
      await secondaryAuth.signOut();

      // Create user in your PostgreSQL database via your backend
      const dbResponse = await axios.post(`${API_URL}/api/users`, {
        uid: newUser.uid,
        name,
        email,
        role: 'New User'
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (dbResponse.status !== 201) {
        throw new Error('Failed to create user in database');
      }

      // Send welcome email
      await axios.post(`${API_URL}/api/send-welcome-email`, {
        name,
        email,
        password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // Save created user email for success message
      setCreatedUserEmail(email);
      setShowSuccess(true);
      setCountdown(10);

      // Clear form
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setName('');
    } catch (error) {
      console.error('Signup error:', error);
      if (error.response && error.response.status === 409) {
        setError('User already exists. Please use a different email.');
      } else if (error.code === 'auth/email-already-in-use') {
        setError('Email is already in use');
      } else {
        setError('Error creating account: ' + (error.message || error));
      }
    } finally {
      setLoading(false);
    }
  };

  // If showing success UI
  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-blue-800 to-purple-900">
        <div className="bg-[#F9FAFB] dark:bg-gray-900 p-8 rounded-2xl shadow-2xl w-full max-w-md text-center backdrop-blur-lg bg-opacity-95 dark:bg-opacity-90 border border-[#E5E7EB] dark:border-gray-700">
          <div className="mb-6">
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-emerald-100 dark:bg-emerald-900">
              <svg className="h-12 w-12 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Success!</h2>
          <div className="mb-8">
            <p className="text-[#666666] dark:text-gray-300 text-lg mb-2">
              Student account for
            </p>
            <p className="font-medium text-blue-600 dark:text-blue-400 text-xl mb-4">
              {createdUserEmail}
            </p>
            <p className="text-[#666666] dark:text-gray-300">
              has been created successfully.
            </p>
            <div className="mt-6 inline-flex items-center justify-center px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900">
              <span className="text-blue-800 dark:text-blue-300">Redirecting in </span>
              <span className="ml-1 bg-blue-600 text-white dark:bg-[#2A62FF] w-8 h-8 rounded-full flex items-center justify-center font-bold">{countdown}</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => {
                setShowSuccess(false);
                setCountdown(10);
              }}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all shadow-lg hover:shadow-xl"
            >
              Create Another Account
            </button>
            <button
              onClick={() => navigate('/lms/admin')}
              className="px-6 py-3 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-blue-800 to-purple-900">
        <div className="bg-[#F9FAFB] dark:bg-gray-900 p-8 rounded-2xl shadow-2xl">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">Checking permissions...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-blue-800 to-purple-900 px-4 py-12">
      <div className="bg-[#F9FAFB] dark:bg-gray-900 p-8 rounded-2xl shadow-2xl w-full max-w-md backdrop-blur-lg bg-opacity-95 dark:bg-opacity-90 border border-[#E5E7EB] dark:border-gray-700">
        <div className="text-center mb-8">
          <div className="mb-4 inline-block p-3 rounded-full bg-blue-100 dark:bg-blue-900">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Create User Account</h1>
          <p className="text-[#666666] dark:text-gray-400 mt-2">Add a new student to ASTA Education LMS</p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-400 p-4 mb-6 rounded-r-lg" role="alert">
            <div className="flex">
              <svg className="h-5 w-5 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p>{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full px-4 py-3 rounded-xl border border-[#E5E7EB] dark:border-gray-600 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-[#2A62FF] bg-[#F9FAFB] dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="Enter student's full name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full px-4 py-3 rounded-xl border border-[#E5E7EB] dark:border-gray-600 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-[#2A62FF] bg-[#F9FAFB] dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="student@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full px-4 py-3 rounded-xl border border-[#E5E7EB] dark:border-gray-600 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-[#2A62FF] bg-[#F9FAFB] dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="Create a strong password"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Minimum 6 characters</p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="block w-full px-4 py-3 rounded-xl border border-[#E5E7EB] dark:border-gray-600 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-[#2A62FF] bg-[#F9FAFB] dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="Confirm password"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-6 border border-transparent rounded-xl shadow-lg text-base font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminSignup;