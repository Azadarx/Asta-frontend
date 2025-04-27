import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, onValue, update } from 'firebase/database';
import { auth, database } from '../firebase/config';
import { useNavigate } from 'react-router-dom';

const MyProfile = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  // Form fields
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // Fetch user data
        const userRef = ref(database, `users/${currentUser.uid}`);
        onValue(userRef, (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            setUserData(data);
            setFormData({
              name: data.name || '',
              phone: data.phone || '',
              address: data.address || ''
            });
          }
          setLoading(false);
        });
      } else {
        // Not logged in, redirect to login
        navigate('/lms/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name cannot be empty');
      return false;
    }

    if (formData.phone && !/^\+?[0-9\s\-()]+$/.test(formData.phone)) {
      setError('Please enter a valid phone number');
      return false;
    }

    return true;
  };

  const handleSaveProfile = async () => {
    if (!validateForm()) return;

    setError('');
    try {
      const userRef = ref(database, `users/${user.uid}`);
      await update(userRef, {
        name: formData.name,
        phone: formData.phone,
        address: formData.address
      });

      setSuccessMessage('Profile updated successfully!');
      setEditMode(false);

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      setError('Failed to update profile. Please try again.');
      console.error('Error updating profile:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-800 flex justify-center items-center">
        <div className="flex flex-col items-center p-8 backdrop-blur-lg bg-[#F9FAFB]/5 rounded-2xl">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-200 border-opacity-20 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-t-indigo-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin absolute top-0 left-0"></div>
            <div className="w-16 h-16 border-4 border-t-transparent border-r-transparent border-b-purple-500 border-l-transparent rounded-full animate-spin absolute top-0 left-0" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          </div>
          <p className="mt-6 text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-purple-200">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-800 py-8 px-4 sm:py-12 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back button - fixed position */}
        <button
          onClick={() => navigate('/lms/home')}
          className="fixed top-6 left-6 z-10 flex items-center gap-2 px-4 py-2 rounded-full bg-[#F9FAFB]/10 backdrop-blur-md hover:bg-[#F9FAFB]/20 transition-all duration-300 text-white shadow-lg group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover:-translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="text-sm font-medium">Back</span>
        </button>

        {/* Alert Messages - Floating and animated */}
        {error && (
          <div className="fixed top-6 right-6 z-50 max-w-md w-full bg-gradient-to-r from-red-500 to-pink-500 text-white p-4 rounded-xl shadow-xl animate-fade-in flex items-center" role="alert">
            <svg className="h-6 w-6 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="font-medium">{error}</p>
            <button
              onClick={() => setError('')}
              className="ml-auto flex-shrink-0 text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}

        {successMessage && (
          <div className="fixed top-6 right-6 z-50 max-w-md w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-4 rounded-xl shadow-xl animate-fade-in flex items-center" role="alert">
            <svg className="h-6 w-6 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <p className="font-medium">{successMessage}</p>
          </div>
        )}

        {/* Glass-morphism Profile Card */}
        <div className="backdrop-blur-xl bg-[#F9FAFB]/10 border border-white/20 rounded-3xl shadow-2xl overflow-hidden mb-8 transform transition-all duration-300 hover:shadow-purple-500/20">
          <div className="relative">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 right-0 h-64 overflow-hidden">
              <div className="absolute -top-24 -left-24 w-64 h-64 bg-purple-500 rounded-full opacity-20 filter blur-3xl"></div>
              <div className="absolute -top-12 left-48 w-64 h-64 bg-indigo-500 rounded-full opacity-20 filter blur-3xl"></div>
              <div className="absolute top-12 right-12 w-40 h-40 bg-pink-500 rounded-full opacity-20 filter blur-3xl"></div>
            </div>

            {/* Profile Header */}
            <div className="pt-16 pb-24 px-6 sm:px-10 relative z-10">
              {/* Profile Avatar with animated border */}
              <div className="relative mx-auto h-36 w-36 rounded-full">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full animate-spin-slow opacity-70 blur-sm"></div>
                <div className="absolute inset-1 bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-800 rounded-full"></div>
                <div className="absolute inset-2 bg-[#F9FAFB] dark:bg-gray-900 rounded-full flex items-center justify-center">
                  <span className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
                    {userData?.name ? userData.name.charAt(0).toUpperCase() : user?.email.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Edit button */}
              <button
                onClick={() => setEditMode(!editMode)}
                className="absolute top-6 right-6 flex items-center gap-2 px-4 py-2 rounded-full bg-[#F9FAFB]/10 backdrop-blur-md hover:bg-[#F9FAFB]/20 transition-all duration-300 text-white shadow-lg"
              >
                {!editMode ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span className="text-sm font-medium hidden sm:inline">Edit Profile</span>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="text-sm font-medium hidden sm:inline">Cancel</span>
                  </>
                )}
              </button>

              <div className="text-center mt-6">
                <h1 className="text-3xl font-bold text-white">{userData?.name || 'Your Profile'}</h1>
                <p className="text-indigo-200 mt-2">{user?.email}</p>

                {/* Role Badge */}
                <div className="mt-4 inline-flex items-center px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-600/30 to-purple-600/30 backdrop-blur-md text-white border border-indigo-500/30">
                  <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  {user?.email === 'Inspiringshereen@gmail.com' ? 'Administrator' : 'Student'}
                </div>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="bg-[#F9FAFB]/5 backdrop-blur-lg border-t border-white/10 p-6 sm:p-8 md:p-10">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Profile Details
              </h2>

              {editMode && (
                <div className="text-sm text-indigo-200 italic flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Editing mode enabled
                </div>
              )}
            </div>

            <div className="space-y-8">
              <div className="grid sm:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-indigo-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Full Name
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-[#F9FAFB]/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-[#F9FAFB]/5 backdrop-blur-md border border-white/10 rounded-xl text-white">
                      {userData?.name || 'Not set'}
                    </div>
                  )}
                </div>

                {/* Email Address */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-indigo-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Email Address
                  </label>
                  <div className="px-4 py-3 bg-[#F9FAFB]/5 backdrop-blur-md border border-white/10 rounded-xl text-white">
                    {user?.email}
                  </div>
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-indigo-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Phone Number
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-[#F9FAFB]/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                      placeholder="Enter your phone number"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-[#F9FAFB]/5 backdrop-blur-md border border-white/10 rounded-xl text-white">
                      {userData?.phone || 'Not set'}
                    </div>
                  )}
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-indigo-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Address
                  </label>
                  {editMode ? (
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-[#F9FAFB]/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 resize-none"
                      placeholder="Enter your address"
                      rows="3"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-[#F9FAFB]/5 backdrop-blur-md border border-white/10 rounded-xl text-white">
                      {userData?.address || 'Not set'}
                    </div>
                  )}
                </div>
              </div>

              {/* Save Button */}
              {editMode && (
                <div className="flex justify-end mt-8">
                  <button
                    onClick={handleSaveProfile}
                    className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium flex items-center gap-2 hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Information Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Security Card */}
          <div className="backdrop-blur-xl bg-[#F9FAFB]/10 border border-white/20 rounded-2xl shadow-xl p-6 transform transition-all duration-300 hover:shadow-purple-500/20">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">Account Security</h3>
            </div>
            <p className="text-indigo-200 mb-4">Protect your account with these security recommendations.</p>
            <ul className="space-y-3">
              <li className="flex items-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>Email verification complete</span>
              </li>
              <li className="flex items-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>Two-factor authentication not enabled</span>
              </li>
            </ul>
            <button className="w-full mt-6 px-4 py-2 bg-[#F9FAFB]/10 backdrop-blur-md border border-white/20 rounded-xl text-white font-medium flex items-center justify-center gap-2 hover:bg-[#F9FAFB]/20 transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Security Settings
            </button>
          </div>

          {/* Progress Card */}
          <div className="backdrop-blur-xl bg-[#F9FAFB]/10 border border-white/20 rounded-2xl shadow-xl p-6 transform transition-all duration-300 hover:shadow-purple-500/20">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white">Your Progress</h3>
            </div>
            <p className="text-indigo-200 mb-4">Track your learning journey and achievements.</p>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-indigo-200">Courses Completed</span>
                  <span className="text-white">2/5</span>
                </div>
                <div className="h-2 bg-[#F9FAFB]/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" style={{ width: '40%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-indigo-200">Profile Completion</span>
                  <span className="text-white">80%</span>
                </div>
                <div className="h-2 bg-[#F9FAFB]/10 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" style={{ width: '80%' }}></div>
                </div>
              </div>
            </div>

            <button className="w-full mt-6 px-4 py-2 bg-[#F9FAFB]/10 backdrop-blur-md border border-white/20 rounded-xl text-white font-medium flex items-center justify-center gap-2 hover:bg-[#F9FAFB]/20 transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              View All Progress
            </button>
          </div>
        </div>

        {/* Membership Card */}
        <div className="backdrop-blur-xl bg-[#F9FAFB]/10 border border-white/20 rounded-2xl shadow-xl p-6 mt-6 transform transition-all duration-300 hover:shadow-purple-500/20">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pink-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white">Membership Status</h3>
          </div>

          <div className="bg-gradient-to-r from-indigo-800/40 to-purple-800/40 rounded-xl p-6 border border-white/10">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="text-indigo-200 text-sm">Current Plan</p>
                <h4 className="text-white text-2xl font-bold">Premium Student</h4>
              </div>
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-1.5 rounded-full text-white text-sm font-medium">
                Active
              </div>
            </div>

            <div className="flex items-center mb-4">
              <div className="flex-1">
                <p className="text-indigo-200 text-sm">Next billing date</p>
                <p className="text-white">May 15, 2025</p>
              </div>
              <div className="h-10 w-px bg-[#F9FAFB]/10 mx-4"></div>
              <div className="flex-1">
                <p className="text-indigo-200 text-sm">Payment method</p>
                <p className="text-white flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Credit Card
                </p>
              </div>
            </div>

            <div className="flex space-x-4 mt-6">
              <button className="flex-1 px-4 py-2 bg-[#F9FAFB]/10 backdrop-blur-md border border-white/20 rounded-xl text-white font-medium flex items-center justify-center gap-2 hover:bg-[#F9FAFB]/20 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                View Invoices
              </button>
              <button className="flex-1 px-4 py-2 bg-[#F9FAFB]/10 backdrop-blur-md border border-white/20 rounded-xl text-white font-medium flex items-center justify-center gap-2 hover:bg-[#F9FAFB]/20 transition-all duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Change Plan
              </button>
            </div>
          </div>
        </div>

        {/* Footer with Navigation Links */}
        <div className="mt-10 flex flex-wrap justify-center items-center gap-4 text-indigo-200 text-sm">
          <a href="#" className="hover:text-white transition-colors duration-300">Privacy Policy</a>
          <span className="text-indigo-400/50">•</span>
          <a href="#" className="hover:text-white transition-colors duration-300">Terms of Service</a>
          <span className="text-indigo-400/50">•</span>
          <a href="#" className="hover:text-white transition-colors duration-300">Contact Support</a>
          <span className="text-indigo-400/50">•</span>
          <a href="#" className="hover:text-white transition-colors duration-300">FAQ</a>
        </div>

        <div className="mt-6 text-center text-indigo-300/50 text-xs">
          © 2025 LMS Platform. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default MyProfile;