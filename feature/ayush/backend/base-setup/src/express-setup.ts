/**
 * CON-17: Express.js setup
 */

import express, { Application } from 'express';
import cors from 'cors';
import { setupSwagger } from '../docs/swagger';
import { setupHealthChecks } from '../health/health-check-controller';

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());

// CON-7: Setup Swagger documentation
setupSwagger(app);

// CON-9: Setup health checks
setupHealthChecks(app);

// Basic route
/**
 * @swagger
 * /:
 *   get:
 *     summary: Get API information
 *     description: Returns basic API information and available endpoints
 *     tags: [General]
 *     responses:
 *       200:
 *         description: API information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: File Converter API
 *                 version:
 *                   type: string
 *                   example: 1.0.0
 *                 docs:
 *                   type: string
 *                   example: /api-docs
 *                 health:
 *                   type: string
 *                   example: /api/health
 *                 status:
 *                   type: string
 *                   example: running
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'File Converter API',
    version: '1.0.0',
    docs: '/api-docs',
    health: '/api/health',
    status: 'running',
  });
});

export default app;

