/**
 * CON-10: Main server entry with HTTPS support
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { logger } from './utils/logger';
import { httpsEnforcement, securityHeaders } from './middleware/https.middleware';
import logsRoutes from './routes/logs.routes';
import { LogRetentionService } from './services/logRetention.service';
import { config, validateTLSConfig } from './config/env';

dotenv.config();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// CON-10: HTTPS enforcement and security headers
if (config.enableHttps) {
  app.use(httpsEnforcement);
}
app.use(securityHeaders);

// Routes
app.use('/api/logs', logsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    https: req.secure || req.headers['x-forwarded-proto'] === 'https',
    timestamp: new Date().toISOString(),
  });
});

// Start server
const startServer = () => {
  let server;

  // Validate TLS configuration
  const tlsValidation = validateTLSConfig();
  if (config.enableHttps && !tlsValidation.valid) {
    logger.warn('TLS configuration validation failed', { errors: tlsValidation.errors });
    logger.warn('Falling back to HTTP mode');
  }

  // Configure HTTPS server if enabled and certificates are available
  if (config.enableHttps && config.sslCertPath && config.sslKeyPath) {
    try {
      const httpsOptions: https.ServerOptions = {
        key: fs.readFileSync(config.sslKeyPath),
        cert: fs.readFileSync(config.sslCertPath),
      };

      // Add CA chain if provided
      if (config.sslCaPath) {
        httpsOptions.ca = fs.readFileSync(config.sslCaPath);
      }

      server = https.createServer(httpsOptions, app);
      logger.info('HTTPS server configured successfully', { 
        certPath: config.sslCertPath,
        keyPath: config.sslKeyPath,
        hasCa: !!config.sslCaPath
      });
    } catch (error) {
      logger.error('Failed to load SSL certificates, falling back to HTTP', { 
        error: error instanceof Error ? error.message : String(error),
        certPath: config.sslCertPath,
        keyPath: config.sslKeyPath
      });
      server = http.createServer(app);
    }
  } else {
    server = http.createServer(app);
    if (config.enableHttps) {
      logger.warn('HTTPS enabled but certificates not provided, running in HTTP mode');
    }
  }

  server.listen(config.port, () => {
    logger.info(`Server running on port ${config.port}`, {
      https: config.enableHttps && server instanceof https.Server,
      protocol: server instanceof https.Server ? 'https' : 'http',
      nodeEnv: config.nodeEnv,
    });
  });

  // CON-11: Start log retention service with scheduled archival
  const logRetentionService = new LogRetentionService({
    retentionDays: parseInt(process.env.LOG_RETENTION_DAYS || '365', 10),
    logDirectory: path.join(process.cwd(), 'logs'),
  });
  
  // Start scheduled archival (runs daily)
  // Configure interval from environment or use default 24 hours
  const archivalIntervalHours = parseInt(process.env.LOG_ARCHIVAL_INTERVAL_HOURS || '24', 10);
  const archivalIntervalMs = archivalIntervalHours * 60 * 60 * 1000;
  logRetentionService.startScheduledArchival(archivalIntervalMs);
  
  logger.info('Log retention service initialized', {
    retentionDays: parseInt(process.env.LOG_RETENTION_DAYS || '365', 10),
    archivalIntervalHours
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    logger.info('SIGTERM received, shutting down gracefully');
    server.close(() => {
      process.exit(0);
    });
  });
};

startServer();

