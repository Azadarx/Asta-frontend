// src/LMSComponents/Admin/ContentUploadModal.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ref, set, push } from 'firebase/database';
import { database as rtdb } from '../../firebase/config';
import axios from 'axios';

const ContentUploadModal = ({ isOpen, onClose, onContentAdded, user, API_URL }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contentType, setContentType] = useState('');
  const [category, setCategory] = useState('');
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [currentUploadIndex, setCurrentUploadIndex] = useState(0);
  const [error, setError] = useState('');
  const [groupName, setGroupName] = useState('');
  const [useGrouping, setUseGrouping] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { uploadFile } = useAuth();

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

  // Content type options
  const contentTypeOptions = [
    { value: 'lesson', label: 'Lesson Material' },
    { value: 'assignment', label: 'Assignment' },
    { value: 'reference', label: 'Reference Material' },
    { value: 'quiz', label: 'Quiz' },
    { value: 'other', label: 'Other' }
  ];

  // Category options
  const categoryOptions = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'general', label: 'General' }
  ];

  const handleFilesChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    // Filter allowed file types
    const validFiles = selectedFiles.filter(file => allowedTypes[file.type]);
    
    if (validFiles.length !== selectedFiles.length) {
      setError('Some files were not added. Only images (JPEG, JPG, PNG), videos (MP4), PDF, Word documents, or PowerPoint presentations are supported.');
    } else {
      setError('');
    }
    
    setFiles(prevFiles => [...prevFiles, ...validFiles]);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const getFileIcon = (fileType) => {
    const type = allowedTypes[fileType];
    switch (type) {
      case 'image':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        );
      case 'pdf':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        );
      case 'video':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        );
      case 'word':
      case 'ppt':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
        );
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

  const uploadSingleContent = async (file, index, uploadSessionId) => {
    setCurrentUploadIndex(index);
    
    // Reset progress for this file
    setUploadProgress(0);
    
    // Start progress simulation
    const progressInterval = simulateProgress();
    
    try {
      // Call uploadFile from AuthContext (Cloudinary logic)
      const result = await uploadFile(file);
      
      // Stop progress simulation
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      if (!result || !result.secureUrl) {
        throw new Error('Upload failed');
      }
      
      // Generate a unique ID for the content
      const contentId = Date.now().toString() + '-' + index;
      
      // Determine file type from file MIME type
      const fileTypeCategory = allowedTypes[file.type];
      
      // Generate individual title if in group mode
      const individualTitle = useGrouping 
        ? `${groupName || title} - ${file.name.split('.')[0]}`
        : title;
      
      // IMPORTANT: Always include createdAt timestamp
      const timestamp = new Date().toISOString();
      
      // Prepare content object with guaranteed createdAt field
      const contentObj = {
        title: individualTitle,
        description: description,
        fileUrl: result.secureUrl,
        fileName: file.name,
        fileSize: file.size,
        contentType: contentType || 'other',
        category: category || 'general',
        fileType: file.type,
        fileCategory: fileTypeCategory,
        // Ensure timestamps are always included
        createdAt: timestamp,
        updatedAt: timestamp,
        uploadedBy: user.uid,
        uploadedByEmail: user.email,
        createdBy: user.uid,
        createdByEmail: user.email,
        firebaseId: contentId,
        uploadSessionId: uploadSessionId // Group identifier
      };
      
      // Save metadata in Firebase RTDB
      // Using a direct path with contentId to ensure consistency
      const contentRef = ref(rtdb, `content/${contentId}`);
      
      // Use set() to ensure the complete object is saved with all fields
      await set(contentRef, contentObj);
      
      // Also save to PostgreSQL via API
      await axios.post(`${API_URL}/api/lms/content`, contentObj, {
        headers: {
          'Authorization': `Bearer ${await user.getIdToken()}`
        },
        credentials: 'include'
      });
      
      return true;
    } catch (error) {
      console.error(`Error uploading file ${file.name}:`, error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!title.trim()) {
      setError('Please enter a title');
      return;
    }
    
    if (!contentType) {
      setError('Please select a content type');
      return;
    }
    
    if (!category) {
      setError('Please select a category');
      return;
    }
    
    if (files.length === 0) {
      setError('Please select at least one file to upload');
      return;
    }
    
    setIsUploading(true);
    setError('');
    
    try {
      // Generate a common upload session ID for grouping
      const uploadSessionId = `upload-session-${Date.now()}`;
      
      // Upload files one by one
      for (let i = 0; i < files.length; i++) {
        const success = await uploadSingleContent(files[i], i, uploadSessionId);
        if (!success) {
          setError(`Failed to upload ${files[i].name}. Please try again.`);
          setIsUploading(false);
          return;
        }
      }
      
      // Close modal and refresh content list
      onContentAdded();
      onClose();
      
      // Show success notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-[#FFD700] text-white p-4 rounded-lg shadow-lg z-50';
      notification.textContent = `Successfully uploaded ${files.length} file${files.length > 1 ? 's' : ''}!`;
      document.body.appendChild(notification);
      
      setTimeout(() => {
        notification.remove();
      }, 3000);
      
    } catch (error) {
      console.error('Error in content upload batch:', error);
      setError('An error occurred during batch upload: ' + (error.message || 'Please try again'));
      setIsUploading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    const validFiles = droppedFiles.filter(file => allowedTypes[file.type]);
    
    if (validFiles.length !== droppedFiles.length) {
      setError('Some files were not added. Only images (JPEG, JPG, PNG), videos (MP4), PDF, Word documents, or PowerPoint presentations are supported.');
    } else {
      setError('');
    }
    
    setFiles(prevFiles => [...prevFiles, ...validFiles]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#F9FAFB] rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-blue-600">Upload Learning Content</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
              disabled={isUploading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded" role="alert">
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="bg-gray-50 p-6 rounded-lg mb-6 shadow-sm border border-[#E5E7EB]">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Content Information</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Grouping Options</label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="useGrouping"
                    checked={useGrouping}
                    onChange={(e) => setUseGrouping(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-[#E5E7EB] rounded"
                    disabled={isUploading}
                  />
                  <label htmlFor="useGrouping" className="ml-2 block text-sm text-gray-700">
                    Treat uploads as a group (each file will have its own entry but share metadata)
                  </label>
                </div>
                
                {useGrouping && (
                  <div className="mt-3">
                    <label htmlFor="groupName" className="block text-sm font-medium text-gray-700 mb-1">Group Name (optional)</label>
                    <input
                      type="text"
                      id="groupName"
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                      className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter group name (e.g. 'Week 1 Materials')"
                      disabled={isUploading}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Individual files will be named "[Group Name] - [File Name]"
                    </p>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    {useGrouping ? 'Group Title' : 'Content Title'} *
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={useGrouping ? "Enter group title" : "Enter content title"}
                    required
                    disabled={isUploading}
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="contentType" className="block text-sm font-medium text-gray-700 mb-1">Content Type *</label>
                  <select
                    id="contentType"
                    value={contentType}
                    onChange={(e) => setContentType(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={isUploading}
                  >
                    <option value="">Select Content Type</option>
                    {contentTypeOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter content description"
                    rows="3"
                    disabled={isUploading}
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={isUploading}
                  >
                    <option value="">Select Category</option>
                    {categoryOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg mb-6 shadow-sm border border-[#E5E7EB]">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Upload Files</h3>
              
              <div 
                className="flex flex-col items-center justify-center w-full h-40 border-2 border-blue-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition duration-150"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-upload').click()}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-10 h-10 mb-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="mb-2 text-sm text-gray-700">
                    <span className="font-medium">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    Multiple files supported: Images, Videos, PDF, Word, PowerPoint
                  </p>
                  {files.length > 0 && (
                    <p className="mt-2 text-sm font-medium text-blue-600">
                      {files.length} file{files.length !== 1 ? 's' : ''} selected
                    </p>
                  )}
                </div>
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFilesChange}
                  accept=".jpg,.jpeg,.png,.pdf,.mp4,.docx,.doc,.pptx"
                  disabled={isUploading}
                />
              </div>

              {files.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Files</h4>
                  <div className="max-h-40 overflow-y-auto border border-[#E5E7EB] rounded-md">
                    {files.map((file, index) => (
                      <div 
                        key={index} 
                        className="flex items-center justify-between px-4 py-2 border-b border-[#E5E7EB] last:border-b-0"
                      >
                        <div className="flex items-center">
                          {getFileIcon(file.type)}
                          <span className="ml-2 text-sm text-gray-700 truncate max-w-xs">
                            {file.name}
                          </span>
                          <span className="ml-2 text-xs text-gray-500">
                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700"
                          disabled={isUploading}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {isUploading && (
              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-in-out"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <span className="ml-2 text-sm text-gray-700">{uploadProgress}%</span>
                </div>
                <p className="text-sm text-[#666666]">
                  Uploading file {currentUploadIndex + 1} of {files.length}...
                </p>
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isUploading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm hover:bg-[#1E4BCC] focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isUploading}
              >
                {isUploading ? 
                  `Uploading (${currentUploadIndex + 1}/${files.length})...` : 
                  `Upload ${files.length > 1 ? `${files.length} Files` : 'File'}`
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContentUploadModal;