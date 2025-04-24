import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, onValue } from 'firebase/database';
import { auth, database } from '../firebase/config';
import { useNavigate } from 'react-router-dom';
import ContentCard from './ContentCard';
import { 
  FaSearch, FaFilter, FaFilePdf, FaFileWord, FaFilePowerpoint, 
  FaImage, FaVideo, FaChevronDown, FaUser, FaCalendarAlt 
} from 'react-icons/fa';

const Materials = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [batches, setBatches] = useState({});
  const [expandedBatches, setExpandedBatches] = useState({});
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Format date for display
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown Date';
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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
            
            // Group content by uploadBatch or uploadedAt timestamp
            const batchGroups = {};
            
            contentList.forEach(item => {
              // Use batchId if available, otherwise use uploadedAt timestamp
              const batchKey = item.batchId || item.uploadedAt || item.createdAt || 'unknown';
              
              if (!batchGroups[batchKey]) {
                batchGroups[batchKey] = {
                  items: [],
                  timestamp: item.uploadedAt || item.createdAt || null,
                  title: item.batchTitle || null // Custom batch title if available
                };
              }
              batchGroups[batchKey].items.push(item);
            });
            
            // Sort batches by timestamp (newest first)
            const sortedBatches = Object.entries(batchGroups)
              .sort(([, batchA], [, batchB]) => {
                const timestampA = batchA.timestamp || 0;
                const timestampB = batchB.timestamp || 0;
                return timestampB - timestampA;
              })
              .reduce((acc, [key, value]) => {
                acc[key] = value;
                return acc;
              }, {});
            
            setContent(contentList);
            setBatches(sortedBatches);
            
            // Auto-expand the newest batch
            if (Object.keys(sortedBatches).length > 0) {
              const newestBatchKey = Object.keys(sortedBatches)[0];
              setExpandedBatches({ [newestBatchKey]: true });
            }
          } else {
            // Set empty content array if no content exists
            setContent([]);
            setBatches({});
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
    
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (userDropdownOpen && !event.target.closest('.user-dropdown')) {
        setUserDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      unsubscribe();
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [navigate, userDropdownOpen]);

  // Filter content based on selected type and search term
  const filteredBatches = Object.fromEntries(
    Object.entries(batches).map(([batchId, batchData]) => {
      const filteredItems = batchData.items.filter(item => {
        const contentTypeMatch = filter === 'all' || item.contentType === filter;
        const searchMatch = !searchTerm || 
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
          (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
        
        return contentTypeMatch && searchMatch;
      });
      
      return [batchId, { ...batchData, items: filteredItems }];
    }).filter(([_, batchData]) => batchData.items.length > 0)
  );

  const toggleBatch = (batchId) => {
    setExpandedBatches(prev => ({
      ...prev,
      [batchId]: !prev[batchId]
    }));
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

  const handleLogout = () => {
    auth.signOut()
      .then(() => {
        navigate('/lms/login');
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  const handleProfileClick = () => {
    navigate('/lms/profile');
    setUserDropdownOpen(false);
  };

  // Skeleton loader component
  const SkeletonLoader = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>
          
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="h-10 bg-gray-200 rounded w-full md:w-3/4"></div>
            <div className="h-10 bg-gray-200 rounded w-full md:w-1/4"></div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-10 bg-gray-200 rounded-full w-24 animate-pulse"></div>
          ))}
        </div>
        
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden mb-6 animate-pulse">
            <div className="p-4 bg-gray-50 border-b">
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map(j => (
                  <div key={j} className="h-48 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (loading) {
    return <SkeletonLoader />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* User dropdown in header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-blue-600">Learning Management System</h1>
          
          {/* User dropdown menu */}
          <div className="relative user-dropdown">
            <button 
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors duration-200"
            >
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                {userData?.name ? userData.name.charAt(0).toUpperCase() : <FaUser />}
              </div>
              <span className="font-medium">{userData?.name || user?.email || 'User'}</span>
              <FaChevronDown className={`text-gray-500 transition-transform duration-200 ${userDropdownOpen ? 'transform rotate-180' : ''}`} />
            </button>
            
            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10">
                <div className="px-4 py-2 border-b">
                  <p className="text-sm font-medium">{userData?.name || 'User'}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
                <button 
                  onClick={handleProfileClick}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </button>
                {userData?.role === 'admin' && (
                  <button 
                    onClick={() => navigate('/lms/admin')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Admin Dashboard
                  </button>
                )}
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

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
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
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
                className="appearance-none bg-white border border-gray-300 rounded-lg py-2 pl-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
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
            className={`px-4 py-2 rounded-full flex items-center transition-colors duration-200 ${filter === 'all' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-700 border hover:bg-gray-50'}`}
          >
            All Materials
          </button>
          <button 
            onClick={() => setFilter('pdf')}
            className={`px-4 py-2 rounded-full flex items-center transition-colors duration-200 ${filter === 'pdf' ? 'bg-red-600 text-white shadow-md' : 'bg-white text-gray-700 border hover:bg-gray-50'}`}
          >
            {getFilterIcon('pdf')} PDFs
          </button>
          <button 
            onClick={() => setFilter('word')}
            className={`px-4 py-2 rounded-full flex items-center transition-colors duration-200 ${filter === 'word' ? 'bg-blue-700 text-white shadow-md' : 'bg-white text-gray-700 border hover:bg-gray-50'}`}
          >
            {getFilterIcon('word')} Documents
          </button>
          <button 
            onClick={() => setFilter('ppt')}
            className={`px-4 py-2 rounded-full flex items-center transition-colors duration-200 ${filter === 'ppt' ? 'bg-orange-600 text-white shadow-md' : 'bg-white text-gray-700 border hover:bg-gray-50'}`}
          >
            {getFilterIcon('ppt')} Presentations
          </button>
          <button 
            onClick={() => setFilter('video')}
            className={`px-4 py-2 rounded-full flex items-center transition-colors duration-200 ${filter === 'video' ? 'bg-purple-600 text-white shadow-md' : 'bg-white text-gray-700 border hover:bg-gray-50'}`}
          >
            {getFilterIcon('video')} Videos
          </button>
          <button 
            onClick={() => setFilter('image')}
            className={`px-4 py-2 rounded-full flex items-center transition-colors duration-200 ${filter === 'image' ? 'bg-green-600 text-white shadow-md' : 'bg-white text-gray-700 border hover:bg-gray-50'}`}
          >
            {getFilterIcon('image')} Images
          </button>
        </div>
        
        {Object.keys(filteredBatches).length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-600">No {filter !== 'all' ? filter : ''} materials available{searchTerm ? ' matching your search' : ''}.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(filteredBatches).map(([batchId, batchData]) => {
              const batchTitle = batchData.title || `Uploaded on ${formatDate(batchData.timestamp)}`;
              const itemCount = batchData.items.length;
              
              return (
                <div key={batchId} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div 
                    className="p-4 bg-gradient-to-r from-gray-50 to-white border-b cursor-pointer flex justify-between items-center"
                    onClick={() => toggleBatch(batchId)}
                  >
                    <div className="flex items-center">
                      <FaCalendarAlt className="text-blue-600 mr-2" />
                      <h3 className="text-lg font-semibold text-gray-800">{batchTitle}</h3>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-500 mr-2">{itemCount} item{itemCount !== 1 ? 's' : ''}</span>
                      <FaChevronDown className={`text-gray-500 transition-transform duration-200 ${expandedBatches[batchId] ? 'transform rotate-180' : ''}`} />
                    </div>
                  </div>
                  
                  {expandedBatches[batchId] && (
                    <div className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {batchData.items.map(item => (
                          <ContentCard 
                            key={item.id} 
                            content={item}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {!expandedBatches[batchId] && batchData.items.length > 0 && (
                    <div className="p-4 border-t border-gray-100">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ContentCard 
                          content={batchData.items[0]}
                        />
                        {batchData.items.length > 1 && batchData.items.length <= 2 && (
                          <ContentCard 
                            content={batchData.items[1]}
                          />
                        )}
                      </div>
                      {batchData.items.length > 2 && (
                        <div className="mt-4 text-center">
                          <button 
                            onClick={() => toggleBatch(batchId)}
                            className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg font-medium transition-colors duration-200"
                          >
                            Show {batchData.items.length - 2} more item{batchData.items.length - 2 !== 1 ? 's' : ''}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
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