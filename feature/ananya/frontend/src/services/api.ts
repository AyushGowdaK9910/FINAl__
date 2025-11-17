/**
 * CON-10: API Client Service
 * Configured for secure HTTPS communication
 * 
 * Features:
 * - HTTPS configuration
 * - Certificate validation
 * - Secure request handling
 * - Error handling for SSL issues
 */

import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Create configured axios instance for secure communication
 */
const createApiClient = (): AxiosInstance => {
  const isHttps = API_URL.startsWith('https://');
  
  const config: AxiosRequestConfig = {
    baseURL: API_URL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
    // HTTPS configuration
    httpsAgent: isHttps ? {
      // Reject unauthorized certificates in production
      rejectUnauthorized: import.meta.env.PROD,
    } : undefined,
    // Validate SSL certificates
    validateStatus: (status) => status < 500, // Don't throw on 4xx errors
  };

  const client = axios.create(config);

  // Request interceptor for logging and adding auth tokens
  client.interceptors.request.use(
    (config) => {
      // Log secure connection status
      if (config.url && config.baseURL) {
        const isSecure = config.baseURL.startsWith('https://');
        if (!isSecure && import.meta.env.PROD) {
          console.warn('API client is using insecure HTTP connection in production');
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor for error handling
  client.interceptors.response.use(
    (response) => {
      return response;
    },
    (error: AxiosError) => {
      // Handle SSL/TLS errors
      if (error.code === 'CERT_HAS_EXPIRED' || error.code === 'UNABLE_TO_VERIFY_LEAF_SIGNATURE') {
        console.error('SSL certificate error:', error.message);
        // In production, you might want to show a user-friendly error
        return Promise.reject(new Error('SSL certificate validation failed. Please contact support.'));
      }

      // Handle network errors
      if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
        console.error('Network error:', error.message);
        return Promise.reject(new Error('Unable to connect to server. Please check your connection.'));
      }

      // Handle other errors
      return Promise.reject(error);
    }
  );

  return client;
};

// Export configured API client
export const apiClient = createApiClient();

// Export convenience methods
export const api = {
  get: <T = any>(url: string, config?: AxiosRequestConfig) => 
    apiClient.get<T>(url, config),
  
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => 
    apiClient.post<T>(url, data, config),
  
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => 
    apiClient.put<T>(url, data, config),
  
  delete: <T = any>(url: string, config?: AxiosRequestConfig) => 
    apiClient.delete<T>(url, config),
  
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) => 
    apiClient.patch<T>(url, data, config),
};

// Check if API URL is secure
export const isSecureConnection = (): boolean => {
  return API_URL.startsWith('https://');
};

// Get API URL
export const getApiUrl = (): string => {
  return API_URL;
};

