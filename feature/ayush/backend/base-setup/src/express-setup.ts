/**
 * CON-17: Express.js setup
 * Configures Express.js application with middleware and basic route structure
 * 
 * Features:
 * - CORS configuration for cross-origin requests
 * - JSON body parsing middleware
 * - Request logging and error handling
 * - Basic route structure setup
 */

import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { setupSwagger } from '../docs/swagger';
import { setupHealthChecks } from '../health/health-check-controller';

const app: Application = express();

// CORS configuration - allow cross-origin requests
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));

// JSON body parsing middleware - parse JSON request bodies
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// CON-7: Setup Swagger documentation
setupSwagger(app);

// CON-9: Setup health checks
setupHealthChecks(app);

// Basic route structure - root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'File Converter API',
    version: '1.0.0',
    docs: '/api-docs',
    health: '/api/health',
    status: 'running',
  });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

export default app;

