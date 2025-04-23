// src/LMSComponents/LMSNavbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';

const LMSNavbar = ({ user, userData, isAdmin }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/lms/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Cloudinary upload widget handler
  const openCloudinaryWidget = () => {
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
            setIsUploadModalOpen(false);
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
                  className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full transition-colors"
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
                  type="button"
                  className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-purple-600 focus:ring-white"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <span className="sr-only">Open user menu</span>
                  <div className="h-8 w-8 rounded-full bg-yellow-300 flex items-center justify-center text-blue-600 font-bold">
                    {userData?.name ? userData.name.charAt(0).toUpperCase() : user?.email.charAt(0).toUpperCase()}
                  </div>
                </button>
              </div>

              {isOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                  <div className="px-4 py-2 text-xs text-gray-500">
                    Signed in as
                  </div>
                  <div className="px-4 py-2 text-sm text-gray-700 truncate border-b">
                    {user?.email}
                  </div>
                  <Link
                    to="/lms/profile"
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsOpen(false)}
                  >
                    Your Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign out
                  </button>
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
        <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-2">
            <div className="px-4 py-2 text-sm text-gray-700 border-b">
              Signed in as: {user?.email}
            </div>
            <Link
              to="/lms/home"
              className="block py-2 text-blue-900 font-medium"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/lms/materials"
              className="block py-2 text-blue-900 font-medium"
              onClick={() => setIsOpen(false)}
            >
              Materials
            </Link>

            <Link
              to="/lms/profile"
              className="block py-2 text-blue-900 font-medium"
              onClick={() => setIsOpen(false)}
            >
              Your Profile
            </Link>

            {isAdmin && (
              <>
                <Link
                  to="/lms/admin"
                  className="block py-2 text-blue-900 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Admin
                </Link>

                <div className="flex space-x-2 mt-2 mb-2">
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      navigate("/lms/create-user");
                    }}
                    className="bg-yellow-400 text-blue-900 px-3 py-1 rounded-md hover:bg-yellow-500 transition"
                  >
                    Add User
                  </button>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      openCloudinaryWidget();
                    }}
                    className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition flex items-center"
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
              onClick={handleLogout}
              className="block w-full text-left py-2 text-blue-900 font-medium"
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