// src/components/ProtectedRoute.jsx
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, database as db } from '../firebase/config';
// import LMSNavbar from '../LMSComponents/LMSNavbar';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        try {
          // Fetch additional user data from Firestore
          const userRef = doc(db, 'users', currentUser.uid);
          const userSnap = await getDoc(userRef);
          
          if (userSnap.exists()) {
            const data = userSnap.data();
            setUserData(data);
            // Check if user is admin - either from role field or specific admin email
            const isAdminUser = data.role === 'admin' || currentUser.email === 'inspiringshereen@gmail.com';
            setIsAdmin(isAdminUser);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          // If the user is inspiringshereen@gmail.com, make them admin regardless of DB
          if (currentUser.email === 'inspiringshereen@gmail.com') {
            setIsAdmin(true);
          }
        }
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/lms/login" replace />;
  }

  if (adminOnly && !isAdmin) {
    return <Navigate to="/lms/home" replace />;
  }

  return (
    <>
      <LMSNavbar user={user} userData={userData} isAdmin={isAdmin} />
      {children}
    </>
  );
};

export default ProtectedRoute;