/**
 * CON-1: Upload Controller
 * Handles file upload endpoints and metadata management
 */

import { Request, Response } from 'express';
import { UploadService } from '../services/uploadService';
import { logger } from '../utils/logger';

const uploadService = new UploadService();

export class UploadController {
  /**
   * Handle file upload
   * Processes uploaded file and returns metadata with unique file ID
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

      const uploadStartTime = Date.now();
      
      logger.info('File upload received', {
        originalName: req.file.originalname,
        size: req.file.size,
        mimeType: req.file.mimetype,
      });

      const result = await uploadService.saveFileMetadata(req.file);
      
      const uploadDuration = Date.now() - uploadStartTime;

      logger.info('File upload completed', {
        fileId: result.id,
        filename: result.filename,
        duration: `${uploadDuration}ms`,
        uploadSpeed: `${(req.file.size / uploadDuration * 1000 / 1024).toFixed(2)} KB/s`,
      });

      res.status(200).json({
        success: true,
        file: result,
      });
    } catch (error) {
      logger.error('Upload failed', { 
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      res.status(500).json({
        success: false,
        error: 'Upload failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  /**
   * Get upload status
   * Retrieves file metadata by file ID
   */
  async getUploadStatus(req: Request, res: Response): Promise<void> {
    try {
      const { fileId } = req.params;
      
      if (!fileId) {
        res.status(400).json({
          success: false,
          error: 'File ID is required',
        });
        return;
      }

      const file = await uploadService.getFile(fileId);

      if (!file) {
        res.status(404).json({
          success: false,
          error: 'File not found',
        });
        return;
      }

      logger.info('File status retrieved', { fileId });

      res.json({
        success: true,
        file,
      });
    } catch (error) {
      logger.error('Failed to get upload status', { 
        error: error instanceof Error ? error.message : String(error),
        fileId: req.params.fileId
      });
      res.status(500).json({
        success: false,
        error: 'Failed to get upload status',
      });
    }
  }
}

