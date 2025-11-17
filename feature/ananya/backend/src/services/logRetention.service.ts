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
   * Implements date-based log filtering and archive directory management
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
      const retentionDays = Math.floor(this.retentionMs / (24 * 60 * 60 * 1000));

      // Filter only log files
      const logFiles = files.filter(file => 
        file.endsWith('.log') || 
        file.endsWith('.log.gz') ||
        file.match(/application-\d{4}-\d{2}-\d{2}\.log/)
      );

      for (const file of logFiles) {
        const filePath = path.join(logDir, file);
        
        try {
          const stats = await fs.stat(filePath);
          
          // Skip if it's a directory
          if (stats.isDirectory()) {
            continue;
          }

          const fileAge = now - stats.mtimeMs;
          const fileAgeDays = Math.floor(fileAge / (24 * 60 * 60 * 1000));

          // If file is older than retention period
          if (fileAge > this.retentionMs) {
            const archivePath = path.join(archiveDir, file);
            
            // Check if archive file already exists (handle duplicates)
            let finalArchivePath = archivePath;
            let counter = 1;
            while (true) {
              try {
                await fs.access(finalArchivePath);
                finalArchivePath = path.join(archiveDir, `${path.basename(file, path.extname(file))}_${counter}${path.extname(file)}`);
                counter++;
              } catch {
                break; // File doesn't exist, use this path
              }
            }
            
            // Move to archive
            await fs.rename(filePath, finalArchivePath);
            archivedCount++;

            logger.info('Archived log file', {
              file,
              ageDays: fileAgeDays,
              retentionDays,
              archivePath: finalArchivePath,
            });
          }
        } catch (error) {
          logger.warn('Error processing log file', { file, error });
        }
      }

      logger.info('Log archival completed', { 
        archivedCount, 
        totalFiles: logFiles.length,
        retentionDays,
        logDirectory: logDir,
        archiveDirectory: archiveDir
      });
    } catch (error) {
      logger.error('Log archival failed', { error });
      throw error;
    }
  }

  /**
   * Delete archived logs older than retention period
   * Implements cleanup for archived logs beyond retention period
   * Includes comprehensive error handling for file operations
   */
  async deleteOldArchivedLogs(): Promise<void> {
    try {
      const archiveDir = this.config.archiveDirectory || path.join(this.config.logDirectory, 'archived');
      
      // Check if archive directory exists
      try {
        await fs.access(archiveDir);
      } catch {
        // Archive directory doesn't exist, nothing to delete
        logger.debug('Archive directory does not exist, skipping deletion', { archiveDir });
        return;
      }

      const files = await fs.readdir(archiveDir);
      const now = Date.now();
      let deletedCount = 0;
      let errorCount = 0;
      const retentionDays = Math.floor(this.retentionMs / (24 * 60 * 60 * 1000));

      for (const file of files) {
        const filePath = path.join(archiveDir, file);
        
        try {
          const stats = await fs.stat(filePath);
          
          // Skip if it's a directory
          if (stats.isDirectory()) {
            continue;
          }

          const fileAge = now - stats.mtimeMs;
          const fileAgeDays = Math.floor(fileAge / (24 * 60 * 60 * 1000));

          // If archived file is older than retention period, delete it
          if (fileAge > this.retentionMs) {
            try {
              await fs.unlink(filePath);
              deletedCount++;

              logger.info('Deleted old archived log', {
                file,
                ageDays: fileAgeDays,
                retentionDays,
                size: stats.size,
              });
            } catch (unlinkError) {
              errorCount++;
              logger.warn('Failed to delete archived log file', { 
                file, 
                error: unlinkError instanceof Error ? unlinkError.message : String(unlinkError)
              });
            }
          }
        } catch (error) {
          errorCount++;
          logger.warn('Error processing archived log file', { 
            file, 
            error: error instanceof Error ? error.message : String(error)
          });
        }
      }

      logger.info('Old archived log deletion completed', { 
        deletedCount, 
        errorCount,
        totalFiles: files.length,
        retentionDays
      });
    } catch (error) {
      logger.error('Old archived log deletion failed', { 
        error: error instanceof Error ? error.message : String(error)
      });
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
   * Configures daily archival job and integrates with server startup
   * Includes archival statistics tracking
   */
  startScheduledArchival(intervalMs: number = 24 * 60 * 60 * 1000): void {
    const intervalHours = Math.floor(intervalMs / (60 * 60 * 1000));
    logger.info('Starting scheduled log archival', { 
      intervalMs, 
      intervalHours,
      retentionDays: this.config.retentionDays,
      logDirectory: this.config.logDirectory,
      archiveDirectory: this.config.archiveDirectory
    });

    // Run immediately on startup
    this.archiveOldLogs()
      .then(() => this.deleteOldArchivedLogs())
      .then(() => {
        logger.info('Initial log archival completed on startup');
      })
      .catch((error) => {
        logger.error('Initial scheduled archival error', { error });
      });

    // Then run on interval (daily by default)
    const intervalId = setInterval(() => {
      const startTime = Date.now();
      logger.info('Starting scheduled log archival cycle');
      
      this.archiveOldLogs()
        .then(() => this.deleteOldArchivedLogs())
        .then(async () => {
          const duration = Date.now() - startTime;
          const stats = await this.getRetentionStats();
          logger.info('Scheduled log archival cycle completed', {
            duration: `${duration}ms`,
            stats
          });
        })
        .catch((error) => {
          logger.error('Scheduled archival error', { 
            error: error instanceof Error ? error.message : String(error)
          });
        });
    }, intervalMs);

    // Store interval ID for potential cleanup
    (this as any).archivalIntervalId = intervalId;
    
    logger.info('Scheduled log archival configured', {
      nextRun: new Date(Date.now() + intervalMs).toISOString(),
      intervalHours
    });
  }

  /**
   * Stop scheduled archival
   */
  stopScheduledArchival(): void {
    if ((this as any).archivalIntervalId) {
      clearInterval((this as any).archivalIntervalId);
      logger.info('Stopped scheduled log archival');
    }
  }
}

