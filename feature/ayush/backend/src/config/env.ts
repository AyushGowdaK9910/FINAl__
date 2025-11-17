/**
 * CON-17: Environment Configuration
 * Creates environment variable loader with configuration interface
 * 
 * Features:
 * - Type-safe environment variable access
 * - Default values for all variables
 * - Validation of required variables
 * - Documentation of required environment variables
 */

import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * Environment configuration interface
 * Defines all environment variables with their types
 */
export interface EnvConfig {
  // Server Configuration
  port: number;
  host: string;
  nodeEnv: 'development' | 'production' | 'test';

  // CORS Configuration
  corsOrigin: string;

  // API Documentation
  apiDocsEnabled: boolean;

  // Health Check
  healthCheckEnabled: boolean;

  // Logging
  logLevel: 'error' | 'warn' | 'info' | 'debug';
}

/**
 * Get environment variable with default value
 */
const getEnv = (key: string, defaultValue: string): string => {
  return process.env[key] || defaultValue;
};

/**
 * Get boolean environment variable
 */
const getBooleanEnv = (key: string, defaultValue: boolean): boolean => {
  const value = process.env[key];
  if (value === undefined) return defaultValue;
  return value.toLowerCase() === 'true' || value === '1';
};

/**
 * Get number environment variable
 */
const getNumberEnv = (key: string, defaultValue: number): number => {
  const value = process.env[key];
  if (value === undefined) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
};

/**
 * Environment configuration object
 * Set up default values for all configuration options
 */
export const env: EnvConfig = {
  // Server Configuration
  port: getNumberEnv('PORT', 3000),
  host: getEnv('HOST', '0.0.0.0'),
  nodeEnv: (getEnv('NODE_ENV', 'development') as 'development' | 'production' | 'test'),

  // CORS Configuration
  corsOrigin: getEnv('CORS_ORIGIN', '*'),

  // API Documentation
  apiDocsEnabled: getBooleanEnv('API_DOCS_ENABLED', true),

  // Health Check
  healthCheckEnabled: getBooleanEnv('HEALTH_CHECK_ENABLED', true),

  // Logging
  logLevel: (getEnv('LOG_LEVEL', 'info') as 'error' | 'warn' | 'info' | 'debug'),
};

/**
 * Validate required environment variables
 * Throws error if critical variables are missing
 */
export const validateEnv = (): void => {
  const required: string[] = [];

  // Add required environment variables here
  // Example: if (!process.env.DATABASE_URL) required.push('DATABASE_URL');

  if (required.length > 0) {
    throw new Error(
      `Missing required environment variables: ${required.join(', ')}\n` +
      'Please check your .env file or environment configuration.'
    );
  }
};

/**
 * Get environment configuration summary
 * Useful for debugging and logging
 */
export const getEnvSummary = (): Record<string, unknown> => {
  return {
    port: env.port,
    host: env.host,
    nodeEnv: env.nodeEnv,
    corsOrigin: env.corsOrigin,
    apiDocsEnabled: env.apiDocsEnabled,
    healthCheckEnabled: env.healthCheckEnabled,
    logLevel: env.logLevel,
  };
};

// Validate environment on module load
if (env.nodeEnv === 'production') {
  validateEnv();
}

