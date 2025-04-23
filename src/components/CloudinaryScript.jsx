// src/components/CloudinaryScript.jsx
import { useEffect } from 'react';

// This component loads the Cloudinary upload widget script
const CloudinaryScript = () => {
  useEffect(() => {
    // Check if script is already loaded
    if (!document.getElementById('cloudinary-widget-script')) {
      const script = document.createElement('script');
      script.id = 'cloudinary-widget-script';
      script.src = 'https://widget.cloudinary.com/v2.0/global/all.js';
      script.type = 'text/javascript';
      script.async = true;
      document.body.appendChild(script);

      return () => {
        // Remove script on unmount to avoid duplicates
        const existingScript = document.getElementById('cloudinary-widget-script');
        if (existingScript) {
          document.body.removeChild(existingScript);
        }
      };
    }
  }, []);

  return null; // This component doesn't render anything
};

export default CloudinaryScript;