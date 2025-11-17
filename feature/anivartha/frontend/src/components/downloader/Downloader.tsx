/**
 * CON-3: File Downloader Component
 * Features:
 * - File download by ID
 * - Download status tracking
 * - Error handling and display
 * - Progress indication
 */

import React, { useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const Downloader: React.FC = () => {
  const [fileId, setFileId] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleDownload = async () => {
    if (!fileId.trim()) {
      setError('Please enter a file ID');
      setSuccess(false);
      return;
    }

    setDownloading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await axios.get(`${API_URL}/api/download/${fileId}`, {
        responseType: 'blob',
        onDownloadProgress: (progressEvent) => {
          // Progress tracking for download status
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            console.log(`Download progress: ${percentCompleted}%`);
          }
        },
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // Get filename from Content-Disposition header
      const contentDisposition = response.headers['content-disposition'];
      let filename = `download_${fileId}`;
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/i);
        if (filenameMatch) {
          filename = decodeURIComponent(filenameMatch[1]);
        }
      }
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000); // Clear success message after 3 seconds
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 
                          err.response?.data?.message || 
                          'Download failed';
      setError(errorMessage);
      console.error('Download error:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Download File</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          File ID
        </label>
        <input
          type="text"
          value={fileId}
          onChange={(e) => setFileId(e.target.value)}
          placeholder="Enter file ID"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={downloading}
        />
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700">
          <strong>Error:</strong> {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-green-700">
          File downloaded successfully!
        </div>
      )}

      <button
        onClick={handleDownload}
        disabled={!fileId.trim() || downloading}
        className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {downloading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Downloading...
          </span>
        ) : (
          'Download File'
        )}
      </button>
    </div>
  );
};

