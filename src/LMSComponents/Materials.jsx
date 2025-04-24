// src/LMSComponents/Materials.jsx
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, onValue } from 'firebase/database';
import { auth, database } from '../firebase/config';
import { useNavigate } from 'react-router-dom';
// import LMSNavbar from './LMSNavbar';
import ContentCard from './ContentCard';
import { FaSearch, FaFilter, FaFilePdf, FaFileWord, FaFilePowerpoint, FaImage, FaVideo } from 'react-icons/fa';

const Materials = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [contentGroups, setContentGroups] = useState({});
  const [expandedGroup, setExpandedGroup] = useState(null);
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
            
            // Group content by title for dropdown feature
            const groups = {};
            contentList.forEach(item => {
              // Extract the main title without potential numbering or parts
              const baseTitle = item.title.replace(/\s+\d+$|\s+part\s+\d+$|\s+\(\d+\)$/i, '').trim();
              
              if (!groups[baseTitle]) {
                groups[baseTitle] = [];
              }
              groups[baseTitle].push(item);
            });
            
            setContentGroups(groups);
          } else {
            // Set empty content array if no content exists
            setContent([]);
            setContentGroups({});
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

  // Filter content based on selected type and search term
  const filteredContent = content.filter(item => {
    const contentTypeMatch = filter === 'all' || item.contentType === filter;
    const searchMatch = !searchTerm || 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return contentTypeMatch && searchMatch;
  });

  const getFilterIcon = (filterType) => {
    switch (filterType) {
      case 'pdf': return <FaFilePdf className="mr-2" />;
      case 'word': return <FaFileWord className="mr-2" />;
      case 'ppt': return <FaFilePowerpoint className="mr-2" />;
      case 'image': return <FaImage className="mr-2" />;
      case 'video': return <FaVideo className="mr-2" />;
      default: return null;
    }
  };

  const toggleGroup = (baseTitle) => {
    if (expandedGroup === baseTitle) {
      setExpandedGroup(null);
    } else {
      setExpandedGroup(baseTitle);
    }
  };

  const renderContentCard = (item) => {
    // If the item is part of a group with multiple items, show the dropdown
    const baseTitle = item.title.replace(/\s+\d+$|\s+part\s+\d+$|\s+\(\d+\)$/i, '').trim();
    const isGrouped = contentGroups[baseTitle] && contentGroups[baseTitle].length > 1;
    
    if (isGrouped) {
      return (
        <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{baseTitle}</h3>
            <button 
              onClick={() => toggleGroup(baseTitle)}
              className="text-blue-600 hover:text-blue-800 flex items-center mb-4"
            >
              {expandedGroup === baseTitle ? 'Hide items' : `Show all ${contentGroups[baseTitle].length} items`}
              <svg className={`w-4 h-4 ml-1 transform ${expandedGroup === baseTitle ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {expandedGroup === baseTitle && (
              <div className="mt-4 space-y-4">
                {contentGroups[baseTitle].map(groupItem => (
                  <ContentCard key={groupItem.id} content={groupItem} />
                ))}
              </div>
            )}
            
            {expandedGroup !== baseTitle && (
              <ContentCard content={contentGroups[baseTitle][0]} />
            )}
          </div>
        </div>
      );
    }
    
    // If not part of a group, just show the regular card
    return <ContentCard key={item.id} content={item} />;
  };

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
    <div className="min-h-screen bg-gray-100">
      {/* <LMSNavbar user={user} userData={userData} /> */}
      
      <div className="container mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">Learning Materials</h2>
          <p className="text-gray-600 mb-6">
            Browse through all available learning resources. Use the filters below to find specific material types.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            {/* Search bar */}
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Filter dropdown */}
            <div className="relative">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg py-2 pl-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Types</option>
                <option value="pdf">PDFs</option>
                <option value="word">Documents</option>
                <option value="ppt">Presentations</option>
                <option value="video">Videos</option>
                <option value="image">Images</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <FaFilter className="text-gray-400" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Filter chips/pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button 
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full flex items-center ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border'}`}
          >
            All Materials
          </button>
          <button 
            onClick={() => setFilter('pdf')}
            className={`px-4 py-2 rounded-full flex items-center ${filter === 'pdf' ? 'bg-red-600 text-white' : 'bg-white text-gray-700 border'}`}
          >
            {getFilterIcon('pdf')} PDFs
          </button>
          <button 
            onClick={() => setFilter('word')}
            className={`px-4 py-2 rounded-full flex items-center ${filter === 'word' ? 'bg-blue-700 text-white' : 'bg-white text-gray-700 border'}`}
          >
            {getFilterIcon('word')} Documents
          </button>
          <button 
            onClick={() => setFilter('ppt')}
            className={`px-4 py-2 rounded-full flex items-center ${filter === 'ppt' ? 'bg-orange-600 text-white' : 'bg-white text-gray-700 border'}`}
          >
            {getFilterIcon('ppt')} Presentations
          </button>
          <button 
            onClick={() => setFilter('video')}
            className={`px-4 py-2 rounded-full flex items-center ${filter === 'video' ? 'bg-purple-600 text-white' : 'bg-white text-gray-700 border'}`}
          >
            {getFilterIcon('video')} Videos
          </button>
          <button 
            onClick={() => setFilter('image')}
            className={`px-4 py-2 rounded-full flex items-center ${filter === 'image' ? 'bg-green-600 text-white' : 'bg-white text-gray-700 border'}`}
          >
            {getFilterIcon('image')} Images
          </button>
        </div>
        
        {filteredContent.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-600">No {filter !== 'all' ? filter : ''} materials available{searchTerm ? ' matching your search' : ''}.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Group content by base title */}
            {Object.keys(contentGroups).map(baseTitle => {
              // Filter the group based on current filter and search term
              const filteredGroup = contentGroups[baseTitle].filter(item => {
                const contentTypeMatch = filter === 'all' || item.contentType === filter;
                const searchMatch = !searchTerm || 
                  item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                  (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
                
                return contentTypeMatch && searchMatch;
              });
              
              if (filteredGroup.length === 0) return null;
              
              return (
                <div key={baseTitle} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{baseTitle}</h3>
                    
                    {filteredGroup.length > 1 ? (
                      <>
                        <button 
                          onClick={() => toggleGroup(baseTitle)}
                          className="text-blue-600 hover:text-blue-800 flex items-center mb-4"
                        >
                          {expandedGroup === baseTitle ? 'Hide items' : `Show all ${filteredGroup.length} items`}
                          <svg className={`w-4 h-4 ml-1 transform ${expandedGroup === baseTitle ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        
                        {expandedGroup === baseTitle && (
                          <div className="mt-4 space-y-4 border-t pt-4">
                            {filteredGroup.map(groupItem => (
                              <ContentCard key={groupItem.id} content={groupItem} />
                            ))}
                          </div>
                        )}
                        
                        {expandedGroup !== baseTitle && (
                          <ContentCard content={filteredGroup[0]} />
                        )}
                      </>
                    ) : (
                      <ContentCard content={filteredGroup[0]} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Materials;