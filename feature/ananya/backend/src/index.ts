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

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const ENABLE_HTTPS = process.env.ENABLE_HTTPS === 'true';
const SSL_CERT_PATH = process.env.SSL_CERT_PATH;
const SSL_KEY_PATH = process.env.SSL_KEY_PATH;

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// CON-10: HTTPS enforcement and security headers
if (ENABLE_HTTPS) {
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

  if (ENABLE_HTTPS && SSL_CERT_PATH && SSL_KEY_PATH) {
    try {
      const options = {
        key: fs.readFileSync(SSL_KEY_PATH),
        cert: fs.readFileSync(SSL_CERT_PATH),
      };
      server = https.createServer(options, app);
      logger.info('HTTPS server configured', { certPath: SSL_CERT_PATH });
    } catch (error) {
      logger.error('Failed to load SSL certificates, falling back to HTTP', { error });
      server = http.createServer(app);
    }
  } else {
    server = http.createServer(app);
    if (ENABLE_HTTPS) {
      logger.warn('HTTPS enabled but certificates not provided, running in HTTP mode');
    }
  }

  server.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`, {
      https: ENABLE_HTTPS,
      protocol: ENABLE_HTTPS ? 'https' : 'http',
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

