/**
 * CON-1: Upload Controller
 */

import { Request, Response } from 'express';
import { UploadService } from '../services/uploadService';
import { logger } from '../utils/logger';

const uploadService = new UploadService();

export class UploadController {
  /**
   * Handle file upload
   */
  async uploadFile(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({
          success: false,
          error: 'No file uploaded',
        });
        return;
      }

      const result = await uploadService.saveFileMetadata(req.file);

      res.status(200).json({
        success: true,
        file: result,
      });
    } catch (error) {
      logger.error('Upload failed', { error });
      res.status(500).json({
        success: false,
        error: 'Upload failed',
      });
    }
  }

  /**
   * Get upload status
   */
  async getUploadStatus(req: Request, res: Response): Promise<void> {
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

      res.json({
        success: true,
        file,
      });
    } catch (error) {
      logger.error('Failed to get upload status', { error });
      res.status(500).json({
        success: false,
        error: 'Failed to get upload status',
      });
    }
  }
}

