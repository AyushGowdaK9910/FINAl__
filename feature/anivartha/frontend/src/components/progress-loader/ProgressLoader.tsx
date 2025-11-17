/**
 * CON-8: Progress Loader Component
 * Shows real-time upload/conversion progress
 */

import React from 'react';

interface ProgressLoaderProps {
  progress: number;
  message?: string;
}

export const ProgressLoader: React.FC<ProgressLoaderProps> = ({
  progress,
  message = 'Processing...',
}) => {
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">{message}</span>
        <span className="text-sm text-gray-500">{progress}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

