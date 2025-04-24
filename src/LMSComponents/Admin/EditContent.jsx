// src/LMSComponents/Admin/EditContent.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ref, onValue, update } from 'firebase/database';
import { database } from '../../firebase/config';
import axios from 'axios';

const EditContent = ({ user }) => {
    const { contentId } = useParams();
    const navigate = useNavigate();
    const [content, setContent] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);

    // Base API URL - use environment variable or default to localhost
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    useEffect(() => {
        // Check if user is admin
        if (user && user.email.toLowerCase() === 'inspiringshereen@gmail.com'.toLowerCase()) {
            setIsAdmin(true);
        } else if (user) {
            // If logged in but not admin, redirect to LMS home
            navigate('/lms/home');
        } else {
            // If not logged in, redirect to login
            navigate('/lms/login');
            return;
        }

        // Only fetch data if we have a valid user and contentId
        if (user && contentId) {
            fetchContentDetails();
        }
    }, [user, contentId, navigate]);

    const fetchContentFromFirebase = () => {
        const contentRef = ref(database, `content/${contentId}`);
        onValue(contentRef, (snapshot) => {
            if (snapshot.exists()) {
                const contentData = snapshot.val();
                setContent(contentData);
                setTitle(contentData.title);
                setDescription(contentData.description || '');
            } else {
                setError('Content not found');
            }
            setLoading(false);
        }, (error) => {
            console.error("Error fetching content from Firebase:", error);
            setError('Failed to load content. Please try again.');
            setLoading(false);
        });
    };

    const fetchContentDetails = async () => {
        try {
            // Try to fetch from API first
            const response = await fetch(`${API_URL}/api/content/${contentId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${await user.getIdToken()}`,
                },
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Failed to fetch content from API');
            }

            const contentData = await response.json();
            setContent(contentData);
            setTitle(contentData.title);
            setDescription(contentData.description || '');
            setLoading(false);
        } catch (error) {
            console.error("Error fetching content from API:", error);
            // Fallback to Firebase if API fails
            fetchContentFromFirebase();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim()) {
            setError('Title is required');
            return;
        }

        setIsSaving(true);
        setError('');
        setSuccessMessage('');

        try {
            // Prepare updated content object
            const updatedContent = {
                ...content,
                title,
                description,
                updatedAt: new Date().toISOString(),
                updatedBy: user.uid,
                updatedByEmail: user.email
            };

            // Step 1: Update PostgreSQL via API
            try {
                const response = await fetch(`${API_URL}/api/content/${contentId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${await user.getIdToken()}`,
                    },
                    body: JSON.stringify(updatedContent),
                    credentials: 'include'
                });

                if (!response.ok) {
                    console.warn('PostgreSQL update failed, continuing with Firebase update');
                }
            } catch (apiError) {
                console.error('Error updating API:', apiError);
                // Continue with Firebase update even if API update fails
            }

            // Step 2: Always update Firebase as backup/fallback
            const firebaseId = content.firebaseId || contentId;
            const contentRef = ref(database, `content/${firebaseId}`);
            await update(contentRef, updatedContent);

            // Show success message
            setSuccessMessage('Content updated successfully!');
            
            // Hide success message after 3 seconds
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
            
            // Update local state
            setContent(updatedContent);
        } catch (error) {
            console.error('Error updating content:', error);
            setError('Failed to update content. Please try again.');
        } finally {
            setIsSaving(false);
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

    if (!isAdmin) {
        return <div className="p-8 text-center">Checking permissions...</div>;
    }

    if (error && !content) {
        return (
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
                    <p>{error}</p>
                </div>
                <button
                    onClick={() => navigate('/lms/admin')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg mt-4"
                >
                    Back to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto py-8 px-4">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-blue-600">Edit Content</h1>
                    <button
                        onClick={() => navigate('/lms/admin')}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        Back to Dashboard
                    </button>
                </div>

                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
                        <p>{error}</p>
                    </div>
                )}

                {successMessage && (
                    <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert">
                        <p>{successMessage}</p>
                    </div>
                )}

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-6">
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter content title"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter content description"
                                    rows="6"
                                />
                            </div>

                            <div className="mb-4">
                                <h3 className="text-lg font-medium text-gray-700 mb-2">Content Details</h3>
                                <div className="bg-gray-50 p-4 rounded-md">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Content Type</p>
                                            <p className="text-md font-medium">{content.contentType}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">File Name</p>
                                            <p className="text-md font-medium">{content.fileName}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Created At</p>
                                            <p className="text-md font-medium">
                                                {new Date(content.created_at || content.createdAt).toLocaleString()}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Created By</p>
                                            <p className="text-md font-medium">{content.createdByEmail || content.uploadedByEmail}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {content.contentType === 'image' && (
                                <div className="mb-6">
                                    <h3 className="text-lg font-medium text-gray-700 mb-2">File Preview</h3>
                                    <div className="border rounded-md p-2">
                                        <img 
                                            src={content.fileUrl} 
                                            alt={content.title} 
                                            className="max-h-64 mx-auto"
                                        />
                                    </div>
                                </div>
                            )}

                            {content.contentType === 'pdf' && (
                                <div className="mb-6">
                                    <h3 className="text-lg font-medium text-gray-700 mb-2">File Preview</h3>
                                    <div className="border rounded-md p-2">
                                        <a 
                                            href={content.fileUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline flex items-center"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                            </svg>
                                            View PDF
                                        </a>
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => navigate('/lms/admin')}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                    disabled={isSaving}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    disabled={isSaving}
                                >
                                    {isSaving ? (
                                        <span className="flex items-center">
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Saving...
                                        </span>
                                    ) : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditContent;