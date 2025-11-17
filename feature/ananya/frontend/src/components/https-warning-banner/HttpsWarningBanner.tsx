/**
 * CON-10: HTTPS Warning Banner Component
 * 
 * Features:
 * - Detects HTTP vs HTTPS protocol
 * - Visual warning indicator
 * - Dismissible banner
 * - Integrates with app layout
 */

import React, { useState, useEffect } from 'react';

export const HttpsWarningBanner: React.FC = () => {
  const [isSecure, setIsSecure] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if connection is secure
    const checkSecurity = () => {
      const isHttps = window.location.protocol === 'https:';
      setIsSecure(isHttps);
    };

    checkSecurity();

    // Listen for protocol changes (if any)
    window.addEventListener('load', checkSecurity);
    return () => window.removeEventListener('load', checkSecurity);
  }, []);

  if (isSecure || isDismissed) {
    return null;
  }

  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 relative">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-yellow-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium">
            Warning: You are accessing this site over an insecure connection (HTTP).
            For secure communication, please use HTTPS.
          </p>
          <p className="text-xs mt-1 text-yellow-600">
            Your data may be vulnerable to interception. Switch to HTTPS for secure communication.
          </p>
        </div>
        <button
          onClick={() => setIsDismissed(true)}
          className="ml-4 text-yellow-700 hover:text-yellow-900"
          aria-label="Dismiss warning"
        >
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

