// src/utils/cloudinaryUtils.js

/**
 * Uploads a file to Cloudinary
 * @param {File} file - The file to upload
 * @param {string} folder - Optional folder path in Cloudinary
 * @returns {Promise<Object>} - Cloudinary response with URL and other data
 */
import { v2 as cloudinary } from 'cloudinary';
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
export const uploadToCloudinary = async (file, folder = "lms_uploads") => {
    const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
        throw new Error("Cloudinary configuration is missing");
    }

    const url = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append("folder", folder);

    try {
        const response = await fetch(url, {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            throw new Error("Upload failed");
        }

        const data = await response.json();
        return {
            publicId: data.public_id,
            url: data.secure_url,
            format: data.format,
            resourceType: data.resource_type,
            createdAt: new Date().toISOString()
        };
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        throw error;
    }
};

/**
 * Helper function to determine appropriate folder based on file type
 * @param {File} file - The file to analyze
 * @returns {string} - Folder path for Cloudinary
 */
export const getCloudinaryFolder = (file) => {
    const type = file.type.split('/')[0];

    switch (type) {
        case 'image':
            return 'lms_images';
        case 'video':
            return 'lms_videos';
        case 'application':
            return file.type.includes('pdf') ? 'lms_pdfs' : 'lms_documents';
        default:
            return 'lms_misc';
    }
};

/**
 * Create a Cloudinary video player URL with options
 * @param {string} publicId - Cloudinary public ID
 * @param {Object} options - Player options
 * @returns {string} - Formatted video player URL
 */
export const createVideoPlayerUrl = (publicId, options = {}) => {
    const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;

    // Default video player options
    const defaultOptions = {
        controls: true,
        autoplay: false,
        loop: false,
    };

    const playerOptions = { ...defaultOptions, ...options };
    const transformations = [];

    if (playerOptions.controls) transformations.push('controls');
    if (playerOptions.autoplay) transformations.push('autoplay');
    if (playerOptions.loop) transformations.push('loop');

    const transformString = transformations.length > 0 ?
        transformations.join(',') + '/' : '';

    return `https://res.cloudinary.com/${cloudName}/video/upload/${transformString}${publicId}`;
};
export { cloudinary };
