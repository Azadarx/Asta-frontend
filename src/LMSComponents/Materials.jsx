import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, onValue } from 'firebase/database';
import { auth, database } from '../firebase/config';
import { useNavigate } from 'react-router-dom';
import ContentCard from './ContentCard';
import {
  FaSearch, FaFilter, FaFilePdf, FaFileWord, FaFilePowerpoint,
  FaImage, FaVideo, FaChevronDown, FaUser, FaCalendarAlt,
  FaLayerGroup, FaFolder, FaFolderOpen, FaTimes, FaBars
} from 'react-icons/fa';

const Materials = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [groupedContent, setGroupedContent] = useState({});
  const [expandedGroups, setExpandedGroups] = useState({});
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [view, setView] = useState('grid'); // 'grid' or 'list'
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
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

  // Get date timestamp for filtering (today, this week, this month)
  const getDateThreshold = (filter) => {
    const now = new Date();
    switch (filter) {
      case 'today':
        now.setHours(0, 0, 0, 0);
        return now.getTime();
      case 'week':
        now.setDate(now.getDate() - 7);
        return now.getTime();
      case 'month':
        now.setMonth(now.getMonth() - 1);
        return now.getTime();
      default:
        return 0;
    }
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

            // Group content by uploadSessionId or other grouping identifier
            const groups = {};

            contentList.forEach(item => {
              // Use uploadSessionId as the primary grouping key
              const groupKey = item.uploadSessionId || item.batchId || 'ungrouped';

              if (!groups[groupKey]) {
                groups[groupKey] = {
                  items: [],
                  timestamp: item.createdAt || item.uploadedAt || null,
                  groupName: item.groupName || (groupKey === 'ungrouped' ? 'Ungrouped Content' : 'Content Group'),
                  // Extract unique group title if all items share the same title base
                  groupTitle: item.title ? item.title.split(' - ')[0] : null
                };
              }

              // Update group title if we have better info
              if (item.groupName && !groups[groupKey].groupName) {
                groups[groupKey].groupName = item.groupName;
              }

              groups[groupKey].items.push(item);
            });

            // For each group, find the most common title prefix if groupTitle is not set
            Object.keys(groups).forEach(key => {
              if (!groups[key].groupTitle && groups[key].items.length > 1) {
                // Try to find common title prefix
                const titles = groups[key].items.map(item => item.title);
                const commonPrefix = findCommonPrefix(titles);
                if (commonPrefix && commonPrefix.length > 5) {
                  groups[key].groupTitle = commonPrefix.trim();
                }
              }

              // Sort items within each group by date
              groups[key].items.sort((a, b) => {
                const dateA = new Date(a.createdAt || a.uploadedAt || 0);
                const dateB = new Date(b.createdAt || b.uploadedAt || 0);
                return dateB - dateA;
              });
            });

            // Sort groups by timestamp (newest first)
            const sortedGroups = Object.entries(groups)
              .sort(([, groupA], [, groupB]) => {
                const timestampA = new Date(groupA.timestamp || 0).getTime();
                const timestampB = new Date(groupB.timestamp || 0).getTime();
                return timestampB - timestampA;
              })
              .reduce((acc, [key, value]) => {
                acc[key] = value;
                return acc;
              }, {});

            setContent(contentList);
            setGroupedContent(sortedGroups);

            // Auto-expand the newest group
            if (Object.keys(sortedGroups).length > 0) {
              const newestGroupKey = Object.keys(sortedGroups)[0];
              setExpandedGroups({ [newestGroupKey]: true });
            }
          } else {
            setContent([]);
            setGroupedContent({});
          }
          setLoading(false);
        }, (error) => {
          console.error("Error fetching content:", error);
          setLoading(false);
        });
      } else {
        navigate('/lms/login');
      }
    });

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (userDropdownOpen && !event.target.closest('.user-dropdown')) {
        setUserDropdownOpen(false);
      }

      // Close mobile filters when clicking outside
      if (mobileFiltersOpen && !event.target.closest('.mobile-filters')) {
        setMobileFiltersOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      unsubscribe();
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [navigate, userDropdownOpen, mobileFiltersOpen]);

  // Find common prefix in an array of strings
  const findCommonPrefix = (strings) => {
    if (!strings.length) return '';
    if (strings.length === 1) return strings[0];

    let prefix = '';
    const firstStr = strings[0];

    for (let i = 0; i < firstStr.length; i++) {
      const char = firstStr[i];
      if (strings.every(str => str[i] === char)) {
        prefix += char;
      } else {
        break;
      }
    }

    return prefix;
  };

  // Filter content based on selected filters and search term
  const getFilteredGroups = () => {
    const dateThreshold = getDateThreshold(dateFilter);

    return Object.entries(groupedContent)
      .map(([groupId, groupData]) => {
        const filteredItems = groupData.items.filter(item => {
          // Apply content type filter
          const typeMatch = filter === 'all' ||
            (item.fileCategory === filter) ||
            (item.fileType && item.fileType.includes(filter)) ||
            (item.contentType === filter);

          // Apply category filter
          const categoryMatch = categoryFilter === 'all' || item.category === categoryFilter;

          // Apply date filter
          const itemDate = new Date(item.createdAt || item.uploadedAt || 0).getTime();
          const dateMatch = dateFilter === 'all' || itemDate >= dateThreshold;

          // Apply search term
          const searchMatch = !searchTerm ||
            item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));

          return typeMatch && categoryMatch && dateMatch && searchMatch;
        });

        return [groupId, { ...groupData, items: filteredItems }];
      })
      .filter(([_, groupData]) => groupData.items.length > 0)
      .reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});
  };

  const filteredGroups = getFilteredGroups();

  const toggleGroup = (groupId) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId]
    }));
  };

  const expandAllGroups = () => {
    const allExpanded = {};
    Object.keys(filteredGroups).forEach(groupId => {
      allExpanded[groupId] = true;
    });
    setExpandedGroups(allExpanded);
  };

  const collapseAllGroups = () => {
    setExpandedGroups({});
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const getFilterIcon = (filterType) => {
    switch (filterType) {
      case 'pdf': return <FaFilePdf />;
      case 'word': case 'doc': case 'docx': return <FaFileWord />;
      case 'ppt': case 'pptx': return <FaFilePowerpoint />;
      case 'image': case 'jpg': case 'jpeg': case 'png': return <FaImage />;
      case 'video': case 'mp4': return <FaVideo />;
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

  // Check if we have any results after filtering
  const hasFilteredResults = Object.keys(filteredGroups).length > 0;

  // Skeleton loader for better UX during loading
  const SkeletonLoader = () => (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>

          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="h-10 bg-gray-200 rounded-lg w-full md:w-3/4"></div>
            <div className="h-10 bg-gray-200 rounded-lg w-full md:w-1/4"></div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-10 bg-gray-200 rounded-full w-24 animate-pulse"></div>
          ))}
        </div>

        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden mb-6 animate-pulse">
            <div className="p-4 bg-gray-50 border-b">
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(j => (
                  <div key={j} className="h-56 bg-gray-200 rounded-lg"></div>
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
    <div className="min-h-screen bg-gray-50">
      {/* Modern navbar with user profile */}
      <div className="bg-white shadow-sm sticky top-0 z-30">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <button
                onClick={toggleSidebar}
                className="mr-3 p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
                aria-label="Toggle filters"
              >
                <FaBars className="text-gray-600" />
              </button>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
                Learning Hub
              </h1>
            </div>

            {/* Search bar */}
            <div className="hidden md:block relative flex-grow max-w-2xl mx-6">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-blue-500 transition-all duration-200"
                placeholder="Search materials..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* User dropdown menu */}
            <div className="relative user-dropdown flex items-center">
              <button
                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                className="md:hidden mr-4 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Mobile search and filters"
              >
                <FaSearch className="text-gray-600" />
              </button>

              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors duration-200"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-sm">
                  {userData?.name ? userData.name.charAt(0).toUpperCase() : <FaUser />}
                </div>
                <span className="font-medium hidden sm:inline-block">{userData?.name || user?.email?.split('@')[0] || 'User'}</span>
                <FaChevronDown className={`text-gray-500 transition-transform duration-200 ${userDropdownOpen ? 'transform rotate-180' : ''}`} />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg py-1 z-10 border border-gray-100">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold">{userData?.name || 'User'}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>
                  <button
                    onClick={handleProfileClick}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Profile Settings
                  </button>
                  {userData?.role === 'admin' && (
                    <button
                      onClick={() => navigate('/lms/admin')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Admin Dashboard
                    </button>
                  )}
                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile search and filters overlay */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden">
          <div className="bg-white p-4 max-w-sm ml-auto h-full overflow-y-auto mobile-filters">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Filters & Search</h2>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <FaTimes />
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-blue-500"
                  placeholder="Search materials..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                  >
                    <FaTimes className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-6">
              {/* Content Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
                <div className="space-y-2">
                  {[
                    { value: 'all', label: 'All Types', icon: null },
                    { value: 'pdf', label: 'PDFs', icon: <FaFilePdf className="mr-2 text-red-500" /> },
                    { value: 'word', label: 'Documents', icon: <FaFileWord className="mr-2 text-blue-500" /> },
                    { value: 'ppt', label: 'Presentations', icon: <FaFilePowerpoint className="mr-2 text-orange-500" /> },
                    { value: 'video', label: 'Videos', icon: <FaVideo className="mr-2 text-purple-500" /> },
                    { value: 'image', label: 'Images', icon: <FaImage className="mr-2 text-green-500" /> }
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setFilter(option.value);
                        setMobileFiltersOpen(false);
                      }}
                      className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors ${filter === option.value
                          ? 'bg-blue-50 text-blue-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                      {option.icon}
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <div className="space-y-2">
                  {[
                    { value: 'all', label: 'All Categories' },
                    { value: 'beginner', label: 'Beginner' },
                    { value: 'intermediate', label: 'Intermediate' },
                    { value: 'advanced', label: 'Advanced' },
                    { value: 'general', label: 'General' }
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setCategoryFilter(option.value);
                        setMobileFiltersOpen(false);
                      }}
                      className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors ${categoryFilter === option.value
                          ? 'bg-blue-50 text-blue-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Added</label>
                <div className="space-y-2">
                  {[
                    { value: 'all', label: 'All Time' },
                    { value: 'today', label: 'Today' },
                    { value: 'week', label: 'This Week' },
                    { value: 'month', label: 'This Month' }
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setDateFilter(option.value);
                        setMobileFiltersOpen(false);
                      }}
                      className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors ${dateFilter === option.value
                          ? 'bg-blue-50 text-blue-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto py-8 px-4">
        <div className="flex">
          {/* Sidebar filters - desktop */}
          <div className={`hidden lg:block w-64 mr-8 transition-all duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 w-0 mr-0'}`}>
            <div className="bg-white rounded-xl shadow-sm p-4 sticky top-20">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Filters</h2>

              {/* Content Type Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Content Type</h3>
                <div className="space-y-2">
                  {[
                    { value: 'all', label: 'All Types', icon: null },
                    { value: 'pdf', label: 'PDFs', icon: <FaFilePdf className="mr-2 text-red-500" /> },
                    { value: 'word', label: 'Documents', icon: <FaFileWord className="mr-2 text-blue-500" /> },
                    { value: 'ppt', label: 'Presentations', icon: <FaFilePowerpoint className="mr-2 text-orange-500" /> },
                    { value: 'video', label: 'Videos', icon: <FaVideo className="mr-2 text-purple-500" /> },
                    { value: 'image', label: 'Images', icon: <FaImage className="mr-2 text-green-500" /> }
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => setFilter(option.value)}
                      className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors ${filter === option.value
                          ? 'bg-blue-50 text-blue-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                      {option.icon}
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Category</h3>
                <div className="space-y-2">
                  {[
                    { value: 'all', label: 'All Categories' },
                    { value: 'beginner', label: 'Beginner' },
                    { value: 'intermediate', label: 'Intermediate' },
                    { value: 'advanced', label: 'Advanced' },
                    { value: 'general', label: 'General' }
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => setCategoryFilter(option.value)}
                      className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors ${categoryFilter === option.value
                          ? 'bg-blue-50 text-blue-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Date Added</h3>
                <div className="space-y-2">
                  {[
                    { value: 'all', label: 'All Time' },
                    { value: 'today', label: 'Today' },
                    { value: 'week', label: 'This Week' },
                    { value: 'month', label: 'This Month' }
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => setDateFilter(option.value)}
                      className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors ${dateFilter === option.value
                          ? 'bg-blue-50 text-blue-700 font-medium'
                          : 'text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-grow">
            {/* Page Header */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 mb-2">Learning Materials</h1>
                  <p className="text-gray-600">
                    Browse through all available learning resources organized by groups
                  </p>
                </div>

                {/* View toggles and expand/collapse controls */}
                <div className="flex items-center space-x-2 mt-4 md:mt-0">
                  <button
                    onClick={expandAllGroups}
                    className="px-3 py-1.5 bg-blue-50 text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    Expand All
                  </button>
                  <button
                    onClick={collapseAllGroups}
                    className="px-3 py-1.5 bg-gray-100 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Collapse All
                  </button>
                  <div className="h-6 w-px bg-gray-300 mx-2"></div>
                  <button
                    onClick={() => setView('grid')}
                    className={`p-1.5 rounded-lg ${view === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
                    title="Grid View"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setView('list')}
                    className={`p-1.5 rounded-lg ${view === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
                    title="List View"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Mobile search bar */}
              <div className="block lg:hidden relative mt-4">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-blue-500"
                  placeholder="Search materials..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                  >
                    <FaTimes className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Filter pills - Mobile and tablet */}
            <div className="lg:hidden flex flex-wrap gap-2 mb-6">
              {/* Content Type Filter Pills */}
              <div
                className={`flex items-center px-3 py-1.5 rounded-full text-sm font-medium cursor-pointer transition-colors ${filter === 'all' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                onClick={() => setFilter('all')}
              >
                <FaFilter className="mr-1.5 text-xs" /> All Types
              </div>
              <div
                className={`flex items-center px-3 py-1.5 rounded-full text-sm font-medium cursor-pointer transition-colors ${filter === 'pdf' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                onClick={() => setFilter('pdf')}
              >
                <FaFilePdf className="mr-1.5" /> PDFs
              </div>
              <div
                className={`flex items-center px-3 py-1.5 rounded-full text-sm font-medium cursor-pointer transition-colors ${filter === 'word' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                onClick={() => setFilter('word')}
              >
                <FaFileWord className="mr-1.5" /> Docs
              </div>
              <div
                className={`flex items-center px-3 py-1.5 rounded-full text-sm font-medium cursor-pointer transition-colors ${filter === 'ppt' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                onClick={() => setFilter('ppt')}
              >
                <FaFilePowerpoint className="mr-1.5" /> Slides
              </div>
              <div
                className={`flex items-center px-3 py-1.5 rounded-full text-sm font-medium cursor-pointer transition-colors ${filter === 'video' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                onClick={() => setFilter('video')}
              >
                <FaVideo className="mr-1.5" /> Videos
              </div>

              {/* More filters button */}
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              >
                <FaFilter className="mr-1.5" /> More Filters
              </button>
            </div>

            {/* Active filters summary */}
            {(filter !== 'all' || categoryFilter !== 'all' || dateFilter !== 'all' || searchTerm) && (
              <div className="flex flex-wrap items-center gap-2 mb-6 bg-blue-50 p-3 rounded-lg">
                <span className="text-sm text-blue-700 font-medium">Active Filters:</span>

                {filter !== 'all' && (
                  <div className="inline-flex items-center px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-700 shadow-sm">
                    Type: {filter.charAt(0).toUpperCase() + filter.slice(1)}
                    <button
                      onClick={() => setFilter('all')}
                      className="ml-1 text-gray-400 hover:text-gray-600"
                    >
                      <FaTimes className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {categoryFilter !== 'all' && (
                  <div className="inline-flex items-center px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-700 shadow-sm">
                    Category: {categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1)}
                    <button
                      onClick={() => setCategoryFilter('all')}
                      className="ml-1 text-gray-400 hover:text-gray-600"
                    >
                      <FaTimes className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {dateFilter !== 'all' && (
                  <div className="inline-flex items-center px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-700 shadow-sm">
                    Date: {dateFilter === 'today' ? 'Today' : dateFilter === 'week' ? 'This Week' : 'This Month'}
                    <button
                      onClick={() => setDateFilter('all')}
                      className="ml-1 text-gray-400 hover:text-gray-600"
                    >
                      <FaTimes className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {searchTerm && (
                  <div className="inline-flex items-center px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-700 shadow-sm">
                    Search: "{searchTerm}"
                    <button
                      onClick={() => setSearchTerm('')}
                      className="ml-1 text-gray-400 hover:text-gray-600"
                    >
                      <FaTimes className="w-3 h-3" />
                    </button>
                  </div>
                )}

                <button
                  onClick={() => {
                    setFilter('all');
                    setCategoryFilter('all');
                    setDateFilter('all');
                    setSearchTerm('');
                  }}
                  className="ml-auto text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Content groups */}
            {hasFilteredResults ? (
              <div className="space-y-6">
                {Object.entries(filteredGroups).map(([groupId, groupData]) => (
                  <div key={groupId} className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
                    {/* Group header */}
                    <div
                      className={`p-4 flex items-center justify-between cursor-pointer transition-colors ${expandedGroups[groupId] ? 'bg-blue-50 border-b border-blue-100' : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                      onClick={() => toggleGroup(groupId)}
                    >
                      <div className="flex items-center">
                        {expandedGroups[groupId] ? (
                          <FaFolderOpen className="text-blue-500 mr-3" />
                        ) : (
                          <FaFolder className="text-blue-400 mr-3" />
                        )}
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {groupData.groupTitle || groupData.groupName || `Content Group ${groupId.substring(0, 6)}`}
                          </h3>
                          <p className="text-sm text-gray-500 mt-0.5">
                            <FaCalendarAlt className="inline-block mr-1 text-xs" />
                            {formatDate(groupData.timestamp)} • {groupData.items.length} items
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <div className="flex -space-x-2">
                          {[...new Set(groupData.items.map(item => item.fileCategory || item.contentType))]
                            .slice(0, 3)
                            .map((type, idx) => {
                              const icon = getFilterIcon(type);
                              return icon ? (
                                <div key={idx} className="w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center">
                                  {React.cloneElement(icon, { className: 'w-3.5 h-3.5' })}
                                </div>
                              ) : null;
                            })}
                        </div>
                        <FaChevronDown className={`text-gray-400 transition-transform duration-300 ${expandedGroups[groupId] ? 'transform rotate-180' : ''}`} />
                      </div>
                    </div>

                    {/* Group content */}
                    {expandedGroups[groupId] && (
                      <div className="p-4 lg:p-6 animate-fadeIn">
                        {/* Group description if available */}
                        {groupData.description && (
                          <div className="mb-4 text-gray-600 text-sm">
                            {groupData.description}
                          </div>
                        )}

                        {/* Items grid or list */}
                        {view === 'grid' ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {groupData.items.map(item => (
                              <ContentCard
                                key={item.id}
                                item={item}
                                userData={userData}
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="divide-y divide-gray-100">
                            {groupData.items.map(item => (
                              <div
                                key={item.id}
                                className="py-3 flex items-center hover:bg-gray-50 rounded-lg px-2 cursor-pointer transition-colors"
                                onClick={() => navigate(`/lms/content/${item.id}`)}
                              >
                                <div className="mr-3">
                                  {getFilterIcon(item.fileCategory || item.contentType) || <FaLayerGroup className="text-gray-400" />}
                                </div>
                                <div className="flex-grow min-w-0">
                                  <h4 className="text-gray-900 font-medium truncate">{item.title}</h4>
                                  <p className="text-sm text-gray-500">
                                    {formatDate(item.createdAt || item.uploadedAt)} • {item.fileSize && `${item.fileSize} • `}
                                    {item.category && <span className="capitalize">{item.category}</span>}
                                  </p>
                                </div>
                                <div className="ml-2 flex-shrink-0">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {item.fileCategory || item.contentType || 'Content'}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                <div className="flex flex-col items-center max-w-md mx-auto">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <FaSearch className="text-gray-400 text-xl" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                  <p className="text-gray-600 mb-4">
                    We couldn't find any learning materials matching your current filters. Try adjusting your filters or search terms.
                  </p>
                  <button
                    onClick={() => {
                      setFilter('all');
                      setCategoryFilter('all');
                      setDateFilter('all');
                      setSearchTerm('');
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CSS Animation Keyframes */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Materials;