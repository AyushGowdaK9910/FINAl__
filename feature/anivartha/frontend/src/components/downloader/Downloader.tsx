/**
 * CON-3: File Downloader Component
 */

import React, { useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const Downloader: React.FC = () => {
  const [fileId, setFileId] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    if (!fileId.trim()) {
      setError('Please enter a file ID');
      return;
    }

    setDownloading(true);
    setError(null);

    try {
      const response = await axios.get(`${API_URL}/api/download/${fileId}`, {
        responseType: 'blob',
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
          filename = filenameMatch[1];
        }
      }
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Download failed');
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
          {error}
        </div>
      )}

      <button
        onClick={handleDownload}
        disabled={!fileId.trim() || downloading}
        className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {downloading ? 'Downloading...' : 'Download File'}
      </button>
    </div>
  );
};

