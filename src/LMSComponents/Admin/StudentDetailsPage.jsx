// src/LMSComponents/Admin/StudentDetailsPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ref, get } from 'firebase/database';
import { database as rtdb } from '../../firebase/config';

const StudentDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [student, setStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [permissionError, setPermissionError] = useState(false);

  // Check if user is admin
  useEffect(() => {
    if (user && user.email !== 'inspiringshereen@gmail.com') {
      setPermissionError(true);
      setIsLoading(false);
    }
  }, [user]);

  // Fetch student data
  useEffect(() => {
    const fetchStudentData = async () => {
      if (permissionError || !user) return;
      
      setIsLoading(true);
      
      try {
        // First try to get from API
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await fetch(`${API_URL}/api/users/${id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${await user.getIdToken()}`,
          },
          credentials: 'include'
        });
        
        if (response.ok) {
          const studentData = await response.json();
          setStudent(studentData);
          setIsLoading(false);
          return;
        }
        
        // If API fails, try Firebase
        const userRef = ref(rtdb, `users/${id}`);
        const snapshot = await get(userRef);
        
        if (snapshot.exists()) {
          setStudent({
            uid: id,
            ...snapshot.val()
          });
        } else {
          setError('Student not found');
        }
      } catch (err) {
        console.error('Error fetching student data:', err);
        setError('Failed to load student data');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (id && user && !permissionError) {
      fetchStudentData();
    }
  }, [id, user, permissionError]);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get role badge styling based on role
  const getRoleBadge = (role) => {
    const roleStyles = {
      student: "bg-blue-100 text-blue-800",
      admin: "bg-purple-100 text-purple-800",
      instructor: "bg-green-100 text-green-800",
      default: "bg-gray-100 text-gray-800"
    };
    
    return roleStyles[role?.toLowerCase()] || roleStyles.default;
  };

  // Show permission error if user is not admin
  if (permissionError) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-[#F9FAFB] rounded-lg shadow-lg p-8 max-w-lg mx-auto text-center">
          <svg className="mx-auto h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="mt-4 text-xl font-bold text-gray-800">Permission Denied</h2>
          <p className="mt-2 text-[#666666]">
            You do not have permission to access this page. This page is restricted to administrative users only.
          </p>
          <button
            onClick={() => navigate('/lms/home')}
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-[#1E4BCC] focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-[#F9FAFB] rounded-lg shadow-lg p-8 max-w-lg mx-auto text-center">
          <svg className="mx-auto h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="mt-4 text-xl font-bold text-gray-800">Error</h2>
          <p className="mt-2 text-[#666666]">{error}</p>
          <button
            onClick={() => navigate('/lms/admin/content')}
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-[#1E4BCC] focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Return to Admin Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-6">
        <button
          onClick={() => navigate('/lms/admin/content')}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
          </svg>
          Back to Admin Dashboard
        </button>
      </div>
      
      {student && (
        <div className="bg-[#F9FAFB] rounded-lg shadow-lg overflow-hidden">
          {/* Header Section with Avatar */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-8 text-white">
            <div className="flex flex-col md:flex-row items-center md:items-start">
              <div className="w-24 h-24 bg-[#F9FAFB] rounded-full flex items-center justify-center text-blue-800 text-3xl font-bold mb-4 md:mb-0 md:mr-6">
                {student.firstName?.charAt(0) || student.email?.charAt(0) || 'U'}
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-2xl md:text-3xl font-bold">
                  {student.firstName ? `${student.firstName} ${student.lastName || ''}` : student.displayName || student.email || 'Unknown User'}
                </h1>
                <p className="text-blue-100 mt-1">{student.email}</p>
                <div className="mt-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleBadge(student.role)}`}>
                    {student.role || 'Student'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Details Sections */}
          <div className="p-6">
            {/* Basic Info Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-[#666666]">Full Name</p>
                  <p className="font-medium text-gray-900">
                    {student.firstName ? `${student.firstName} ${student.lastName || ''}` : student.displayName || 'Not provided'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[#666666]">Email Address</p>
                  <p className="font-medium text-gray-900">{student.email || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-[#666666]">Phone Number</p>
                  <p className="font-medium text-gray-900">{student.phoneNumber || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-[#666666]">User ID</p>
                  <p className="font-medium text-gray-900 break-all">{student.uid}</p>
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Account Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-[#666666]">Account Created</p>
                  <p className="font-medium text-gray-900">{formatDate(student.createdAt || student.created_at)}</p>
                </div>
                <div>
                  <p className="text-sm text-[#666666]">Last Login</p>
                  <p className="font-medium text-gray-900">{formatDate(student.lastLoginAt || student.last_login_at)}</p>
                </div>
                <div>
                  <p className="text-sm text-[#666666]">Email Verified</p>
                  <p className="font-medium text-gray-900">
                    {student.emailVerified ? 
                      <span className="text-green-600">Yes</span> : 
                      <span className="text-red-600">No</span>
                    }
                  </p>
                </div>
                <div>
                  <p className="text-sm text-[#666666]">Account Status</p>
                  <p className="font-medium text-gray-900">
                    {student.disabled ? 
                      <span className="text-red-600">Disabled</span> : 
                      <span className="text-green-600">Active</span>
                    }
                  </p>
                </div>
              </div>
            </div>
            
            {/* Additional Metadata */}
            {student.metadata && Object.keys(student.metadata).length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Additional Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(student.metadata).map(([key, value]) => (
                    <div key={key}>
                      <p className="text-sm text-[#666666]">{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}</p>
                      <p className="font-medium text-gray-900">{
                        typeof value === 'object' ? JSON.stringify(value) : String(value)
                      }</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDetailsPage;