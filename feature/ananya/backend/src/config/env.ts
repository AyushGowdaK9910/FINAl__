/**
 * CON-10: Environment Configuration
 * Centralized configuration for environment variables
 * Includes TLS/SSL configuration
 */

import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Server configuration
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // HTTPS/TLS configuration
  enableHttps: process.env.ENABLE_HTTPS === 'true',
  sslCertPath: process.env.SSL_CERT_PATH,
  sslKeyPath: process.env.SSL_KEY_PATH,
  sslCaPath: process.env.SSL_CA_PATH, // Optional: Certificate Authority chain
  
  // Security configuration
  hstsMaxAge: process.env.HSTS_MAX_AGE || '31536000', // 1 year in seconds
  cspPolicy: process.env.CSP_POLICY,
  
  // Logging configuration
  logRetentionDays: parseInt(process.env.LOG_RETENTION_DAYS || '365', 10),
  logDirectory: process.env.LOG_DIRECTORY || './logs',
  
  // CORS configuration
  corsOrigin: process.env.CORS_ORIGIN || '*',
};

/**
 * Validate TLS/SSL configuration
 */
export const validateTLSConfig = (): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (config.enableHttps) {
    if (!config.sslCertPath) {
      errors.push('SSL_CERT_PATH is required when ENABLE_HTTPS is true');
    }
    if (!config.sslKeyPath) {
      errors.push('SSL_KEY_PATH is required when ENABLE_HTTPS is true');
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
};

