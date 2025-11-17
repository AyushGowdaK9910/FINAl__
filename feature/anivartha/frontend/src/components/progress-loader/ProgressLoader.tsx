/**
 * CON-8: Progress Loader Component
 * Features:
 * - Real-time progress updates
 * - Animated progress indicator
 * - Loading states and messages
 * - Smooth transitions
 */

import React, { useEffect, useState } from 'react';

interface ProgressLoaderProps {
  progress: number;
  message?: string;
  showSpinner?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const ProgressLoader: React.FC<ProgressLoaderProps> = ({
  progress,
  message = 'Processing...',
  showSpinner = false,
  size = 'md',
}) => {
  const [displayProgress, setDisplayProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  // Smooth progress animation for real-time updates
  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayProgress(progress);
      if (progress >= 100) {
        setIsComplete(true);
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [progress]);

  const heightClass = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  }[size];

  return (
    <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          {showSpinner && !isComplete && (
            <svg
              className="animate-spin h-4 w-4 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          )}
          <span className="text-sm font-medium text-gray-700">{message}</span>
        </div>
        <span className="text-sm font-semibold text-gray-600">{Math.round(displayProgress)}%</span>
      </div>
      
      {/* Animated progress bar with smooth transitions */}
      <div className={`w-full bg-gray-200 rounded-full ${heightClass} overflow-hidden`}>
        <div
          className={`${
            isComplete ? 'bg-green-600' : 'bg-blue-600'
          } ${heightClass} rounded-full transition-all duration-300 ease-out relative`}
          style={{ width: `${displayProgress}%` }}
        >
          {/* Shimmer effect for loading state */}
          {!isComplete && displayProgress > 0 && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer"></div>
          )}
        </div>
      </div>

      {/* Success indicator */}
      {isComplete && (
        <div className="mt-2 flex items-center gap-2 text-green-600">
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span className="text-xs font-medium">Complete!</span>
        </div>
      )}
    </div>
  );
};

