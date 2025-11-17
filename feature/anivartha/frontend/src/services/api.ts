/**
 * CON-1: API Service
 * Handles all API communication with the backend
 */

import axios, { AxiosInstance, AxiosError, AxiosProgressEvent } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface UploadResult {
  success: boolean;
  file?: {
    id: string;
    filename: string;
    originalName: string;
    size: number;
    path: string;
    mimeType: string;
  };
  error?: string;
  errors?: string[];
}

export interface UploadProgressCallback {
  (progress: number): void;
}

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      timeout: 300000, // 5 minutes for large file uploads
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        // Handle network errors
        if (!error.response) {
          return Promise.reject({
            message: 'Network error. Please check your connection.',
            type: 'network',
          });
        }

        // Handle HTTP errors
        const status = error.response.status;
        let message = 'An error occurred';

        switch (status) {
          case 400:
            message = 'Invalid request. Please check your file.';
            break;
          case 413:
            message = 'File is too large. Maximum size is 50MB.';
            break;
          case 415:
            message = 'Unsupported file type.';
            break;
          case 500:
            message = 'Server error. Please try again later.';
            break;
          default:
            message = error.response.data?.error || 'An unexpected error occurred';
        }

        return Promise.reject({
          message,
          status,
          data: error.response.data,
          type: 'http',
        });
      }
    );
  }

  /**
   * Upload a file with progress tracking
   */
  async uploadFile(
    file: File,
    onProgress?: UploadProgressCallback
  ): Promise<UploadResult> {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await this.client.post<UploadResult>(
        '/api/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent: AxiosProgressEvent) => {
            if (progressEvent.total && onProgress) {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              onProgress(percentCompleted);
            }
          },
        }
      );

      return response.data;
    } catch (error: any) {
      throw {
        success: false,
        error: error.message || 'Upload failed',
        errors: error.data?.errors || [error.message],
      };
    }
  }

  /**
   * Get upload status by file ID
   */
  async getUploadStatus(fileId: string): Promise<UploadResult> {
    try {
      const response = await this.client.get<UploadResult>(
        `/api/upload/status/${fileId}`
      );
      return response.data;
    } catch (error: any) {
      throw {
        success: false,
        error: error.message || 'Failed to get upload status',
      };
    }
  }
}

export const apiService = new ApiService();

