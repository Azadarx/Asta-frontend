import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, onValue, off } from 'firebase/database';
import { auth, database } from '../firebase/config';
import { useNavigate } from 'react-router-dom';
import ContentCard from './ContentCard';
import {
  FaSearch, FaFilter, FaFilePdf, FaFileWord, FaFilePowerpoint,
  FaImage, FaVideo, FaChevronDown, FaUser, FaCalendarAlt,
  FaLayerGroup, FaFolder, FaFolderOpen, FaTimes, FaBars,
  FaChevronRight, FaFile
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

  // Format date for display with safe fallback
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown Date';

    // Safely handle various timestamp formats or return a fallback
    try {
      const date = new Date(timestamp);
      // Check if date is valid before formatting
      if (isNaN(date.getTime())) return 'Unknown Date';

      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error("Date formatting error:", error);
      return 'Unknown Date';
    }
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

  // Safe getter for timestamp from item with fallbacks
  const getItemTimestamp = (item) => {
    if (!item) return null;
    return item.createdAt || item.uploadedAt || item.timestamp || item.date || null;
  };


  // Safe getter for content type with fallbacks
  const getItemType = (item) => {
    return item?.fileCategory || item?.contentType || item?.fileType || 'unknown';
  };

  useEffect(() => {
    let unsubscribeAuth = null;
    let unsubscribeUser = null;
    let unsubscribeContent = null;

    // Set up Firebase auth state listener
    unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // ✅ Fetch user data from RTDB with proper cleanup
        const userRef = ref(database, `users/${currentUser.uid}`);
        unsubscribeUser = onValue(userRef, (snapshot) => {
          if (snapshot.exists()) {
            setUserData(snapshot.val());
          }
        }, (error) => {
          console.error("Error fetching user data:", error);
        });

        // ✅ Fetch and listen to content node with proper cleanup
        const contentRef = ref(database, 'content');
        unsubscribeContent = onValue(contentRef, (snapshot) => {
          if (snapshot.exists()) {
            const contentList = [];
            snapshot.forEach((childSnapshot) => {
              contentList.push({
                id: childSnapshot.key,
                ...childSnapshot.val()
              });
            });

            // ✅ Group content by uploadSessionId / batchId
            const groups = {};

            contentList.forEach(item => {
              const groupKey = item.uploadSessionId || item.batchId || 'ungrouped';

              if (!groups[groupKey]) {
                groups[groupKey] = {
                  items: [],
                  timestamp: getItemTimestamp(item),
                  groupName: item.groupName || (groupKey === 'ungrouped' ? 'Ungrouped Content' : 'Content Group'),
                  groupTitle: item.title ? item.title.split(' - ')[0] : null
                };
              }

              const itemTimestamp = getItemTimestamp(item);
              if (itemTimestamp > groups[groupKey].timestamp) {
                groups[groupKey].timestamp = itemTimestamp;
              }

              if (item.groupName && !groups[groupKey].groupName) {
                groups[groupKey].groupName = item.groupName;
              }

              groups[groupKey].items.push(item);
            });

            // ✅ Find common title prefix if needed
            Object.keys(groups).forEach(key => {
              if (!groups[key].groupTitle && groups[key].items.length > 1) {
                const titles = groups[key].items
                  .map(item => item.title)
                  .filter(title => title && typeof title === 'string');
                if (titles.length > 0) {
                  const commonPrefix = findCommonPrefix(titles);
                  if (commonPrefix && commonPrefix.length > 5) {
                    groups[key].groupTitle = commonPrefix.trim();
                  }
                }
              }

              // ✅ Sort items inside group safely
              groups[key].items.sort((a, b) => {
                const dateA = getItemTimestamp(a) ? new Date(getItemTimestamp(a)).getTime() : 0;
                const dateB = getItemTimestamp(b) ? new Date(getItemTimestamp(b)).getTime() : 0;
                return dateB - dateA;
              });
            });

            // ✅ Sort groups by newest timestamp
            const sortedGroups = Object.entries(groups)
              .sort(([, groupA], [, groupB]) => {
                return (groupB.timestamp || 0) - (groupA.timestamp || 0);
              })
              .reduce((acc, [key, value]) => {
                acc[key] = value;
                return acc;
              }, {});

            // ✅ Set states
            setContent(contentList);
            setGroupedContent(sortedGroups);

            // ✅ Auto-expand newest group - only on initial load
            if (Object.keys(sortedGroups).length > 0 && Object.keys(expandedGroups).length === 0) {
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

    // ✅ Close dropdowns when clicking outside
    const handleClickOutside = (event) => {
      if (userDropdownOpen && !event.target.closest('.user-dropdown')) {
        setUserDropdownOpen(false);
      }

      if (mobileFiltersOpen && !event.target.closest('.mobile-filters')) {
        setMobileFiltersOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    // ✅ Clean up all listeners on component unmount
    return () => {
      if (unsubscribeAuth) unsubscribeAuth();

      // Clean up Firebase RTDB listeners
      if (user?.uid && unsubscribeUser) {
        const userRef = ref(database, `users/${user.uid}`);
        off(userRef);
        unsubscribeUser = null;
      }

      if (unsubscribeContent) {
        const contentRef = ref(database, 'content');
        off(contentRef);
        unsubscribeContent = null;
      }

      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [navigate, userDropdownOpen, mobileFiltersOpen]);

  // Find common prefix in an array of strings with safety checks
  const findCommonPrefix = (strings) => {
    if (!strings || !Array.isArray(strings) || strings.length === 0) return '';
    if (strings.length === 1) return strings[0] || '';

    // Filter out any null or undefined values
    const validStrings = strings.filter(str => typeof str === 'string' && str.length > 0);
    if (validStrings.length === 0) return '';
    if (validStrings.length === 1) return validStrings[0];

    let prefix = '';
    const firstStr = validStrings[0];

    for (let i = 0; i < firstStr.length; i++) {
      const char = firstStr[i];
      if (validStrings.every(str => str[i] === char)) {
        prefix += char;
      } else {
        break;
      }
    }

    return prefix;
  };

  // Filter content based on selected filters and search term with safe handling
  const getFilteredGroups = () => {
    const dateThreshold = getDateThreshold(dateFilter);

    try {
      return Object.entries(groupedContent)
        .map(([groupId, groupData]) => {
          // Ensure items array exists
          const items = groupData.items || [];

          const filteredItems = items.filter(item => {
            if (!item) return false; // Skip null items

            // Apply content type filter
            const typeMatch = filter === 'all' ||
              (getItemType(item) === filter) ||
              (item.fileType && item.fileType.includes && item.fileType.includes(filter));

            // Apply category filter
            const categoryMatch = categoryFilter === 'all' || item.category === categoryFilter;

            // Apply date filter with safe timestamp handling
            const itemDate = getItemTimestamp(item);
            const dateMatch = dateFilter === 'all' || itemDate >= dateThreshold;

            // Apply search term with safe string handling
            const itemTitle = item.title || '';
            const itemDescription = item.description || '';

            const searchMatch = !searchTerm ||
              (typeof itemTitle === 'string' && itemTitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
              (typeof itemDescription === 'string' && itemDescription.toLowerCase().includes(searchTerm.toLowerCase()));

            return typeMatch && categoryMatch && dateMatch && searchMatch;
          });

          return [groupId, { ...groupData, items: filteredItems }];
        })
        .filter(([_, groupData]) => (groupData.items || []).length > 0)
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});
    } catch (error) {
      console.error("Filter error:", error);
      return {}; // Return empty object in case of any error
    }
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
    if (!filterType) return null;

    const type = filterType.toLowerCase();
    switch (type) {
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

              {/* View Toggle */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">View</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setView('grid')}
                    className={`flex-1 py-2 px-3 rounded-lg ${view === 'grid'
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    Grid
                  </button>
                  <button
                    onClick={() => setView('list')}
                    className={`flex-1 py-2 px-3 rounded-lg ${view === 'list'
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    List
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className={`flex-1 transition-all ${!sidebarOpen ? 'pl-0' : ''}`}>
            {/* Mobile filters - horizontal scrolling */}
            <div className="lg:hidden overflow-x-auto whitespace-nowrap mb-4 pb-2 -mx-4 px-4">
              <div className="inline-flex space-x-2">
                {/* Content type filter buttons */}
                {[
                  { value: 'all', label: 'All Types', icon: null },
                  { value: 'pdf', label: 'PDFs', icon: <FaFilePdf className="mr-1" /> },
                  { value: 'word', label: 'Docs', icon: <FaFileWord className="mr-1" /> },
                  { value: 'ppt', label: 'Slides', icon: <FaFilePowerpoint className="mr-1" /> },
                  { value: 'video', label: 'Videos', icon: <FaVideo className="mr-1" /> },
                  { value: 'image', label: 'Images', icon: <FaImage className="mr-1" /> }
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() => setFilter(option.value)}
                    className={`inline-flex items-center px-4 py-2 rounded-full text-sm ${filter === option.value
                      ? 'bg-blue-100 text-blue-700 font-medium border border-blue-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
                      }`}
                  >
                    {option.icon}
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Action buttons and info */}
            <div className="flex flex-wrap justify-between items-center mb-6">
              <div className="mb-3 md:mb-0">
                <h2 className="text-2xl font-bold text-gray-800">Learning Materials</h2>
                <p className="text-gray-500">Access all learning resources</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={expandAllGroups}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium flex items-center"
                >
                  <FaFolderOpen className="mr-2" />
                  Expand All
                </button>
                <button
                  onClick={collapseAllGroups}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium flex items-center"
                >
                  <FaFolder className="mr-2" />
                  Collapse All
                </button>
                <button
                  onClick={() => setView(view === 'grid' ? 'list' : 'grid')}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium flex items-center"
                >
                  <FaLayerGroup className="mr-2" />
                  {view === 'grid' ? 'List View' : 'Grid View'}
                </button>
              </div>
            </div>

            {/* Filter tags/pills - show active filters */}
            {(filter !== 'all' || categoryFilter !== 'all' || dateFilter !== 'all' || searchTerm) && (
              <div className="flex flex-wrap gap-2 mb-6">
                <div className="px-3 py-1 bg-blue-50 text-blue-800 rounded-full text-sm flex items-center">
                  <span className="mr-2">Filters:</span>
                </div>

                {filter !== 'all' && (
                  <div className="px-3 py-1 bg-blue-50 text-blue-800 rounded-full text-sm flex items-center">
                    {getFilterIcon(filter)}
                    <span className="ml-1">{filter.charAt(0).toUpperCase() + filter.slice(1)}</span>
                    <button
                      onClick={() => setFilter('all')}
                      className="ml-2 text-blue-500 hover:text-blue-700"
                    >
                      <FaTimes size={12} />
                    </button>
                  </div>
                )}

                {categoryFilter !== 'all' && (
                  <div className="px-3 py-1 bg-blue-50 text-blue-800 rounded-full text-sm flex items-center">
                    <span>Category: {categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1)}</span>
                    <button
                      onClick={() => setCategoryFilter('all')}
                      className="ml-2 text-blue-500 hover:text-blue-700"
                    >
                      <FaTimes size={12} />
                    </button>
                  </div>
                )}

                {dateFilter !== 'all' && (
                  <div className="px-3 py-1 bg-blue-50 text-blue-800 rounded-full text-sm flex items-center">
                    <FaCalendarAlt className="mr-1" />
                    <span>
                      {dateFilter === 'today' ? 'Today' :
                        dateFilter === 'week' ? 'This Week' :
                          dateFilter === 'month' ? 'This Month' : 'All Time'}
                    </span>
                    <button
                      onClick={() => setDateFilter('all')}
                      className="ml-2 text-blue-500 hover:text-blue-700"
                    >
                      <FaTimes size={12} />
                    </button>
                  </div>
                )}

                {searchTerm && (
                  <div className="px-3 py-1 bg-blue-50 text-blue-800 rounded-full text-sm flex items-center">
                    <FaSearch className="mr-1" />
                    <span>"{searchTerm}"</span>
                    <button
                      onClick={() => setSearchTerm('')}
                      className="ml-2 text-blue-500 hover:text-blue-700"
                    >
                      <FaTimes size={12} />
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
                  className="px-3 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-full text-sm"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* No results message */}
            {!hasFilteredResults && (
              <div className="bg-white rounded-xl shadow-md p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <FaSearch className="text-gray-400 text-xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No materials found</h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  We couldn't find any materials matching your current filters.
                </p>
                <button
                  onClick={() => {
                    setFilter('all');
                    setCategoryFilter('all');
                    setDateFilter('all');
                    setSearchTerm('');
                  }}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Material groups */}
            {Object.entries(filteredGroups).map(([groupId, groupData]) => (
              <div key={groupId} className="mb-6 bg-white rounded-xl shadow-md overflow-hidden">
                {/* Group header */}
                <div className="border-b border-gray-100">
                  <button
                    onClick={() => toggleGroup(groupId)}
                    className="w-full flex justify-between items-center p-4 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="flex items-center">
                      <div className="text-blue-600 mr-3">
                        {expandedGroups[groupId] ? <FaChevronDown /> : <FaChevronRight />}
                      </div>
                      <div className="text-left">
                        <h3 className="font-medium text-gray-900">
                          {groupData.groupTitle || groupData.groupName || 'Content Group'}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {groupData.items.length} {groupData.items.length === 1 ? 'item' : 'items'} • {formatDate(groupData.timestamp)}
                        </p>
                      </div>
                    </div>
                  </button>
                </div>

                {/* Group content */}
                {expandedGroups[groupId] && (
                  <div className="p-4">
                    {view === 'grid' ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {groupData.items.map(item => (
                          <ContentCard key={item.id} item={item} />
                        ))}
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        {groupData.items.map(item => (
                          <div key={item.id} className="py-3 first:pt-0 last:pb-0">
                            <div className="flex items-center">
                              <div className="w-10 h-10 flex-shrink-0 rounded bg-gray-100 flex items-center justify-center mr-4">
                                {getItemType(item) === 'pdf' && <FaFilePdf className="text-red-500" />}
                                {getItemType(item) === 'word' && <FaFileWord className="text-blue-500" />}
                                {getItemType(item) === 'ppt' && <FaFilePowerpoint className="text-orange-500" />}
                                {getItemType(item) === 'image' && <FaImage className="text-green-500" />}
                                {getItemType(item) === 'video' && <FaVideo className="text-purple-500" />}
                                {!['pdf', 'word', 'ppt', 'image', 'video'].includes(getItemType(item)) && <FaFile className="text-gray-500" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-gray-900 truncate">{item.title || 'Untitled'}</h4>
                                <div className="flex items-center text-sm text-gray-500">
                                  <span className="truncate">
                                    {item.description ? (
                                      item.description.length > 60 ?
                                        `${item.description.substring(0, 60)}...` :
                                        item.description
                                    ) : 'No description'}
                                  </span>
                                  <span className="mx-2">•</span>
                                  <span>{formatDate(getItemTimestamp(item))}</span>
                                </div>
                              </div>
                              <a
                                href={item.url || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium"
                              >
                                View
                              </a>
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
        </div>
      </div>
    </div>
  );
};

export default Materials;