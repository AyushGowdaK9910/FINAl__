/**
 * CON-9: Health Check Controller
 * Provides health check and uptime monitoring endpoints
 */

import { Application, Request, Response } from 'express';

const startTime = Date.now();

interface HealthStatus {
  status: 'ok' | 'degraded' | 'down';
  uptime: number;
  timestamp: string;
  services: {
    database?: 'ok' | 'degraded' | 'down';
    storage?: 'ok' | 'degraded' | 'down';
  };
}

let healthStatus: HealthStatus = {
  status: 'ok',
  uptime: 0,
  timestamp: new Date().toISOString(),
  services: {},
};

/**
 * Calculate uptime
 */
const getUptime = (): number => {
  return Math.floor((Date.now() - startTime) / 1000);
};

/**
 * Check service health
 */
const checkServices = async (): Promise<HealthStatus['services']> => {
  const services: HealthStatus['services'] = {};

  // Check database (mock - implement actual check)
  try {
    // await db.ping();
    services.database = 'ok';
  } catch {
    services.database = 'down';
  }

  // Check storage (mock - implement actual check)
  try {
    const fs = require('fs').promises;
    await fs.access('./uploads');
    services.storage = 'ok';
  } catch {
    services.storage = 'degraded';
  }

  return services;
};

/**
 * Determine overall status
 */
const determineStatus = (services: HealthStatus['services']): HealthStatus['status'] => {
  const serviceStatuses = Object.values(services);
  if (serviceStatuses.some((s) => s === 'down')) {
    return 'down';
  }
  if (serviceStatuses.some((s) => s === 'degraded')) {
    return 'degraded';
  }
  return 'ok';
};

/**
 * Setup health check routes
 */
export const setupHealthChecks = (app: Application): void => {
  /**
   * @swagger
   * /api/health:
   *   get:
   *     summary: Basic health check
   *     tags: [Health]
   *     responses:
   *       200:
   *         description: Service is healthy
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/HealthResponse'
   */
  app.get('/api/health', (req: Request, res: Response) => {
    const uptime = getUptime();
    res.status(200).json({
      status: 'ok',
      uptime,
      timestamp: new Date().toISOString(),
    });
  });

  /**
   * @swagger
   * /api/health/detailed:
   *   get:
   *     summary: Detailed health check with service status
   *     tags: [Health]
   *     responses:
   *       200:
   *         description: Detailed health status
   *       503:
   *         description: Service is down or degraded
   */
  app.get('/api/health/detailed', async (req: Request, res: Response) => {
    const services = await checkServices();
    const status = determineStatus(services);
    const uptime = getUptime();

    healthStatus = {
      status,
      uptime,
      timestamp: new Date().toISOString(),
      services,
    };

    const statusCode = status === 'ok' ? 200 : 503;
    res.status(statusCode).json(healthStatus);
  });

  /**
   * @swagger
   * /api/health/uptime:
   *   get:
   *     summary: Get service uptime
   *     tags: [Health]
   *     responses:
   *       200:
   *         description: Uptime information
   */
  app.get('/api/health/uptime', (req: Request, res: Response) => {
    const uptime = getUptime();
    const uptimeHours = Math.floor(uptime / 3600);
    const uptimeMinutes = Math.floor((uptime % 3600) / 60);
    const uptimeSeconds = uptime % 60;

    res.json({
      uptime,
      formatted: `${uptimeHours}h ${uptimeMinutes}m ${uptimeSeconds}s`,
      startTime: new Date(startTime).toISOString(),
      currentTime: new Date().toISOString(),
    });
  });
};

