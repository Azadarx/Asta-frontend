import React, { useState } from 'react';
import {
  FaFilePdf,
  FaFileWord,
  FaFilePowerpoint,
  FaImage,
  FaVideo,
  FaExternalLinkAlt,
  FaTrash,
  FaLayerGroup,
  FaDownload,
  FaEye,
  FaFileAlt
} from 'react-icons/fa';

const ContentCard = ({ content, isAdmin = false, groupTitle = null, onDelete }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Ensure content object is never null/undefined
  const safeContent = content || {};

  const getFileIcon = () => {
    // Check various possible properties where file type might be stored
    const fileType = (safeContent.fileCategory ||
      safeContent.fileType ||
      safeContent.file_type ||
      safeContent.contentType || '').toLowerCase();

    switch (fileType) {
      case 'application/pdf':
      case 'pdf':
        return <FaFilePdf className="text-red-500 text-4xl" />;
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      case 'application/msword':
      case 'doc':
      case 'docx':
      case 'word':
        return <FaFileWord className="text-blue-500 text-4xl" />;
      case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
      case 'application/vnd.ms-powerpoint':
      case 'ppt':
      case 'pptx':
        return <FaFilePowerpoint className="text-orange-500 text-4xl" />;
      case 'image/jpeg':
      case 'image/jpg':
      case 'image/png':
      case 'image/gif':
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'image':
        return <FaImage className="text-green-500 text-4xl" />;
      case 'video/mp4':
      case 'video/quicktime':
      case 'video/avi':
      case 'mp4':
      case 'mov':
      case 'avi':
      case 'video':
        return <FaVideo className="text-purple-500 text-4xl" />;
      case '':
        return <FaFileAlt className="text-gray-500 text-4xl" />;
      default:
        return <FaExternalLinkAlt className="text-gray-500 text-4xl" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown Date';

    try {
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) return 'Unknown Date';
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (error) {
      return 'Unknown Date';
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (onDelete && typeof onDelete === 'function') {
      onDelete(safeContent.id || safeContent.firebaseId);
    }
    setShowDeleteModal(false);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  const getFileType = () => {
    const fileType = safeContent.fileCategory ||
      safeContent.fileType ||
      safeContent.file_type ||
      safeContent.contentType || '';
    return fileType.toUpperCase();
  };

  const shouldDownload = () => {
    const fileType = (safeContent.fileCategory ||
      safeContent.fileType ||
      safeContent.file_type ||
      safeContent.contentType || '').toLowerCase();

    const downloadTypes = [
      'pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx',
      'application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    return downloadTypes.some(type => fileType.includes(type));
  };

  const getActionButtonText = () => {
    return shouldDownload() ? 'Download' : 'View';
  };

  const getActionIcon = () => {
    return shouldDownload()
      ? <FaDownload className="w-4 h-4 ml-2" />
      : <FaEye className="w-4 h-4 ml-2" />;
  };

  // Use timestamp from various possible properties with fallback
  const createdDate = safeContent.createdAt ||
    safeContent.created_at ||
    safeContent.uploadedAt ||
    safeContent.timestamp || null;

  // Format file size safely
  const formatFileSize = () => {
    const fileSize = safeContent.fileSize || safeContent.file_size;
    if (!fileSize) return null;

    try {
      if (typeof fileSize === 'number') {
        return `${(fileSize / 1024 / 1024).toFixed(2)} MB`;
      }
      return fileSize.toString();
    } catch (error) {
      return 'Unknown Size';
    }
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg border border-gray-200 h-full flex flex-col">
      {/* Group Title Banner (if part of a group) */}
      {groupTitle && (
        <div className="bg-gradient-to-r from-indigo-100 to-blue-100 px-4 py-2 flex items-center">
          <FaLayerGroup className="text-indigo-500 mr-2 flex-shrink-0" />
          <span className="text-sm font-medium text-indigo-800 truncate">{groupTitle}</span>
        </div>
      )}

      <div className="p-3 sm:p-4 md:p-5 flex flex-col flex-grow">
        {/* Header with file icon and title */}
        <div className="flex items-start mb-3 sm:mb-4">
          <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-100 mr-3 sm:mr-4 flex-shrink-0">
            {getFileIcon()}
          </div>
          <div className="flex-grow min-w-0">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 truncate">
              {safeContent.title || 'Untitled Document'}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Added on {formatDate(createdDate)}
            </p>
          </div>
          {isAdmin && (
            <button
              onClick={handleDeleteClick}
              className="text-gray-400 hover:text-red-500 transition-colors p-1 sm:p-2 ml-1 sm:ml-2 flex-shrink-0"
              aria-label="Delete content"
              title="Delete content"
            >
              <FaTrash />
            </button>
          )}
        </div>

        {/* File type badge */}
        <div className="mb-2 sm:mb-3">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {getFileType() || 'UNKNOWN'}
          </span>
        </div>

        {/* Description */}
        <div className="mb-3 sm:mb-4 flex-grow">
          <p className="text-gray-600 text-xs sm:text-sm line-clamp-3">
            {safeContent.description || 'No description available'}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex justify-between items-center pt-2 mt-auto">
          <a
            href={safeContent.fileUrl || safeContent.file_url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm rounded-lg hover:from-blue-700 hover:to-blue-800 shadow-sm transition-all duration-200"
          >
            {getActionButtonText()}
            {getActionIcon()}
          </a>

          {/* File size if available */}
          {formatFileSize() && (
            <span className="text-xs text-gray-500">
              {formatFileSize()}
            </span>
          )}
        </div>

        {/* Delete confirmation modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-4 sm:p-6 max-w-md w-full shadow-xl">
              <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-gray-800">Confirm Deletion</h3>
              <p className="mb-5 sm:mb-6 text-gray-600 text-sm sm:text-base">
                Are you sure you want to delete "<span className="font-semibold">{safeContent.title || 'this content'}</span>"? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={cancelDelete}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentCard;