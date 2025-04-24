// src/LMSComponents/Materials.jsx
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, onValue } from 'firebase/database';
import { auth, database } from '../firebase/config';
import { useNavigate } from 'react-router-dom';
// import LMSNavbar from './LMSNavbar';
import ContentCard from './ContentCard';

const Materials = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        
        // Fetch user data
        const userRef = ref(database, `users/${currentUser.uid}`);
        onValue(userRef, (snapshot) => {
          if (snapshot.exists()) {
            setUserData(snapshot.val());
          }
        });
        
        // Fetch content from the database
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
            
            // Sort by date (newest first)
            contentList.sort((a, b) => {
              const dateA = new Date(a.createdAt || 0);
              const dateB = new Date(b.createdAt || 0);
              return dateB - dateA;
            });
            
            setContent(contentList);
          } else {
            // Set empty content array if no content exists
            setContent([]);
          }
          setLoading(false);
        }, (error) => {
          console.error("Error fetching content:", error);
          setLoading(false);
        });
      } else {
        // Not logged in, redirect to login
        navigate('/lms/login');
      }
    });
    
    return () => unsubscribe();
  }, [navigate]);

  // Filter content based on selected type
  const filteredContent = filter === 'all' 
    ? content 
    : content.filter(item => item.contentType === filter);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* <LMSNavbar user={user} userData={userData} /> */}
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <LMSNavbar user={user} userData={userData} /> */}
      
      <div className="container mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">Learning Materials</h2>
          <p className="text-gray-600">
            Browse through all available learning resources. Use the filters below to find specific material types.
          </p>
        </div>
        
        {/* Filter buttons */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button 
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border'}`}
          >
            All Materials
          </button>
          <button 
            onClick={() => setFilter('pdf')}
            className={`px-4 py-2 rounded-full ${filter === 'pdf' ? 'bg-red-600 text-white' : 'bg-white text-gray-700 border'}`}
          >
            PDFs
          </button>
          <button 
            onClick={() => setFilter('word')}
            className={`px-4 py-2 rounded-full ${filter === 'word' ? 'bg-blue-700 text-white' : 'bg-white text-gray-700 border'}`}
          >
            Documents
          </button>
          <button 
            onClick={() => setFilter('ppt')}
            className={`px-4 py-2 rounded-full ${filter === 'ppt' ? 'bg-orange-600 text-white' : 'bg-white text-gray-700 border'}`}
          >
            Presentations
          </button>
          <button 
            onClick={() => setFilter('video')}
            className={`px-4 py-2 rounded-full ${filter === 'video' ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 border'}`}
          >
            Videos
          </button>
          <button 
            onClick={() => setFilter('image')}
            className={`px-4 py-2 rounded-full ${filter === 'image' ? 'bg-green-600 text-white' : 'bg-white text-gray-700 border'}`}
          >
            Images
          </button>
        </div>
        
        {filteredContent.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-600">No {filter !== 'all' ? filter : ''} materials available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContent.map((item) => (
              <ContentCard key={item.id} content={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Materials;