/**
 * CON-4: Centralized Logging Engine
 * Winston-based logger with daily rotation and 1-year retention
 * 
 * Features:
 * - Daily log file rotation
 * - Automatic compression of old logs
 * - Separate error log files
 * - Exception and rejection handlers
 * - Configurable log levels
 * - JSON and console formatting
 */

import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';

const logDir = path.join(process.cwd(), 'logs');

// Create log directory if it doesn't exist
const fs = require('fs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Configure log retention (1 year = 365 days)
const LOG_RETENTION_DAYS = parseInt(process.env.LOG_RETENTION_DAYS || '365', 10);
const LOG_MAX_SIZE = process.env.LOG_MAX_SIZE || '20m';
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

// Daily rotate file transport with 1-year retention
// Automatically rotates logs daily and compresses old files
const dailyRotateFileTransport = new DailyRotateFile({
  filename: path.join(logDir, 'application-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true, // Compress old log files
  maxSize: LOG_MAX_SIZE,
  maxFiles: `${LOG_RETENTION_DAYS}d`, // Keep logs for configured retention period (default 1 year)
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
});

// Separate error log transport for error-level logs only
// Provides dedicated error log files for easier debugging
const errorRotateFileTransport = new DailyRotateFile({
  filename: path.join(logDir, 'error-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: LOG_MAX_SIZE,
  maxFiles: `${LOG_RETENTION_DAYS}d`, // Keep error logs for configured retention period
  level: 'error', // Only log error level and above
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
});

/**
 * Main logger instance
 * Configured with multiple transports for comprehensive logging
 */
export const logger = winston.createLogger({
  level: LOG_LEVEL, // Configurable log level (default: info)
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }), // Include stack traces for errors
    winston.format.splat(), // String interpolation
    winston.format.json() // JSON format for structured logging
  ),
  defaultMeta: { 
    service: 'file-converter-backend',
    environment: process.env.NODE_ENV || 'development'
  },
  transports: [
    // Daily rotating file transport for all logs
    dailyRotateFileTransport,
    // Separate error log file
    errorRotateFileTransport,
    // Console transport with colorized output for development
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(), // Colorize log levels
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
          return `${timestamp} [${level}]: ${message} ${
            Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
          }`;
        })
      ),
    }),
  ],
  // Handle uncaught exceptions
  exceptionHandlers: [
    new DailyRotateFile({
      filename: path.join(logDir, 'exceptions-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxFiles: `${LOG_RETENTION_DAYS}d`,
      zippedArchive: true,
    }),
  ],
  // Handle unhandled promise rejections
  rejectionHandlers: [
    new DailyRotateFile({
      filename: path.join(logDir, 'rejections-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxFiles: `${LOG_RETENTION_DAYS}d`,
      zippedArchive: true,
    }),
  ],
});

