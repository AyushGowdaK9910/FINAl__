/**
 * CON-12: API Documentation Page
 */

import React, { useState, useEffect } from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import { HealthStatusWidget } from '../../components/health-status-widget/HealthStatusWidget';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const ApiDocsPage: React.FC = () => {
  const [spec, setSpec] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchApiSpec();
  }, []);

  const fetchApiSpec = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api-docs.json`);
      if (!response.ok) {
        throw new Error('Failed to fetch API spec');
      }
      const data = await response.json();
      setSpec(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load API documentation');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">Loading API documentation...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow mb-4 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold">API Documentation</h1>
          <HealthStatusWidget />
        </div>
      </div>
      <div className="max-w-7xl mx-auto">
        {spec && <SwaggerUI spec={spec} />}
      </div>
    </div>
  );
};

