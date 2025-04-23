// src/LMSComponents/LMSHome.jsx
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, onValue } from 'firebase/database';
import { auth, database } from '../firebase/config';
import { useNavigate } from 'react-router-dom';
import LMSNavbar from './LMSNavbar';
import ContentCard from './ContentCard';
import AdminDashboard from './Admin/AdminDashboard';

const LMSHome = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // Check if user is admin (case-insensitive email comparison)
        const adminStatus = currentUser.email.toLowerCase() === 'inspiringshereen@gmail.com'.toLowerCase();
        setIsAdmin(adminStatus);
        console.log("Admin status:", adminStatus); // Debug log

        // Fetch user data
        const userRef = ref(database, `users/${currentUser.uid}`);
        onValue(userRef, (snapshot) => {
          if (snapshot.exists()) {
            setUserData(snapshot.val());
          }
          // Set loading to false even if user data doesn't exist
          setLoading(false);
        }, (error) => {
          console.error("Error fetching user data:", error);
          setLoading(false);
        });

        // Fetch content with Cloudinary URLs from the database
        const contentRef = ref(database, 'content');
        onValue(contentRef, (snapshot) => {
          if (snapshot.exists()) {
            const contentList = [];
            snapshot.forEach((childSnapshot) => {
              // Content data now contains Cloudinary URLs directly
              // No need for additional Firebase Storage operations
              contentList.push({
                id: childSnapshot.key,
                ...childSnapshot.val()
              });
            });
            // Sort by date (newest first)
            contentList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setContent(contentList);
          } else {
            // Set empty content array if no content exists
            setContent([]);
          }
        }, (error) => {
          console.error("Error fetching content:", error);
        });
      } else {
        // Not logged in, redirect to login
        navigate('/lms/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* {!isAdmin && <LMSNavbar user={user} userData={userData} isAdmin={isAdmin} />} */}
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  // If user is admin, render AdminDashboard
  if (isAdmin) {
    return (
      <>
        <AdminDashboard user={user} userData={userData} content={content} />
      </>
    );
  }

  // For students, show LMSNavbar + content
  return (
    <div className="min-h-screen bg-gray-50">
      <LMSNavbar user={user} userData={userData} isAdmin={isAdmin} />

      <div className="container mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-blue-600">Welcome, {userData?.name || 'Student'}</h2>
          <p className="text-gray-600">
            Access your phonics learning materials below. Watch videos, download resources, and track your progress.
          </p>
        </div>

        <h3 className="text-xl font-semibold text-gray-800 mb-4">Latest Learning Materials</h3>

        {content.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-600">No content available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.map((item) => (
              <ContentCard key={item.id} content={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default LMSHome;