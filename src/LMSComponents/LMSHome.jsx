// src/LMSComponents/LMSHome.jsx
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, onValue } from 'firebase/database';
import { auth, database } from '../firebase/config';
import { useNavigate, useLocation } from 'react-router-dom';
import ContentCard from './ContentCard';
import AdminDashboard from './Admin/AdminDashboard';

const LMSHome = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isAdminPage = location.pathname === '/lms/admin';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        const adminStatus = currentUser.email.toLowerCase() === 'inspiringshereen@gmail.com'.toLowerCase();
        setIsAdmin(adminStatus);

        if (isAdminPage && !adminStatus) {
          navigate('/lms/home');
          return;
        }

        const userRef = ref(database, `users/${currentUser.uid}`);
        onValue(userRef, (snapshot) => {
          if (snapshot.exists()) {
            setUserData(snapshot.val());
          }
          setLoading(false);
        }, (error) => {
          console.error("Error fetching user data:", error);
          setLoading(false);
        });

        const contentRef = ref(database, 'content');
        onValue(contentRef, (snapshot) => {
          if (snapshot.exists()) {
            const contentList = [];
            snapshot.forEach((childSnapshot) => {
              contentList.push({
                id: childSnapshot.key,
                ...childSnapshot.val()
              });
            });
            const sortedContent = contentList
              .filter(item => item && item.createdAt)
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            setContent(sortedContent);
          } else {
            setContent([]);
          }
        }, (error) => {
          console.error("Error fetching content:", error);
        });
      } else {
        navigate('/lms/login');
      }
    });

    return () => unsubscribe();
  }, [navigate, isAdminPage]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isAdminPage || isAdmin) {
    return (
      <AdminDashboard user={user} userData={userData} content={content} />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
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