// src/LMSComponents/Admin/ContentUploadModal.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ref, set, push } from 'firebase/database';
import { database as rtdb } from '../../firebase/config';
import axios from 'axios';

const ContentUploadModal = ({ onClose, user }) => {
  const [uploads, setUploads] = useState([
    { title: '', description: '', file: null, contentType: '', category: '' }
  ]);
  const [isUploading, setIsUploading] = useState(false);
  const [currentUploadIndex, setCurrentUploadIndex] = useState(0);
  const [error, setError] = useState('');
  const { uploadFile, uploadProgress, setUploadProgress } = useAuth();

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

  const handleAddMoreFiles = () => {
    setUploads([...uploads, { title: '', description: '', file: null, contentType: '', category: '' }]);
  };

  const handleRemoveUpload = (index) => {
    if (uploads.length > 1) {
      const newUploads = [...uploads];
      newUploads.splice(index, 1);
      setUploads(newUploads);
    }
  };

  const handleFileChange = (e, index) => {
    const selectedFile = e.target.files[0];
    
    if (selectedFile) {
      // Check if file type is allowed
      if (allowedTypes[selectedFile.type]) {
        const updatedUploads = [...uploads];
        updatedUploads[index].file = selectedFile;
        
        // Auto-fill title if empty
        if (!updatedUploads[index].title.trim()) {
          // Remove extension from filename for title
          const fileNameWithoutExt = selectedFile.name.split('.').slice(0, -1).join('.');
          updatedUploads[index].title = fileNameWithoutExt;
        }
        
        setUploads(updatedUploads);
        setError('');
      } else {
        setError('File type not supported. Please upload an image (JPEG, JPG, PNG), video (MP4), PDF, Word document, or PowerPoint presentation.');
      }
    }
  };

  const handleUploadChange = (e, index, field) => {
    const updatedUploads = [...uploads];
    updatedUploads[index][field] = e.target.value;
    setUploads(updatedUploads);
  };

  const uploadSingleContent = async (uploadItem, index) => {
    setCurrentUploadIndex(index);
    
    // Reset progress for this file
    setUploadProgress(0);
    
    // Start progress simulation
    const progressInterval = simulateProgress();
    
    try {
      // Call uploadFile from AuthContext (Cloudinary logic)
      const result = await uploadFile(uploadItem.file);
      
      // Stop progress simulation
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      if (!result || !result.secureUrl) {
        throw new Error('Upload failed');
      }
      
      // Generate a unique ID for the content
      const contentId = Date.now().toString() + index;
      
      // Determine file type from file MIME type
      const fileTypeCategory = allowedTypes[uploadItem.file.type];
      
      // Prepare content object
      const contentObj = {
        title: uploadItem.title,
        description: uploadItem.description,
        fileUrl: result.secureUrl,
        fileName: uploadItem.file.name,
        fileSize: uploadItem.file.size,
        contentType: uploadItem.contentType || 'other', // From dropdown
        category: uploadItem.category || 'general', // From dropdown
        fileType: uploadItem.file.type,
        fileCategory: fileTypeCategory, // Image, PDF, video, etc.
        createdAt: new Date().toISOString(),
        uploadedBy: user.uid,
        uploadedByEmail: user.email,
        createdBy: user.uid,
        createdByEmail: user.email,
        firebaseId: contentId
      };
      
      // Save metadata in Firebase RTDB
      const contentRef = ref(rtdb, `content/${contentId}`);
      await set(contentRef, contentObj);
      
      // Also save to PostgreSQL via API
      const API_URL = import.meta.env.VITE_API_URL;
      await axios.post(`${API_URL}/api/lms/content`, contentObj);
      
      return true;
    } catch (error) {
      console.error(`Error uploading file ${uploadItem.file.name}:`, error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all uploads
    let hasError = false;
    
    for (let i = 0; i < uploads.length; i++) {
      const upload = uploads[i];
      
      if (!upload.title.trim()) {
        setError(`Title is required for file #${i + 1}`);
        hasError = true;
        break;
      }
      
      if (!upload.file) {
        setError(`Please select a file for upload #${i + 1}`);
        hasError = true;
        break;
      }
    }
    
    if (hasError) return;
    
    setIsUploading(true);
    setError('');
    
    try {
      // Upload files one by one
      for (let i = 0; i < uploads.length; i++) {
        const success = await uploadSingleContent(uploads[i], i);
        if (!success) {
          setError(`Failed to upload ${uploads[i].file.name}. Please try again.`);
          setIsUploading(false);
          return;
        }
      }
      
      // Close modal after all successful uploads
      onClose();
    } catch (error) {
      console.error('Error in content upload batch:', error);
      setError('An error occurred during batch upload: ' + (error.message || 'Please try again'));
      setIsUploading(false);
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

  const handleClose = () => {
    setUploads([{ title: '', description: '', file: null, contentType: '', category: '' }]);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-blue-600">Upload Content</h2>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700"
              disabled={isUploading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {uploads.map((upload, index) => (
              <div key={index} className="mb-8 border-b pb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-gray-700">File #{index + 1}</h3>
                  {uploads.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveUpload(index)}
                      className="text-red-500 hover:text-red-700"
                      disabled={isUploading}
                    >
                      Remove
                    </button>
                  )}
                </div>
                
                <div className="mb-4">
                  <label htmlFor={`title-${index}`} className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    id={`title-${index}`}
                    value={upload.title}
                    onChange={(e) => handleUploadChange(e, index, 'title')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter content title"
                    required
                    disabled={isUploading}
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor={`description-${index}`} className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    id={`description-${index}`}
                    value={upload.description}
                    onChange={(e) => handleUploadChange(e, index, 'description')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter content description"
                    rows="3"
                    disabled={isUploading}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor={`contentType-${index}`} className="block text-sm font-medium text-gray-700 mb-1">Content Type</label>
                    <select
                      id={`contentType-${index}`}
                      value={upload.contentType}
                      onChange={(e) => handleUploadChange(e, index, 'contentType')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isUploading}
                    >
                      <option value="">Select Content Type</option>
                      {contentTypeOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor={`category-${index}`} className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      id={`category-${index}`}
                      value={upload.category}
                      onChange={(e) => handleUploadChange(e, index, 'category')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isUploading}
                    >
                      <option value="">Select Category</option>
                      {categoryOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Upload File</label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-8 h-8 mb-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                          Images (JPEG, JPG, PNG), Videos (MP4), PDF, Word, or PowerPoint
                        </p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        onChange={(e) => handleFileChange(e, index)}
                        accept=".jpg,.jpeg,.png,.pdf,.mp4,.docx,.doc,.pptx"
                        disabled={isUploading}
                      />
                    </label>
                  </div>

                  {upload.file && (
                    <div className="mt-2 text-sm text-gray-600">
                      Selected file: {upload.file.name} ({(upload.file.size / 1024 / 1024).toFixed(2)} MB)
                    </div>
                  )}
                </div>
                
                {isUploading && currentUploadIndex === index && (
                  <div className="mb-4">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Uploading file #{index + 1}: {uploadProgress}%</p>
                  </div>
                )}
              </div>
            ))}
            
            <div className="mb-6">
              <button
                type="button"
                onClick={handleAddMoreFiles}
                className="flex items-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isUploading}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Another File
              </button>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                disabled={isUploading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isUploading}
              >
                {isUploading ? `Uploading (${currentUploadIndex + 1}/${uploads.length})...` : `Upload ${uploads.length > 1 ? 'All Files' : 'File'}`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContentUploadModal;