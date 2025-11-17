/**
 * CON-17: Express.js setup
 */

import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { setupSwagger } from './docs/swagger';
import { setupHealthChecks } from './health/health-check-controller';

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());

// CON-7: Setup Swagger documentation
setupSwagger(app);

// CON-9: Setup health checks
setupHealthChecks(app);

// Basic route
app.get('/', (_req: Request, res: Response) => {
  res.json({
    message: 'File Converter API',
    version: '1.0.0',
    docs: '/api-docs',
    health: '/api/health',
  });
});

// Error handler middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
  });
});

export default app;
