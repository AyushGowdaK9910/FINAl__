/**
 * CON-12: Frontend API Documentation Page
 * Features:
 * - Install swagger-ui-react
 * - Build API documentation viewer component
 * - Fetch and display Swagger spec
 * - Add loading and error states
 */

import React, { useState, useEffect } from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export const ApiDocsPage: React.FC = () => {
  const [spec, setSpec] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch Swagger spec from backend
    const fetchSpec = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${API_URL}/api-docs.json`);
        if (!response.ok) {
          throw new Error(`Failed to fetch API docs: ${response.statusText}`);
        }
        
        const data = await response.json();
        setSpec(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load API documentation');
        console.error('Error fetching API docs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSpec();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading API documentation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
          <div className="text-red-600 mb-4">
            <svg className="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Documentation</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-800">API Documentation</h1>
          <p className="text-gray-600 mt-1">Interactive API reference and testing interface</p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-6">
        {spec && (
          <div className="bg-white rounded-lg shadow">
            <SwaggerUI spec={spec} />
          </div>
        )}
      </div>
    </div>
  );
};

