/**
 * CON-17: Express.js setup
 */

import express, { Application } from 'express';
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
app.get('/', (_req, res) => {
  res.json({
    message: 'File Converter API',
    version: '1.0.0',
    docs: '/api-docs',
    health: '/api/health',
  });
});

export default app;

