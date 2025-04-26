import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';

const LMSNavbar = ({ user, userData, isAdmin }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsOpen(false); // Close the menu before navigating
      navigate('/lms/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Close dropdown when clicking outside
  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (
  //       dropdownRef.current && 
  //       !dropdownRef.current.contains(event.target) &&
  //       buttonRef.current && 
  //       !buttonRef.current.contains(event.target)
  //     ) {
  //       setIsOpen(false);
  //     }
  //   };

  //   document.addEventListener('mousedown', handleClickOutside);
  //   return () => {
  //     document.removeEventListener('mousedown', handleClickOutside);
  //   };
  // }, []);

  // Close mobile menu on route change
  useEffect(() => {
    return () => {
      setIsOpen(false);
    };
  }, [navigate]);

  // Improved function to handle navigation - no delay needed
  const handleMobileNavigation = (e, path) => {
    e.preventDefault();
    setIsOpen(false);
  setTimeout(() => {
    navigate(path);
  }, 10); // Small delay

  };

  // Cloudinary upload widget handler
  const openCloudinaryWidget = () => {
    console.log('openCloudinaryWidget====');
    if (window.cloudinary) {
      const widget = window.cloudinary.createUploadWidget(
        {
          cloudName: 'your-cloud-name', // Replace with your Cloudinary cloud name
          uploadPreset: 'lms-materials', // Replace with your upload preset
          folder: 'lms-content',
          sources: ['local', 'url', 'camera', 'google_drive', 'dropbox'],
          multiple: true,
          maxFiles: 10,
        },
        (error, result) => {
          if (!error && result && result.event === 'success') {
            console.log('Upload successful:', result.info);
            // You can add additional logic here to save the uploaded file info to your database
          }
          if (error) {
            console.error('Upload error:', error);
          }
        }
      );
      widget.open();
    } else {
      console.error('Cloudinary widget not available');
      alert('Upload functionality is not available at the moment. Please try again later.');
    }
  };

  console.log(isOpen, 'LMSNavbar====')
  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-md">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-3xl font-bold text-white">Asta</span>
              <span className="text-3xl font-medium text-yellow-300">LMS</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/lms/home" className="text-white font-medium hover:text-yellow-300 transition-colors">
              Home
            </Link>
            <Link to="/lms/materials" className="text-white font-medium hover:text-yellow-300 transition-colors">
              Materials
            </Link>

            {isAdmin && (
              <>
                <Link
                  to="/lms/admin"
                  className="text-white font-medium hover:text-yellow-300 transition-colors flex items-center"
                >
                  Admin
                </Link>

                <Link
                  to="/lms/create-user"
                  className="text-white font-medium hover:text-yellow-300 transition-colors"
                >
                  Add User
                </Link>

                <button
                  onClick={openCloudinaryWidget}
                  className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full transition-colors shadow-lg"
                  title="Add Content"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </>
            )}

            <div className="relative ml-3">
              <div>
                <button
                  ref={buttonRef}
                  type="button"
                  className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-purple-600 focus:ring-white transition-transform hover:scale-105"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <span className="sr-only">Open user menu</span>
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-yellow-300 to-yellow-400 flex items-center justify-center text-blue-700 font-bold shadow-md border-2 border-white">
                    {userData?.name ? userData.name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase()}
                  </div>
                </button>
              </div>

              {isOpen && (
                <div 
                  ref={dropdownRef}
                  className="origin-top-right absolute right-0 mt-3 w-56 rounded-lg shadow-xl bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10 overflow-hidden transform transition-all duration-200 ease-in-out"
                >
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 text-white">
                    <p className="text-xs font-medium uppercase tracking-wider">Signed in as</p>
                    <p className="text-sm font-medium truncate">{user?.email}</p>
                  </div>
                  <div className="py-1">
                    <Link
                      to="/lms/profile"
                      className="flex items-center w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => {
                        console.log('profile==')
                        setIsOpen(false)
                      }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Your Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-yellow-300 focus:outline-none"
            >
              {isOpen ? (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t shadow-lg">
          <div className="container mx-auto px-4 py-2">
            <div className="px-4 py-2 text-sm text-gray-700 border-b">
              Signed in as: {user?.email}
            </div>
            
            {/* Fixed mobile navigation links */}
            <button 
              className="block w-full text-left py-2 text-blue-900 font-medium cursor-pointer hover:bg-blue-50"
              // to={"/lms/home"}
              onClick={(e) => handleMobileNavigation(e, '/lms/home')}
            >
              Home
            </button>
            
            <button 
              className="block w-full text-left py-2 text-blue-900 font-medium cursor-pointer hover:bg-blue-50"
              // to={"/lms/materials"}
              onClick={(e) => {
                console.log('materials==')
                handleMobileNavigation(e, '/lms/materials')
              }}
            >
              Materials
            </button>
            
            <Link 
              className="block w-full text-left py-2 text-blue-900 font-medium cursor-pointer hover:bg-blue-50"
              to={"/lms/profile"}
              // onClick={() => handleMobileNavigation('/lms/profile')}
            >
              Your Profile
            </Link>

            {isAdmin && (
              <>
                <Link 
                  className="block w-full text-left py-2 text-blue-900 font-medium cursor-pointer hover:bg-blue-50"
                  to={"/lms/admin"}
                  // onClick={() => handleMobileNavigation('/lms/admin')}
                >
                  Admin
                </Link>

                <div className="flex space-x-2 mt-2 mb-2">
                  <Link
                    // onClick={() => handleMobileNavigation('/lms/create-user')}
                    to={"/lms/create-user"}
                    className="bg-yellow-400 text-blue-900 px-3 py-1 rounded-md hover:bg-yellow-500 transition shadow-md inline-block"
                  >
                    Add User
                  </Link>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      openCloudinaryWidget();
                    }}
                    className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition flex items-center shadow-md"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Add Content
                  </button>
                </div>
              </>
            )}

            <button 
              className="block w-full text-left py-2 text-red-600 font-medium cursor-pointer hover:bg-red-50"
              onClick={handleLogout}
            >
              Sign out
            </button>
          </div>
        </div>
      )}

      {/* Cloudinary Script - Add this to your index.html or load it conditionally */}
      {isAdmin && (
        <script
          src="https://widget.cloudinary.com/v2.0/global/all.js"
          type="text/javascript"
        />
      )}
    </nav>
  );
};

export default LMSNavbar;