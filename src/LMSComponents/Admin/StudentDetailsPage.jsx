// src/LMSComponents/Admin/StudentDetailsPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ref, get } from 'firebase/database';
import { database as rtdb } from '../../firebase/config';
import StudentDetailsModal from './StudentDetailsPage';
import axios from 'axios';

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

  // Show permission error if user is not admin
  if (permissionError) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg mx-auto text-center">
          <svg className="mx-auto h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="mt-4 text-xl font-bold text-gray-800">Permission Denied</h2>
          <p className="mt-2 text-gray-600">
            You do not have permission to access this page. This page is restricted to administrative users only.
          </p>
          <button
            onClick={() => navigate('/lms/home')}
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg mx-auto text-center">
          <svg className="mx-auto h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="mt-4 text-xl font-bold text-gray-800">Error</h2>
          <p className="mt-2 text-gray-600">{error}</p>
          <button
            onClick={() => navigate('/lms/admin/content')}
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
      
      {student && <StudentDetailsModal student={student} onClose={() => navigate('/lms/admin/content')} />}
    </div>
  );
};

export default StudentDetailsPage;