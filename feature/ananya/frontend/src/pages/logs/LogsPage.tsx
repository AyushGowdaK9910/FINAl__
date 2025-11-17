/**
 * CON-4: Admin UI Log Viewer Page
 * 
 * Features:
 * - Display list of all log files
 * - Select and view log file contents
 * - Loading and error states
 * - File metadata display
 */

import React, { useState, useEffect } from 'react';
import { LogTable } from '../../components/log-table/LogTable';
import { HttpsWarningBanner } from '../../components/https-warning-banner/HttpsWarningBanner';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface LogFile {
  filename: string;
  size: number;
  modified: string;
  created: string;
}

export const LogsPage: React.FC = () => {
  const [logFiles, setLogFiles] = useState<LogFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchLogFiles();
  }, []);

  const fetchLogFiles = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_URL}/api/logs`);
      if (response.data.success) {
        setLogFiles(response.data.logs);
      } else {
        setError('Failed to fetch log files');
      }
    } catch (err) {
      setError('Failed to fetch log files');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchLogFiles();
    setRefreshing(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <HttpsWarningBanner />
      
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Log Viewer</h1>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
            <button
              onClick={fetchLogFiles}
              className="ml-4 text-red-800 underline"
            >
              Retry
            </button>
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">
              Log Files ({logFiles.length})
            </h2>
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <p>Loading log files...</p>
              </div>
            ) : logFiles.length === 0 ? (
              <p className="text-gray-500">No log files found</p>
            ) : (
              <div className="space-y-2">
                {logFiles.map((file) => (
                  <div
                    key={file.filename}
                    className={`p-3 border rounded cursor-pointer hover:bg-gray-50 ${
                      selectedFile === file.filename ? 'bg-blue-50 border-blue-500' : ''
                    }`}
                    onClick={() => setSelectedFile(file.filename)}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-sm">{file.filename}</span>
                      <span className="text-xs text-gray-500">
                        {(file.size / 1024).toFixed(2)} KB
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Modified: {new Date(file.modified).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedFile && (
            <div className="mt-6">
              <LogTable filename={selectedFile} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

