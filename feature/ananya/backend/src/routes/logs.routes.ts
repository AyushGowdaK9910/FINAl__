/**
 * CON-4: Logs Routes
 */

import { Router } from 'express';
import { LogsController } from '../controllers/logs.controller';

const router = Router();
const logsController = new LogsController();

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
router.get('/', logsController.getLogFiles.bind(logsController));

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
router.get('/:filename', logsController.getLogContent.bind(logsController));

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
router.get('/search/query', logsController.searchLogs.bind(logsController));

export default router;

