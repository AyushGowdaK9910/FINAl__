/**
 * CON-1: File Upload Service
 * Handles file uploads with progress tracking
 */

import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger';

export interface UploadResult {
  filename: string;
  originalName: string;
  path: string;
  size: number;
  mimeType: string;
  id: string;
}

export class UploadService {
  private uploadDir: string;
  private maxFileSize: number;

  constructor(uploadDir: string = './uploads', maxFileSize: number = 50 * 1024 * 1024) {
    this.uploadDir = uploadDir;
    this.maxFileSize = maxFileSize;
  }

  /**
   * Initialize upload directory
   */
  async initialize(): Promise<void> {
    try {
      await fs.mkdir(this.uploadDir, { recursive: true });
      logger.info('Upload directory initialized', { uploadDir: this.uploadDir });
    } catch (error) {
      logger.error('Failed to initialize upload directory', { error });
      throw error;
    }
  }

  /**
   * Configure multer storage
   */
  getStorage() {
    return multer.diskStorage({
      destination: async (req, file, cb) => {
        await this.initialize();
        cb(null, this.uploadDir);
      },
      filename: (req, file, cb) => {
        const uniqueId = uuidv4();
        const ext = path.extname(file.originalname);
        const basename = path.basename(file.originalname, ext);
        const filename = `${basename}_${uniqueId}${ext}`;
        cb(null, filename);
      },
    });
  }

  /**
   * Get multer upload middleware
   */
  getUploadMiddleware() {
    return multer({
      storage: this.getStorage(),
      limits: {
        fileSize: this.maxFileSize,
      },
      fileFilter: (req, file, cb) => {
        // File filter will be handled by validation middleware
        cb(null, true);
      },
    });
  }

  /**
   * Save uploaded file metadata
   */
  async saveFileMetadata(file: Express.Multer.File): Promise<UploadResult> {
    const fileId = uuidv4();
    const result: UploadResult = {
      id: fileId,
      filename: file.filename,
      originalName: file.originalname,
      path: file.path,
      size: file.size,
      mimeType: file.mimetype,
    };

    logger.info('File uploaded successfully', {
      fileId,
      originalName: file.originalname,
      size: file.size,
    });

    return result;
  }

  /**
   * Get file by ID
   */
  async getFile(fileId: string): Promise<UploadResult | null> {
    // In a real implementation, this would query a database
    // For now, we'll search the upload directory
    try {
      const files = await fs.readdir(this.uploadDir);
      const file = files.find((f) => f.includes(fileId));
      
      if (file) {
        const filePath = path.join(this.uploadDir, file);
        const stats = await fs.stat(filePath);
        
        return {
          id: fileId,
          filename: file,
          originalName: file,
          path: filePath,
          size: stats.size,
          mimeType: 'application/octet-stream', // Would be stored in DB
        };
      }
      
      return null;
    } catch (error) {
      logger.error('Failed to get file', { fileId, error });
      return null;
    }
  }

  /**
   * Delete file
   */
  async deleteFile(filePath: string): Promise<void> {
    try {
      await fs.unlink(filePath);
      logger.info('File deleted', { filePath });
    } catch (error) {
      logger.error('Failed to delete file', { filePath, error });
      throw error;
    }
  }
}

