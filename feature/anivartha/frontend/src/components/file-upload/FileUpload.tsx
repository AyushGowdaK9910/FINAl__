/**
 * CON-1: File Upload Component
 * Features:
 * - Drag and drop file upload
 * - File preview before upload
 * - Upload progress display
 * - Error handling and validation
 */

import React, { useState, useRef, useCallback } from 'react';
import { apiService, UploadResult } from '../../services/api';
import { ValidationErrors } from '../validation-errors/ValidationErrors';
import { ProgressLoader } from '../progress-loader/ProgressLoader';

export const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFile: File) => {
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
      
      // Generate preview for images
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setPreview(null);
      }
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFileSelect(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setProgress(0);
    setResult(null);

    try {
      const response = await apiService.uploadFile(file, (progressValue) => {
        setProgress(progressValue);
      });

      setResult(response);
      if (response.success) {
        setFile(null);
        setPreview(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    } catch (error: any) {
      // Enhanced error handling with detailed messages
      const errorMessage = error.message || error.error || 'Upload failed';
      const errorList = error.errors || [errorMessage];
      
      setResult({
        success: false,
        error: errorMessage,
        errors: errorList,
      });
      
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      handleFileSelect(droppedFile);
    }
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Upload File</h2>

      <div
        className={`mb-4 border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={onFileInputChange}
          className="hidden"
          id="file-upload"
          disabled={uploading}
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer block"
        >
          <div className="text-gray-600">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 mb-4"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="text-lg font-medium">
              {isDragging ? 'Drop file here' : 'Drag and drop file here'}
            </p>
            <p className="text-sm mt-2">or</p>
            <button
              type="button"
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={() => fileInputRef.current?.click()}
            >
              Browse Files
            </button>
          </div>
        </label>
      </div>

      {file && (
        <div className="mb-4 p-3 bg-gray-50 rounded">
          <p className="text-sm mb-2">
            <strong>Selected:</strong> {file.name} ({(file.size / 1024).toFixed(2)} KB)
          </p>
          {preview && (
            <div className="mt-2">
              <img
                src={preview}
                alt="Preview"
                className="max-w-full h-48 object-contain rounded border"
              />
            </div>
          )}
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

