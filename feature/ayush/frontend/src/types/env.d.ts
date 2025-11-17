/// <reference types="vite/client" />

/**
 * Vite Environment Variables Type Definitions
 * This file provides TypeScript types for Vite's import.meta.env
 */

interface ImportMetaEnv {
  /**
   * API base URL for backend services
   * @example 'http://localhost:3000'
   * @example 'https://api.example.com'
   */
  readonly VITE_API_URL?: string;
  
  /**
   * Application environment
   * @example 'development' | 'production' | 'staging'
   */
  readonly VITE_APP_ENV?: string;
  
  /**
   * Application version
   */
  readonly VITE_APP_VERSION?: string;
  
  /**
   * Enable/disable debug mode
   */
  readonly VITE_DEBUG?: string;
  
  // Add more environment variables as needed
  readonly [key: string]: any;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

