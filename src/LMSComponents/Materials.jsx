import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, onValue } from 'firebase/database';
import { auth, database } from '../firebase/config';
import { useNavigate } from 'react-router-dom';
import ContentCard from './ContentCard';
import { FaSearch, FaFilter, FaFilePdf, FaFileWord, FaFilePowerpoint, FaImage, FaVideo, FaChevronDown } from 'react-icons/fa';

const Materials = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState({});
  const [expandedCategories, setExpandedCategories] = useState({});
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
            
            // Group content by category
            const groups = {};
            contentList.forEach(item => {
              // Extract the main title without potential numbering or parts
              const baseTitle = item.title.replace(/\s+\d+$|\s+part\s+\d+$|\s+\(\d+\)$/i, '').trim();
              
              if (!groups[baseTitle]) {
                groups[baseTitle] = [];
              }
              groups[baseTitle].push(item);
            });
            
            setCategories(groups);
          } else {
            // Set empty content array if no content exists
            setContent([]);
            setCategories({});
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
  const filteredCategories = Object.fromEntries(
    Object.entries(categories).map(([category, items]) => {
      const filteredItems = items.filter(item => {
        const contentTypeMatch = filter === 'all' || item.contentType === filter;
        const searchMatch = !searchTerm || 
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
          (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
        
        return contentTypeMatch && searchMatch;
      });
      
      return [category, filteredItems];
    }).filter(([_, items]) => items.length > 0)
  );

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const handleDeleteContent = (contentId) => {
    console.log("Deleting content with ID:", contentId);
    // Implement your delete logic here
    // This function would typically call a Firebase function to delete the content
  };

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
    <div className="min-h-screen bg-gray-100">
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
            <div className="relative inline-block">
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
        
        {/* Filter pills */}
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
        
        {Object.keys(filteredCategories).length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-600">No {filter !== 'all' ? filter : ''} materials available{searchTerm ? ' matching your search' : ''}.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(filteredCategories).map(([category, items]) => (
              <div key={category} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div 
                  className="p-4 bg-gray-50 border-b cursor-pointer flex justify-between items-center"
                  onClick={() => toggleCategory(category)}
                >
                  <h3 className="text-lg font-semibold text-gray-800">{category}</h3>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-2">{items.length} item{items.length !== 1 ? 's' : ''}</span>
                    <FaChevronDown className={`text-gray-500 transition-transform ${expandedCategories[category] ? 'transform rotate-180' : ''}`} />
                  </div>
                </div>
                
                {expandedCategories[category] && (
                  <div className="p-4">
                    <div className="space-y-4">
                      {items.map(item => (
                        <ContentCard 
                          key={item.id} 
                          content={item}
                          isAdmin={userData?.role === 'admin'}
                          onDelete={handleDeleteContent}
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                {!expandedCategories[category] && items.length > 0 && (
                  <div className="p-4 border-t border-gray-100">
                    <ContentCard 
                      content={items[0]}
                      isAdmin={userData?.role === 'admin'}
                      onDelete={handleDeleteContent}
                    />
                    {items.length > 1 && (
                      <div className="mt-3 text-center">
                        <button 
                          onClick={() => toggleCategory(category)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Show {items.length - 1} more item{items.length - 1 !== 1 ? 's' : ''}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Materials;