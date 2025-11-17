/**
 * CON-5: Validation Errors Component
 */

import React from 'react';

interface ValidationErrorsProps {
  errors: string[];
}

export const ValidationErrors: React.FC<ValidationErrorsProps> = ({ errors }) => {
  if (!errors || errors.length === 0) {
    return null;
  }

  return (
    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded">
      <h3 className="text-red-800 font-semibold mb-2">Validation Errors:</h3>
      <ul className="list-disc list-inside space-y-1">
        {errors.map((error, index) => (
          <li key={index} className="text-red-700 text-sm">
            {error}
          </li>
        ))}
      </ul>
    </div>
  );
};

