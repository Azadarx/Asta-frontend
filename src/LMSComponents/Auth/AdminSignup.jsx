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
        role: 'student'
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
          <div className="mb-4">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
              <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Account Created Successfully!</h2>
          <p className="text-gray-600 mb-6">
            Student account for <span className="font-medium">{createdUserEmail}</span> has been created.
            <br />
            Redirecting to LMS Home in <span className="font-bold">{countdown}</span> seconds...
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => {
                setShowSuccess(false);
                setCountdown(10);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Create Another Account
            </button>
            <button
              onClick={() => navigate('/lms/admin')}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return <div className="p-8 text-center">Checking permissions...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">Create <span className="text-purple-600">User Account</span></h1>
          <p className="text-gray-600 mt-2">Create a new student account for ASTA Education LMS</p>
        </div>

        {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
          <p>{error}</p>
        </div>}

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminSignup;