/**
 * CON-1: File Upload Component
 */

import React, { useState, useRef } from 'react';
import axios from 'axios';
import { ValidationErrors } from '../validation-errors/ValidationErrors';
import { ProgressLoader } from '../progress-loader/ProgressLoader';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface UploadResult {
  success: boolean;
  file?: {
    id: string;
    filename: string;
    originalName: string;
    size: number;
  };
  error?: string;
  errors?: string[];
}

export const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<UploadResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setProgress(0);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post<UploadResult>(`${API_URL}/api/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percentCompleted);
          }
        },
      });

      setResult(response.data);
      if (response.data.success) {
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    } catch (error: any) {
      setResult({
        success: false,
        error: error.response?.data?.error || 'Upload failed',
        errors: error.response?.data?.errors,
      });
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Upload File</h2>

      <div className="mb-4">
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          disabled={uploading}
        />
      </div>

      {file && (
        <div className="mb-4 p-3 bg-gray-50 rounded">
          <p className="text-sm">
            <strong>Selected:</strong> {file.name} ({(file.size / 1024).toFixed(2)} KB)
          </p>
        </div>
      )}

      {uploading && <ProgressLoader progress={progress} />}

      {result && !result.success && <ValidationErrors errors={result.errors || [result.error!]} />}

      {result && result.success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
          <p className="text-green-800">File uploaded successfully!</p>
          <p className="text-sm text-green-600 mt-1">File ID: {result.file?.id}</p>
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {uploading ? 'Uploading...' : 'Upload File'}
      </button>
    </div>
  );
};

