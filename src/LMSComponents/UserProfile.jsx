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
      <div className="min-h-screen bg-slate-50 flex justify-center items-center">
        <div className="relative w-20 h-20">
          <div className="absolute top-0 left-0 w-full h-full border-8 border-slate-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-8 border-transparent border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  const userInitial = userData?.name 
    ? userData.name.charAt(0).toUpperCase() 
    : user?.email.charAt(0).toUpperCase();

  const accountType = user?.email === 'Inspiringshereen@gmail.com' ? 'Administrator' : 'Student';
  const joinedDate = userData?.createdAt 
    ? new Date(userData.createdAt).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }) 
    : 'Unknown';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Card Container */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            
            {/* Header Section */}
            <div className="relative">
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-indigo-600 opacity-10">
                <div className="absolute inset-0" style={{
                  backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'52\' height=\'26\' viewBox=\'0 0 52 26\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.15\'%3E%3Cpath d=\'M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z\' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                  backgroundSize: '24px'
                }}></div>
              </div>
              
              {/* Header Content */}
              <div className="relative pt-16 pb-24 px-6 sm:px-10 text-center">
                <div className="relative flex justify-center">
                  <div className="group">
                    {/* Profile Avatar */}
                    <div className="h-32 w-32 rounded-full bg-gradient-to-br from-indigo-600 to-violet-500 p-1 shadow-lg ring-4 ring-white">
                      <div className="h-full w-full rounded-full bg-white flex items-center justify-center text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 to-violet-500">
                        {userInitial}
                      </div>
                    </div>
                  </div>
                </div>

                {/* User Name */}
                <h1 className="mt-6 text-3xl font-extrabold text-slate-800 tracking-tight">
                  {userData?.name || 'Welcome'}
                </h1>
                
                {/* Account Type Badge */}
                <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                  {accountType}
                </div>
              </div>
            </div>
            
            {/* Profile Details */}
            <div className="px-6 sm:px-10 py-8 bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Email */}
                <div className="bg-slate-50 rounded-xl p-6 shadow-sm transition-all hover:shadow-md">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-700">Email</h3>
                  </div>
                  <p className="text-base text-slate-600 break-all">
                    {user?.email}
                  </p>
                </div>
                
                {/* Join Date */}
                <div className="bg-slate-50 rounded-xl p-6 shadow-sm transition-all hover:shadow-md">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-700">Joined Date</h3>
                  </div>
                  <p className="text-base text-slate-600">
                    {joinedDate}
                  </p>
                </div>
              </div>
              
              {/* Progress Bar - Visual element for engagement */}
              <div className="mt-8 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium text-slate-700">Profile Completion</h3>
                  <span className="text-sm text-slate-500">75%</span>
                </div>
                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="mt-10 flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={navigateToFullProfile}
                  className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:-translate-y-0.5"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                  View Full Profile
                </button>
                
                <button className="inline-flex justify-center items-center px-6 py-3 border border-slate-300 text-base font-medium rounded-lg shadow-sm text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
                  </svg>
                  Settings
                </button>
              </div>
            </div>
            
            {/* Footer Section */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
              <div className="flex justify-between items-center">
                <p className="text-sm text-slate-500">Last login: Today at 10:23 AM</p>
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  <span className="text-sm text-slate-500">Online</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;