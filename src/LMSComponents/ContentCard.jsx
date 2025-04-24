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
  FaEye
} from 'react-icons/fa';

const ContentCard = ({ content, isAdmin = false, groupTitle = null, onDelete }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const getFileIcon = () => {
    const fileType = content.fileType || content.file_type || content.contentType;
    
    switch (fileType) {
      case 'pdf':
        return <FaFilePdf className="text-red-500 text-4xl" />;
      case 'doc':
      case 'docx':
      case 'word':
        return <FaFileWord className="text-blue-500 text-4xl" />;
      case 'ppt':
      case 'pptx':
        return <FaFilePowerpoint className="text-orange-500 text-4xl" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'image':
        return <FaImage className="text-green-500 text-4xl" />;
      case 'mp4':
      case 'mov':
      case 'avi':
      case 'video':
        return <FaVideo className="text-purple-500 text-4xl" />;
      default:
        return <FaExternalLinkAlt className="text-gray-500 text-4xl" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown Date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (onDelete && typeof onDelete === 'function') {
      onDelete(content.id);
    }
    setShowDeleteModal(false);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  const getActionButtonText = () => {
    const fileType = content.fileType || content.file_type || content.contentType;
    const downloadTypes = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx'];
    
    return downloadTypes.includes(fileType) ? 'Download' : 'View';
  };

  const getActionIcon = () => {
    const fileType = content.fileType || content.file_type || content.contentType;
    const downloadTypes = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx'];
    
    return downloadTypes.includes(fileType) ? <FaDownload className="w-4 h-4 ml-2" /> : <FaEye className="w-4 h-4 ml-2" />;
  };

  // Use timestamp from various possible properties
  const createdDate = content.createdAt || content.created_at || content.uploadedAt || content.timestamp;

  return (
    <div className={`bg-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg ${
      groupTitle ? 'border border-gray-200' : 'shadow-md'
    }`}>
      {/* Group Title Banner (if part of a group) */}
      {groupTitle && (
        <div className="bg-gradient-to-r from-indigo-100 to-blue-100 px-4 py-2 flex items-center">
          <FaLayerGroup className="text-indigo-500 mr-2" />
          <span className="text-sm font-medium text-indigo-800">{groupTitle}</span>
        </div>
      )}
      
      <div className="p-5">
        {/* Header with file icon and title */}
        <div className="flex items-start mb-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mr-4">
            {getFileIcon()}
          </div>
          <div className="flex-grow">
            <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">{content.title}</h3>
            <p className="text-xs text-gray-500 mt-1">Added on {formatDate(createdDate)}</p>
          </div>
          {isAdmin && (
            <button 
              onClick={handleDeleteClick}
              className="text-gray-400 hover:text-red-500 transition-colors p-2"
              aria-label="Delete content"
              title="Delete content"
            >
              <FaTrash />
            </button>
          )}
        </div>

        {/* File type badge */}
        <div className="mb-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {(content.fileType || content.file_type || content.contentType || '').toUpperCase()}
          </span>
        </div>

        {/* Description */}
        <div className="mb-4">
          <p className="text-gray-600 text-sm line-clamp-3">{content.description}</p>
        </div>

        {/* Action buttons */}
        <div className="flex justify-between items-center pt-2">
          <a
            href={content.fileUrl || content.file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 shadow-sm transition-all duration-200"
          >
            {getActionButtonText()}
            {getActionIcon()}
          </a>
          
          {/* File size if available */}
          {(content.fileSize || content.file_size) && (
            <span className="text-xs text-gray-500">
              {typeof (content.fileSize || content.file_size) === 'number' 
                ? `${((content.fileSize || content.file_size) / 1024 / 1024).toFixed(2)} MB`
                : (content.fileSize || content.file_size)
              }
            </span>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Confirm Deletion</h3>
            <p className="mb-6 text-gray-600">Are you sure you want to delete "<span className="font-semibold">{content.title}</span>"? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={cancelDelete}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentCard;