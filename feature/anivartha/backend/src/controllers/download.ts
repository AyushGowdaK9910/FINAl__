/**
 * CON-3: Download Controller
 * Handles file download endpoints with file retrieval by ID and download response headers
 */

import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { UploadService } from '../services/uploadService';
import { logger } from '../utils/logger';

const uploadService = new UploadService();

export class DownloadController {
  /**
   * Download file by ID
   * Implements downloadFile endpoint with file existence validation
   * Sets up download response headers for proper file delivery
   */
  async downloadFile(req: Request, res: Response): Promise<void> {
    try {
      const { fileId } = req.params;
      
      if (!fileId) {
        res.status(400).json({
          success: false,
          error: 'File ID is required',
        });
        return;
      }

      logger.info('Download request received', { fileId });

      const file = await uploadService.getFile(fileId);

      if (!file) {
        logger.warn('File not found for download', { fileId });
        res.status(404).json({
          success: false,
          error: 'File not found',
        });
        return;
      }

      // Check if file exists on disk
      if (!fs.existsSync(file.path)) {
        logger.error('File not found on disk', { fileId, path: file.path });
        res.status(404).json({
          success: false,
          error: 'File not found on disk',
        });
        return;
      }

      // Set secure download headers with proper Content-Disposition
      const filename = encodeURIComponent(file.originalName || file.filename);
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"; filename*=UTF-8''${filename}`);
      res.setHeader('Content-Type', file.mimeType || 'application/octet-stream');
      res.setHeader('Content-Length', file.size.toString());
      res.setHeader('Accept-Ranges', 'bytes');
      res.setHeader('Cache-Control', 'private, max-age=3600');

      // Implement file streaming for efficient large file downloads
      const fileStream = fs.createReadStream(file.path);
      
      fileStream.on('error', (error) => {
        logger.error('File stream error', { fileId, error: error.message });
        if (!res.headersSent) {
          res.status(500).json({
            success: false,
            error: 'File stream error',
          });
        }
      });

      fileStream.pipe(res);

      // Add download logging with performance metrics
      const downloadStartTime = Date.now();
      res.on('finish', () => {
        const downloadDuration = Date.now() - downloadStartTime;
        logger.info('File downloaded successfully', {
          fileId,
          filename: file.originalName,
          size: file.size,
          duration: `${downloadDuration}ms`,
          downloadSpeed: `${(file.size / downloadDuration * 1000 / 1024).toFixed(2)} KB/s`,
        });
      });
    } catch (error) {
      logger.error('Download failed', { error });
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          error: 'Download failed',
        });
      }
    }
  }

  /**
   * Stream file (for preview)
   */
  async streamFile(req: Request, res: Response): Promise<void> {
    try {
      const { fileId } = req.params;
      const file = await uploadService.getFile(fileId);

      if (!file) {
        res.status(404).json({
          success: false,
          error: 'File not found',
        });
        return;
      }

      if (!fs.existsSync(file.path)) {
        res.status(404).json({
          success: false,
          error: 'File not found on disk',
        });
        return;
      }

      res.setHeader('Content-Type', file.mimeType || 'application/octet-stream');
      res.setHeader('Content-Length', file.size.toString());

      const fileStream = fs.createReadStream(file.path);
      fileStream.pipe(res);
    } catch (error) {
      logger.error('Stream failed', { error });
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          error: 'Stream failed',
        });
      }
    }
  }
}

