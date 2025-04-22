// src/LMSComponents/ContentCard.jsx
import React from 'react';
import { FaFilePdf, FaFileWord, FaFilePowerpoint, FaImage, FaVideo, FaExternalLinkAlt } from 'react-icons/fa';

const ContentCard = ({ content }) => {
  const getFileIcon = () => {
    const fileType = content.fileType;
    
    switch (fileType) {
      case 'pdf':
        return <FaFilePdf className="text-red-500 text-4xl" />;
      case 'doc':
      case 'docx':
        return <FaFileWord className="text-blue-500 text-4xl" />;
      case 'ppt':
      case 'pptx':
        return <FaFilePowerpoint className="text-orange-500 text-4xl" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
        return <FaImage className="text-green-500 text-4xl" />;
      case 'mp4':
      case 'mov':
      case 'avi':
        return <FaVideo className="text-purple-500 text-4xl" />;
      default:
        return <FaExternalLinkAlt className="text-gray-500 text-4xl" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="p-6">
        <div className="flex items-start mb-4">
          <div className="mr-4">
            {getFileIcon()}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{content.title}</h3>
            <p className="text-sm text-gray-500 mt-1">Added on {formatDate(content.createdAt)}</p>
          </div>
        </div>
        
        <div className="mb-4">
          <p className="text-gray-600 line-clamp-3">{content.description}</p>
        </div>
        
        <a 
          href={content.fileUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          {content.fileType === 'pdf' || content.fileType === 'doc' || content.fileType === 'docx' || content.fileType === 'ppt' || content.fileType === 'pptx' ? 'Download' : 'View'}
          <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default ContentCard;

