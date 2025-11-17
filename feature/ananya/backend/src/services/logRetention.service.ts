/**
 * CON-11: Log Retention Service
 * Manages log archival and retention for 1 year
 */

import fs from 'fs/promises';
import path from 'path';
import { logger } from '../utils/logger';

export interface RetentionConfig {
  retentionDays: number;
  logDirectory: string;
  archiveDirectory?: string;
}

/**
 * LogRetentionService
 * Manages log archival and retention policies
 * Automatically archives logs older than retention period
 * Supports configurable retention periods and archive directories
 */
export class LogRetentionService {
  private config: RetentionConfig;
  private retentionMs: number;

  /**
   * Initialize log retention service
   * @param config Retention configuration including retention days and directories
   */
  constructor(config: RetentionConfig) {
    this.config = config;
    this.retentionMs = config.retentionDays * 24 * 60 * 60 * 1000;
    
    // Ensure archive directory is set
    if (!this.config.archiveDirectory) {
      this.config.archiveDirectory = path.join(this.config.logDirectory, 'archived');
    }
  }

  /**
   * Archive logs older than retention period
   */
  async archiveOldLogs(): Promise<void> {
    try {
      const logDir = this.config.logDirectory;
      const archiveDir = this.config.archiveDirectory || path.join(logDir, 'archived');

      // Create archive directory if it doesn't exist
      await fs.mkdir(archiveDir, { recursive: true });

      const files = await fs.readdir(logDir);
      const now = Date.now();
      let archivedCount = 0;

      for (const file of files) {
        const filePath = path.join(logDir, file);
        
        try {
          const stats = await fs.stat(filePath);
          const fileAge = now - stats.mtimeMs;

          // If file is older than retention period
          if (fileAge > this.retentionMs) {
            const archivePath = path.join(archiveDir, file);
            
            // Move to archive
            await fs.rename(filePath, archivePath);
            archivedCount++;

            logger.info('Archived log file', {
              file,
              age: Math.floor(fileAge / (24 * 60 * 60 * 1000)),
              archivePath,
            });
          }
        } catch (error) {
          logger.warn('Error processing log file', { file, error });
        }
      }

      logger.info('Log archival completed', { archivedCount, totalFiles: files.length });
    } catch (error) {
      logger.error('Log archival failed', { error });
      throw error;
    }
  }

  /**
   * Delete archived logs older than retention period
   */
  async deleteOldArchivedLogs(): Promise<void> {
    try {
      const archiveDir = this.config.archiveDirectory || path.join(this.config.logDirectory, 'archived');
      
      // Check if archive directory exists
      try {
        await fs.access(archiveDir);
      } catch {
        // Archive directory doesn't exist, nothing to delete
        return;
      }

      const files = await fs.readdir(archiveDir);
      const now = Date.now();
      let deletedCount = 0;

      for (const file of files) {
        const filePath = path.join(archiveDir, file);
        
        try {
          const stats = await fs.stat(filePath);
          const fileAge = now - stats.mtimeMs;

          // If archived file is older than retention period, delete it
          if (fileAge > this.retentionMs) {
            await fs.unlink(filePath);
            deletedCount++;

            logger.info('Deleted old archived log', {
              file,
              age: Math.floor(fileAge / (24 * 60 * 60 * 1000)),
            });
          }
        } catch (error) {
          logger.warn('Error processing archived log file', { file, error });
        }
      }

      logger.info('Old archived log deletion completed', { deletedCount });
    } catch (error) {
      logger.error('Old archived log deletion failed', { error });
      throw error;
    }
  }

  /**
   * Get retention statistics
   */
  async getRetentionStats(): Promise<{
    totalLogs: number;
    archivedLogs: number;
    logsToArchive: number;
    retentionDays: number;
  }> {
    try {
      const logDir = this.config.logDirectory;
      const archiveDir = this.config.archiveDirectory || path.join(logDir, 'archived');

      const now = Date.now();
      let logsToArchive = 0;
      let totalLogs = 0;

      const files = await fs.readdir(logDir);
      totalLogs = files.length;

      for (const file of files) {
        const filePath = path.join(logDir, file);
        try {
          const stats = await fs.stat(filePath);
          const fileAge = now - stats.mtimeMs;
          if (fileAge > this.retentionMs) {
            logsToArchive++;
          }
        } catch {
          // Skip files we can't stat
        }
      }

      let archivedLogs = 0;
      try {
        await fs.access(archiveDir);
        const archivedFiles = await fs.readdir(archiveDir);
        archivedLogs = archivedFiles.length;
      } catch {
        // Archive directory doesn't exist
      }

      return {
        totalLogs,
        archivedLogs,
        logsToArchive,
        retentionDays: this.config.retentionDays,
      };
    } catch (error) {
      logger.error('Failed to get retention stats', { error });
      throw error;
    }
  }

  /**
   * Start scheduled archival (runs daily)
   */
  startScheduledArchival(intervalMs: number = 24 * 60 * 60 * 1000): void {
    logger.info('Starting scheduled log archival', { intervalMs });

    // Run immediately
    this.archiveOldLogs().catch((error) => {
      logger.error('Scheduled archival error', { error });
    });

    // Then run on interval
    setInterval(() => {
      this.archiveOldLogs()
        .then(() => this.deleteOldArchivedLogs())
        .catch((error) => {
          logger.error('Scheduled archival error', { error });
        });
    }, intervalMs);
  }
}

