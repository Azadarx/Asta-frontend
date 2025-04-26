// src/LMSComponents/UserProfile.jsx
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, onValue } from 'firebase/database';
import { auth, database } from '../firebase/config';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  const navigateToFullProfile = () => {
    navigate('/lms/my-profile');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-12">
            <div className="flex justify-center">
              <div className="h-32 w-32 rounded-full bg-white flex items-center justify-center text-blue-600 text-5xl font-bold">
                {userData?.name ? userData.name.charAt(0).toUpperCase() : user?.email.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
          
          <div className="px-6 py-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">User Profile</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <div className="px-4 py-2 bg-gray-100 rounded-md text-gray-800">
                  {userData?.name || 'Not set'}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="px-4 py-2 bg-gray-100 rounded-md text-gray-800">
                  {user?.email}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
                <div className="px-4 py-2 bg-gray-100 rounded-md text-gray-800">
                  {user?.email === 'Inspiringshereen@gmail.com' ? 'Administrator' : 'Student'}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Joined Date</label>
                <div className="px-4 py-2 bg-gray-100 rounded-md text-gray-800">
                  {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'Unknown'}
                </div>
              </div>
              
              <div className="pt-4">
                <button
                  onClick={navigateToFullProfile}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  My Full Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;