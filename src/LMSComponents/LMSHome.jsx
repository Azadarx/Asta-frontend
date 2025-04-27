// src/LMSComponents/LMSHome.jsx
import React, { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, onValue } from 'firebase/database';
import { auth, database } from '../firebase/config';
import { useNavigate, useLocation } from 'react-router-dom';
import ContentCard from './ContentCard';
import AdminDashboard from './Admin/AdminDashboard';
import { BookOpen, Clock, Bell, Search, Menu } from 'lucide-react';

const LMSHome = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
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
              .filter(item => item) // Make sure item exists
              .sort((a, b) => {
                const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
                const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
                return dateB - dateA;
              });

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

  const filteredContent = content.filter(item => 
    item.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Categories for the content (example)
  const categories = [
    { name: 'Recent', icon: <Clock size={18} /> },
    { name: 'All Materials', icon: <BookOpen size={18} /> },
    { name: 'Favorites', icon: <Bell size={18} /> },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex justify-center items-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
          <p className="mt-4 text-indigo-600 font-medium">Loading your learning portal...</p>
        </div>
      </div>
    );
  }

  if (isAdminPage || isAdmin) {
    return (
      <AdminDashboard user={user} userData={userData} content={content} />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
                  PhonicsLMS
                </span>
              </div>
            </div>
            
            <div className="hidden md:block">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search materials..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-4">
              <div className="relative">
                <Bell size={20} className="text-gray-500 hover:text-indigo-600 cursor-pointer" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                  {userData?.name?.charAt(0) || 'S'}
                </div>
                <span className="ml-2 text-gray-700 font-medium">{userData?.name || 'Student'}</span>
              </div>
            </div>
            
            <div className="md:hidden">
              <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-500">
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-white p-4 shadow-lg">
            <div className="mb-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search materials..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2 mb-2">
              <Bell size={20} className="text-gray-500" />
              <span>Notifications</span>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                {userData?.name?.charAt(0) || 'S'}
              </div>
              <span className="ml-2 text-gray-700 font-medium">{userData?.name || 'Student'}</span>
            </div>
          </div>
        )}
      </nav>

      <div className="container mx-auto py-6 px-4">
        {/* Welcome Banner */}
        <div className="mb-8 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-lg overflow-hidden">
          <div className="md:flex">
            <div className="p-6 md:p-8 md:w-3/4">
              <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {userData?.name || 'Student'}!</h1>
              <p className="text-blue-100 mb-6">
                Continue your phonics journey with interactive lessons and resources tailored just for you.
              </p>
              <div className="flex flex-wrap gap-3">
                <button className="bg-white text-indigo-700 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                  Resume Learning
                </button>
                <button className="bg-blue-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-800 transition-colors">
                  View Progress
                </button>
              </div>
            </div>
            <div className="hidden md:block md:w-1/4 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 bg-blue-400 bg-opacity-30 rounded-full"></div>
                <div className="absolute w-36 h-36 bg-blue-300 bg-opacity-30 rounded-full"></div>
                <BookOpen size={64} className="absolute text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="md:w-1/4">
            <div className="bg-white rounded-xl shadow-md p-5">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Categories</h3>
              <ul>
                {categories.map((category, index) => (
                  <li key={index}>
                    <button 
                      className="w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg hover:bg-indigo-50 transition-colors"
                    >
                      <span className="text-indigo-600">{category.icon}</span>
                      <span className="text-gray-700">{category.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-md p-5 mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">My Progress</h3>
              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Course Completion</span>
                  <span className="text-sm font-medium text-indigo-600">65%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Weekly Goals</span>
                  <span className="text-sm font-medium text-indigo-600">3/5</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="md:w-3/4">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Learning Materials</h2>
                <div className="flex space-x-2">
                  <button className="text-sm bg-indigo-100 text-indigo-700 px-3 py-1 rounded-md hover:bg-indigo-200 transition-colors">
                    Latest
                  </button>
                  <button className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-200 transition-colors">
                    Popular
                  </button>
                </div>
              </div>

              {filteredContent.length === 0 ? (
                <div className="bg-gray-50 rounded-lg p-10 text-center">
                  <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-2">No content available yet.</p>
                  <p className="text-gray-500 text-sm">Check back soon or try a different search term.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredContent.map((item) => (
                    <ContentCard key={item.id} content={item} />
                  ))}
                </div>
              )}
            </div>

            {/* Recent Activity Section */}
            <div className="mt-6 bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <BookOpen size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Completed Lesson: Introduction to Vowel Sounds</h4>
                    <p className="text-sm text-gray-500">Yesterday at 2:30 PM</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <Clock size={20} className="text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Quiz Score: Consonant Blends - 85%</h4>
                    <p className="text-sm text-gray-500">2 days ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LMSHome;