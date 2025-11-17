/**
 * CON-5: Validation Errors Component
 * Displays validation error messages with styling and formatting
 * Integrates with upload component to show file validation failures
 */

import React from 'react';

interface ValidationErrorsProps {
  errors: string[];
  detectedMimeType?: string;
  detectedExtension?: string;
}

export const ValidationErrors: React.FC<ValidationErrorsProps> = ({ 
  errors, 
  detectedMimeType,
  detectedExtension 
}) => {
  if (!errors || errors.length === 0) {
    return null;
  }

  return (
    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg shadow-sm">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-red-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-red-800 font-semibold mb-2 text-lg">
            Validation Errors
          </h3>
          <ul className="list-disc list-inside text-red-700 space-y-1">
            {errors.map((error, index) => (
              <li key={index} className="text-sm">{error}</li>
            ))}
          </ul>
          {(detectedMimeType || detectedExtension) && (
            <div className="mt-3 pt-3 border-t border-red-200">
              <p className="text-xs text-red-600">
                <strong>Detected:</strong>{' '}
                {detectedMimeType && `MIME: ${detectedMimeType}`}
                {detectedMimeType && detectedExtension && ' • '}
                {detectedExtension && `Extension: .${detectedExtension}`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

