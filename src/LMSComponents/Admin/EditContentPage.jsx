// src/LMSComponents/Admin/EditContentPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ref, get, update } from 'firebase/database';
import { database as rtdb } from '../../firebase/config';
import axios from 'axios';

const EditContentPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, uploadFile, uploadProgress, setUploadProgress } = useAuth();

    const [content, setContent] = useState({
        title: '',
        description: '',
        contentType: '',
        category: '',
        fileUrl: '',
        fileName: '',
        fileSize: 0,
        fileType: '',
        fileCategory: ''
    });

    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [newFile, setNewFile] = useState(null);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [permissionError, setPermissionError] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    // Allowed file types
    const allowedTypes = {
        'image/jpeg': 'image',
        'image/jpg': 'image',
        'image/png': 'image',
        'application/pdf': 'pdf',
        'video/mp4': 'video',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'ppt',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'word',
        'application/msword': 'word'
    };

    // Content type options with badges and colors
    const contentTypeOptions = [
        { value: 'lesson', label: 'Lesson Material', color: 'bg-purple-100 text-purple-800 border-purple-200' },
        { value: 'assignment', label: 'Assignment', color: 'bg-blue-100 text-blue-800 border-blue-200' },
        { value: 'reference', label: 'Reference Material', color: 'bg-green-100 text-green-800 border-green-200' },
        { value: 'quiz', label: 'Quiz', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
        { value: 'other', label: 'Other', color: 'bg-gray-100 text-gray-800 border-[#E5E7EB]' }
    ];

    // Category options with badges
    const categoryOptions = [
        { value: 'beginner', label: 'Beginner', color: 'bg-green-100 text-green-800 border-green-200' },
        { value: 'intermediate', label: 'Intermediate', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
        { value: 'advanced', label: 'Advanced', color: 'bg-red-100 text-red-800 border-red-200' },
        { value: 'general', label: 'General', color: 'bg-blue-100 text-blue-800 border-blue-200' }
    ];

    // Check if user is admin
    useEffect(() => {
        console.log('User:', user);
        // Specific admin check for the requested email
        if (user && user.email !== 'inspiringshereen@gmail.com') {
            setPermissionError(true);
            setIsLoading(false);
        }
    }, [user]);

    // Fetch content data when component mounts
    useEffect(() => {
        const fetchContent = async () => {
            if (permissionError) return;

            try {
                const contentRef = ref(rtdb, `content/${id}`);
                const snapshot = await get(contentRef);

                if (snapshot.exists()) {
                    setContent(snapshot.val());
                    setIsLoading(false);
                } else {
                    setError('Content not found.');
                    setIsLoading(false);
                }
            } catch (err) {
                console.error('Error fetching content:', err);
                setError('Failed to load content. Please try again.');
                setIsLoading(false);
            }
        };

        if (id && user && !permissionError) {
            fetchContent();
        }
    }, [id, user, permissionError]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setContent(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];

        if (selectedFile) {
            // Check if file type is allowed
            if (allowedTypes[selectedFile.type]) {
                setNewFile(selectedFile);
                setError('');
            } else {
                setError('File type not supported. Please upload an image (JPEG, JPG, PNG), video (MP4), PDF, Word document, or PowerPoint presentation.');
            }
        }
    };

    // Mock progress updates since we can't track Cloudinary upload progress directly
    const simulateProgress = () => {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.floor(Math.random() * 10) + 5;
            if (progress > 95) {
                progress = 95; // Cap at 95% until we get server confirmation
                clearInterval(interval);
            }
            setUploadProgress(progress);
        }, 500);

        return interval;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!content.title.trim()) {
            setError('Title is required.');
            return;
        }

        setIsUpdating(true);
        setError('');
        setSuccessMessage('');

        try {
            let updatedContent = { ...content };

            // If there's a new file, upload it first
            if (newFile) {
                // Reset progress for this file
                setUploadProgress(0);

                // Start progress simulation
                const progressInterval = simulateProgress();

                try {
                    // Call uploadFile from AuthContext (Cloudinary logic)
                    const result = await uploadFile(newFile);

                    // Stop progress simulation
                    clearInterval(progressInterval);
                    setUploadProgress(100);

                    if (!result || !result.secureUrl) {
                        throw new Error('Upload failed');
                    }

                    // Update content with new file info
                    updatedContent = {
                        ...updatedContent,
                        fileUrl: result.secureUrl,
                        fileName: newFile.name,
                        fileSize: newFile.size,
                        fileType: newFile.type,
                        fileCategory: allowedTypes[newFile.type]
                    };
                } catch (uploadError) {
                    console.error('Error uploading new file:', uploadError);
                    setError('Failed to upload new file. Please try again.');
                    setIsUpdating(false);
                    return;
                }
            }

            // Update lastModified timestamp
            updatedContent.lastModified = new Date().toISOString();
            updatedContent.modifiedBy = user.uid;
            updatedContent.modifiedByEmail = user.email;

            // Update in Firebase RTDB
            const contentRef = ref(rtdb, `content/${id}`);
            await update(contentRef, updatedContent);

            // Also update in PostgreSQL via API
            const API_URL = import.meta.env.VITE_API_URL;
            await axios.put(`${API_URL}/api/lms/content/${id}`, updatedContent);

            setContent(updatedContent);
            setNewFile(null);

            // Show success toast
            setSuccessMessage('Content updated successfully!');

            // Auto-navigate back after successful update
            setTimeout(() => {
                navigate('/lms/admin/content');
            }, 2000);

        } catch (error) {
            console.error('Error updating content:', error);
            setError('Failed to update content: ' + (error.message || 'Please try again'));
        } finally {
            setIsUpdating(false);
        }
    };

    // Get content type badge details
    const getContentTypeBadge = () => {
        const contentTypeObj = contentTypeOptions.find(option => option.value === content.contentType);
        return contentTypeObj || contentTypeOptions[4]; // Default to 'Other' if not found
    };

    // Get category badge details
    const getCategoryBadge = () => {
        const categoryObj = categoryOptions.find(option => option.value === content.category);
        return categoryObj || categoryOptions[3]; // Default to 'General' if not found
    };

    // Get file type icon
    const getFileIcon = () => {
        switch (content.fileCategory) {
            case 'image':
                return (
                    <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                );
            case 'pdf':
                return (
                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                );
            case 'video':
                return (
                    <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                );
            case 'ppt':
                return (
                    <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                );
            case 'word':
                return (
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                );
            default:
                return (
                    <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                );
        }
    };

    // Render file preview modal
    const renderPreviewModal = () => {
        if (!showPreview || !content.fileUrl) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-[#F9FAFB] rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-auto">
                    <div className="p-4 border-b flex justify-between items-center">
                        <h3 className="text-lg font-medium">{content.fileName}</h3>
                        <button
                            onClick={() => setShowPreview(false)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="p-6">
                        {content.fileCategory === 'image' ? (
                            <img
                                src={content.fileUrl}
                                alt={content.title}
                                className="max-w-full mx-auto"
                            />
                        ) : content.fileCategory === 'pdf' ? (
                            <iframe
                                src={content.fileUrl}
                                title={content.title}
                                className="w-full h-[70vh] border border-[#E5E7EB] rounded"
                            />
                        ) : (
                            <div className="text-center p-6">
                                <p>Preview not available for this file type.</p>
                                <a
                                    href={content.fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-[#1E4BCC]"
                                >
                                    Open File
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
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

    return (
        <div className="container mx-auto p-6">
            <div className="bg-[#F9FAFB] rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-blue-600">Edit Content</h1>
                    <button
                        onClick={() => navigate('/lms/admin/content')}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                        Back to Content List
                    </button>
                </div>

                {/* Success Toast */}
                {successMessage && (
                    <div className="fixed top-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md animate-fade-in-out z-50" role="alert">
                        <div className="flex items-center">
                            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            <p>{successMessage}</p>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
                        <p>{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Content Title and Description */}
                    <div className="bg-gray-50 p-6 rounded-lg border border-[#E5E7EB]">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={content.title}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter content title"
                                required
                                disabled={isUpdating}
                            />
                        </div>

                        <div className="mt-4">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                id="description"
                                name="description"
                                value={content.description}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter content description"
                                rows="4"
                                disabled={isUpdating}
                            />
                        </div>
                    </div>

                    {/* Content Badges and Categories */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-50 p-6 rounded-lg border border-[#E5E7EB]">
                            <label htmlFor="contentType" className="block text-sm font-medium text-gray-700 mb-3">Content Type</label>

                            {/* Content Type Badges */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                                {contentTypeOptions.map(option => (
                                    <div
                                        key={option.value}
                                        onClick={() => !isUpdating && handleInputChange({
                                            target: { name: 'contentType', value: option.value }
                                        })}
                                        className={`border rounded-md p-2 cursor-pointer transition-all ${content.contentType === option.value ?
                                            option.color + ' border-2' :
                                            'bg-[#F9FAFB] border-[#E5E7EB] hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className="flex items-center">
                                            <input
                                                type="radio"
                                                name="contentTypeRadio"
                                                checked={content.contentType === option.value}
                                                onChange={() => { }}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                                disabled={isUpdating}
                                            />
                                            <label className="ml-2 block text-sm font-medium">
                                                {option.label}
                                            </label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-gray-50 p-6 rounded-lg border border-[#E5E7EB]">
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-3">Category</label>

                            {/* Category Badges */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {categoryOptions.map(option => (
                                    <div
                                        key={option.value}
                                        onClick={() => !isUpdating && handleInputChange({
                                            target: { name: 'category', value: option.value }
                                        })}
                                        className={`border rounded-md p-2 cursor-pointer transition-all ${content.category === option.value ?
                                            option.color + ' border-2' :
                                            'bg-[#F9FAFB] border-[#E5E7EB] hover:bg-gray-50'
                                            }`}
                                    >
                                        <div className="flex items-center">
                                            <input
                                                type="radio"
                                                name="categoryRadio"
                                                checked={content.category === option.value}
                                                onChange={() => { }}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                                                disabled={isUpdating}
                                            />
                                            <label className="ml-2 block text-sm font-medium">
                                                {option.label}
                                            </label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Current File */}
                    <div className="bg-[#F9FAFB] p-6 rounded-lg border border-[#E5E7EB]">
                        <label className="block text-sm font-medium text-gray-700 mb-3">Current File</label>

                        <div className="flex items-start p-4 rounded-md bg-blue-50 border border-blue-100">
                            <div className="mr-4">
                                {getFileIcon()}
                            </div>

                            <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                    <span className="font-medium text-gray-800">{content.fileName}</span>

                                    {/* Content type badge */}
                                    {content.contentType && (
                                        <span className={`text-xs px-2 py-1 rounded-lg border ${getContentTypeBadge().color}`}
                                        >
                                            {getContentTypeBadge().label}
                                        </span>

                                    )}
                                    {content.category && (
                                        <span className={`text-xs px-2 py-1 rounded-lg border ${getCategoryBadge().color}`}>
                                            {getCategoryBadge().label}
                                        </span>
                                    )}
                                </div>

                                <p className="text-sm text-gray-500">
                                    {(content.fileSize / 1024 / 1024).toFixed(2)} MB • {content.fileType}
                                </p>

                                <div className="flex mt-3">
                                    <a
                                        href={content.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium mr-4"
                                    >
                                        Download
                                    </a>
                                    <button
                                        type="button"
                                        onClick={() => setShowPreview(true)}
                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                    >
                                        Preview
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* File Upload Section */}
                    <div className="bg-[#F9FAFB] p-6 rounded-lg border border-[#E5E7EB]">
                        <h3 className="text-lg font-medium text-gray-700 mb-4">Replace File</h3>

                        <div className="border-2 border-dashed border-[#E5E7EB] rounded-lg p-6 text-center">
                            <input
                                type="file"
                                id="file"
                                className="hidden"
                                onChange={handleFileChange}
                                disabled={isUpdating}
                            />
                            <label
                                htmlFor="file"
                                className="cursor-pointer flex flex-col items-center justify-center text-gray-500 hover:text-[#666666]"
                            >
                                <svg className="w-12 h-12 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                <span className="text-sm">Click to upload or drag and drop</span>
                                <span className="text-xs text-gray-500 mt-1">
                                    Supported formats: JPEG, PNG, PDF, DOCX, PPT, MP4
                                </span>
                            </label>

                            {newFile && (
                                <div className="mt-4 p-3 bg-blue-50 rounded-md flex items-center">
                                    <svg className="w-6 h-6 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <div className="flex-1 overflow-hidden">
                                        <p className="text-sm font-medium text-gray-800 truncate">{newFile.name}</p>
                                        <p className="text-xs text-gray-500">{(newFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setNewFile(null)}
                                        className="text-gray-500 hover:text-gray-700"
                                        disabled={isUpdating}
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Upload Progress */}
                        {uploadProgress > 0 && (
                            <div className="mt-4">
                                <div className="bg-gray-200 rounded-full h-2.5 mb-1">
                                    <div
                                        className="bg-blue-600 h-2.5 rounded-full"
                                        style={{ width: `${uploadProgress}%` }}
                                    ></div>
                                </div>
                                <p className="text-xs text-gray-500 text-right">{uploadProgress}% uploaded</p>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end space-x-4 mt-6">
                        <button
                            type="button"
                            onClick={() => navigate('/lms/admin/content')}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                            disabled={isUpdating}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-[#1E4BCC] focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
                            disabled={isUpdating}
                        >
                            {isUpdating ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Saving...
                                </>
                            ) : (
                                'Save Changes'
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* File Preview Modal */}
            {renderPreviewModal()}
        </div>
    );
};

export default EditContentPage;