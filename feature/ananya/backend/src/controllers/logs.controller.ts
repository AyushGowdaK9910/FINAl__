/**
 * CON-4: Logs Controller
 * Provides API endpoints for viewing logs
 * 
 * Features:
 * - List all log files with metadata
 * - Get log file contents with pagination
 * - Search logs with filters
 * - Get retention statistics
 */

import { Request, Response } from 'express';
import fs from 'fs/promises';
import path from 'path';
import { logger } from '../utils/logger';
import { LogRetentionService } from '../services/logRetention.service';

const logDir = path.join(process.cwd(), 'logs');

export class LogsController {
  /**
   * Get list of log files
   * Returns all log files with metadata (size, modified date, created date)
   */
  async getLogFiles(req: Request, res: Response): Promise<void> {
    try {
      const files = await fs.readdir(logDir);
      const logFiles = [];

      for (const file of files) {
        if (file.endsWith('.log')) {
          const filePath = path.join(logDir, file);
          const stats = await fs.stat(filePath);
          logFiles.push({
            filename: file,
            size: stats.size,
            modified: stats.mtime,
            created: stats.birthtime,
          });
        }
      }

      res.json({
        success: true,
        logs: logFiles.sort((a, b) => b.modified.getTime() - a.modified.getTime()),
      });
    } catch (error) {
      logger.error('Failed to get log files', { error });
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve log files',
      });
    }
  }

  /**
   * Get log file contents
   * Supports pagination and level filtering
   * Returns parsed log entries with metadata
   */
  async getLogContent(req: Request, res: Response): Promise<void> {
    try {
      const { filename } = req.params;
      const { lines = 100, level, offset = 0 } = req.query;

      // Security: prevent directory traversal
      if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
        res.status(400).json({
          success: false,
          error: 'Invalid filename',
        });
        return;
      }

      const filePath = path.join(logDir, filename);
      
      // Check if file exists
      try {
        await fs.access(filePath);
      } catch {
        res.status(404).json({
          success: false,
          error: 'Log file not found',
        });
        return;
      }

      const content = await fs.readFile(filePath, 'utf-8');
      const logLines = content.split('\n').filter((line) => line.trim());

      // Filter by level if specified
      let filteredLines = logLines;
      if (level) {
        filteredLines = logLines.filter((line) => {
          try {
            const logEntry = JSON.parse(line);
            return logEntry.level === level;
          } catch {
            return line.toLowerCase().includes(level.toString().toLowerCase());
          }
        });
      }

      // Get lines with pagination support
      const requestedLines = parseInt(lines.toString(), 10);
      const offsetValue = parseInt(offset.toString(), 10);
      const startIndex = Math.max(0, filteredLines.length - requestedLines - offsetValue);
      const endIndex = filteredLines.length - offsetValue;
      const lastLines = filteredLines.slice(startIndex, endIndex);

      // Parse JSON logs
      const parsedLogs = lastLines.map((line) => {
        try {
          return JSON.parse(line);
        } catch {
          return { message: line, raw: true };
        }
      });

      res.json({
        success: true,
        filename,
        totalLines: logLines.length,
        returnedLines: parsedLogs.length,
        logs: parsedLogs,
      });
    } catch (error) {
      logger.error('Failed to get log content', { error });
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve log content',
      });
    }
  }

  /**
   * Search logs
   * Supports query string, level filtering, and date range filtering
   * Returns up to 1000 matching results
   */
  async searchLogs(req: Request, res: Response): Promise<void> {
    try {
      const { query, level, startDate, endDate, limit = 1000 } = req.query;

      const files = await fs.readdir(logDir);
      const results: any[] = [];

      for (const file of files) {
        if (file.endsWith('.log')) {
          const filePath = path.join(logDir, file);
          const content = await fs.readFile(filePath, 'utf-8');
          const lines = content.split('\n').filter((line) => line.trim());

          for (const line of lines) {
            try {
              const logEntry = JSON.parse(line);

              // Filter by level
              if (level && logEntry.level !== level) {
                continue;
              }

              // Filter by date range
              if (startDate && new Date(logEntry.timestamp) < new Date(startDate.toString())) {
                continue;
              }
              if (endDate && new Date(logEntry.timestamp) > new Date(endDate.toString())) {
                continue;
              }

              // Search in message
              if (query) {
                const searchQuery = query.toString().toLowerCase();
                const message = (logEntry.message || '').toLowerCase();
                if (!message.includes(searchQuery)) {
                  continue;
                }
              }

              results.push({
                ...logEntry,
                sourceFile: file,
              });
            } catch {
              // Skip non-JSON lines
            }
          }
        }
      }

      const limitValue = parseInt(limit.toString(), 10);
      const limitedResults = results.slice(0, limitValue);
      
      res.json({
        success: true,
        count: limitedResults.length,
        totalMatches: results.length,
        results: limitedResults,
      });
    } catch (error) {
      logger.error('Failed to search logs', { error });
      res.status(500).json({
        success: false,
        error: 'Failed to search logs',
      });
    }
  }

  /**
   * Get retention statistics
   * CON-11: Returns retention statistics including total logs, archived logs, and pending archival counts
   */
  async getRetentionStats(req: Request, res: Response): Promise<void> {
    try {
      const retentionService = new LogRetentionService({
        retentionDays: parseInt(process.env.LOG_RETENTION_DAYS || '365', 10),
        logDirectory: logDir,
      });

      const stats = await retentionService.getRetentionStats();

      res.json({
        success: true,
        stats: {
          totalLogs: stats.totalLogs,
          archivedLogs: stats.archivedLogs,
          logsToArchive: stats.logsToArchive,
          retentionDays: stats.retentionDays,
          retentionPeriod: `${stats.retentionDays} days`,
          archiveDirectory: path.join(logDir, 'archived'),
        },
      });
    } catch (error) {
      logger.error('Failed to get retention stats', { error });
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve retention statistics',
      });
    }
  }
}

