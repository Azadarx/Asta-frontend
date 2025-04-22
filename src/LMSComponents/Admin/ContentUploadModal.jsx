// src/LMSComponents/Admin/ContentUploadModal.jsx
import React, { useState } from 'react';
import { ref, push, serverTimestamp } from 'firebase/database';
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { database, storage } from '../../firebase/config';

const ContentUploadModal = ({ onClose, user }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

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

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (selectedFile) {
      // Check if file type is allowed
      if (allowedTypes[selectedFile.type]) {
        setFile(selectedFile);
        setError('');
      } else {
        setFile(null);
        setError('File type not supported. Please upload an image (JPEG, JPG, PNG), video (MP4), PDF, Word document, or PowerPoint presentation.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    
    if (!file) {
      setError('Please select a file to upload');
      return;
    }
    
    setIsUploading(true);
    setError('');
    
    try {
      // Create storage reference
      const fileExtension = file.name.split('.').pop();
      const fileName = `${Date.now()}_${title.replace(/\s+/g, '_')}.${fileExtension}`;
      const contentType = allowedTypes[file.type];
      const storagePath = `content/${contentType}/${fileName}`;
      const fileRef = storageRef(storage, storagePath);
      
      // Upload file with progress tracking
      const uploadTask = uploadBytesResumable(fileRef, file);
      
      uploadTask.on('state_changed', 
        (snapshot) => {
          // Track upload progress
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setUploadProgress(progress);
        },
        (error) => {
          console.error('Upload error:', error);
          setError('Error uploading file. Please try again.');
          setIsUploading(false);
        },
        async () => {
          // Upload completed successfully
          const downloadURL = await getDownloadURL(fileRef);
          
          // Add content entry to firebase database
          const contentRef = ref(database, 'content');
          const newContentRef = await push(contentRef, {
            title,
            description,
            contentType,
            fileURL: downloadURL,
            storagePath,
            fileSize: file.size,
            fileName: file.name,
            createdBy: user.uid,
            createdAt: serverTimestamp(),
            createdByEmail: user.email
          });
          
          // Now also save to our backend
          try {
            const backendResponse = await fetch('/api/lms/content', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                title,
                description,
                contentType,
                fileURL: downloadURL,
                storagePath,
                fileSize: file.size,
                fileName: file.name,
                createdBy: user.uid,
                createdByEmail: user.email,
                firebaseId: newContentRef.key // Store Firebase reference ID
              }),
            });
            
            if (!backendResponse.ok) {
              console.error('Backend storage failed:', await backendResponse.text());
              // Continue anyway as data is in Firebase
            }
          } catch (backendError) {
            console.error('Error saving to backend:', backendError);
            // Continue anyway as data is in Firebase
          }
          
          // Close modal on success
          onClose();
        }
      );
    } catch (error) {
      console.error('Error in content upload:', error);
      setError('An error occurred. Please try again.');
      setIsUploading(false);
    }
  };
  const handleClose = () => {
    setTitle('');
    setDescription('');
    setFile(null);
    setModalOpen(false);
  };
  

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
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
                rows="4"
              />
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
                    onChange={handleFileChange}
                    accept=".jpg,.jpeg,.png,.pdf,.mp4,.docx,.doc,.pptx"
                  />
                </label>
              </div>
              
              {file && (
                <div className="mt-2 text-sm text-gray-600">
                  Selected file: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </div>
              )}
            </div>
            
            {isUploading && (
              <div className="mb-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-1">Uploading: {uploadProgress}%</p>
              </div>
            )}
            
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
                {isUploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContentUploadModal;