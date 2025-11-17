/**
 * CON-3: Download Controller
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
   */
  async downloadFile(req: Request, res: Response): Promise<void> {
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

      // Check if file exists on disk
      if (!fs.existsSync(file.path)) {
        res.status(404).json({
          success: false,
          error: 'File not found on disk',
        });
        return;
      }

      // Set headers
      const filename = file.originalName || file.filename;
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Type', file.mimeType || 'application/octet-stream');
      res.setHeader('Content-Length', file.size.toString());

      // Support range requests for large files
      const range = req.headers.range;
      if (range) {
        const fileStream = fs.createReadStream(file.path, { start: 0, end: file.size - 1 });
        fileStream.pipe(res);
      } else {
        // Stream file
        const fileStream = fs.createReadStream(file.path);
        fileStream.pipe(res);
      }

      logger.info('File downloaded', { fileId, filename });
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

