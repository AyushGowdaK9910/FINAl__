/**
 * CON-4: Logs Routes
 * Defines all log-related API endpoints with Swagger documentation
 * Includes error handling middleware for all routes
 */

import { Router } from 'express';
import { LogsController } from '../controllers/logs.controller';
import { logger } from '../utils/logger';

const router = Router();
const logsController = new LogsController();

// Error handling middleware for log routes
const handleRouteError = (handler: Function) => {
  return async (req: any, res: any, next: any) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      logger.error('Route error in logs routes', { 
        error: error instanceof Error ? error.message : String(error),
        path: req.path 
      });
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          error: 'Internal server error',
        });
      }
    }
  };
};

/**
 * @swagger
 * /api/logs:
 *   get:
 *     summary: Get list of log files
 *     tags: [Logs]
 *     responses:
 *       200:
 *         description: List of log files
 */
router.get('/', handleRouteError(logsController.getLogFiles.bind(logsController)));

/**
 * @swagger
 * /api/logs/:filename:
 *   get:
 *     summary: Get log file contents
 *     tags: [Logs]
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: lines
 *         schema:
 *           type: integer
 *           default: 100
 *       - in: query
 *         name: level
 *         schema:
 *           type: string
 *           enum: [error, warn, info, debug]
 *     responses:
 *       200:
 *         description: Log file contents
 */
router.get('/:filename', handleRouteError(logsController.getLogContent.bind(logsController)));

/**
 * @swagger
 * /api/logs/search:
 *   get:
 *     summary: Search logs
 *     tags: [Logs]
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *       - in: query
 *         name: level
 *         schema:
 *           type: string
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         description: Search results
 */
router.get('/search/query', handleRouteError(logsController.searchLogs.bind(logsController)));

/**
 * @swagger
 * /api/logs/retention/stats:
 *   get:
 *     summary: Get log retention statistics
 *     tags: [Logs]
 *     responses:
 *       200:
 *         description: Retention statistics
 */
router.get('/retention/stats', handleRouteError(logsController.getRetentionStats.bind(logsController)));

export default router;

