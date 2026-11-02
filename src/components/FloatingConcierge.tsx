import React, { useEffect } from 'react';

const TIDIO_SCRIPT_URL = '//code.tidio.co/tzmeafgep09qormcxomn5elaamg7ds7n.js';

export const FloatingConcierge: React.FC = () => {
  useEffect(() => {
    // Ensure Tidio live chat script is mounted
    const existingScript = document.querySelector('script[src*="code.tidio.co"]');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = TIDIO_SCRIPT_URL;
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  return null;
};
