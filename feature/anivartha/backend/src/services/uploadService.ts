/**
 * CON-1: File Upload Service
 * Handles file uploads with progress tracking and metadata management
 * 
 * Features:
 * - Multer-based file upload handling
 * - Unique filename generation
 * - Upload directory management
 * - File metadata storage
 * - Progress tracking support
 */

import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger';

/**
 * Upload result interface
 * Contains metadata about uploaded file
 */
export interface UploadResult {
  filename: string;
  originalName: string;
  path: string;
  size: number;
  mimeType: string;
  id: string;
}

/**
 * UploadService class
 * Manages file upload operations with multer
 */
export class UploadService {
  private uploadDir: string;
  private maxFileSize: number;

  /**
   * Initialize upload service
   * @param uploadDir Directory to store uploaded files
   * @param maxFileSize Maximum file size in bytes (default: 50MB)
   */
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
   * Sets up disk storage with unique filename generation
   * Ensures upload directory exists before saving files
   */
  getStorage() {
    return multer.diskStorage({
      destination: async (req, file, cb) => {
        try {
          await this.initialize();
          cb(null, this.uploadDir);
        } catch (error) {
          cb(error instanceof Error ? error : new Error('Failed to initialize upload directory'), '');
        }
      },
      filename: (req, file, cb) => {
        try {
          const uniqueId = uuidv4();
          const ext = path.extname(file.originalname);
          const basename = path.basename(file.originalname, ext)
            .replace(/[^a-zA-Z0-9_-]/g, '_') // Sanitize filename
            .substring(0, 100); // Limit length
          const filename = `${basename}_${uniqueId}${ext}`;
          cb(null, filename);
        } catch (error) {
          cb(error instanceof Error ? error : new Error('Failed to generate filename'), '');
        }
      },
    });
  }

  /**
   * Get multer upload middleware
   * Configures disk storage with unique filenames and file size limits
   * Includes destination directory management and UUID-based filename generation
   */
  getUploadMiddleware() {
    return multer({
      storage: this.getStorage(),
      limits: {
        fileSize: this.maxFileSize, // Maximum file size (default: 50MB)
        files: 1, // Limit to single file upload
        fields: 10, // Maximum number of non-file fields
        fieldNameSize: 100, // Maximum field name size
        fieldSize: 1024 * 1024, // Maximum field value size (1MB)
      },
      fileFilter: (req, file, cb) => {
        // File filter will be handled by validation middleware
        // This allows all files to pass through for validation
        cb(null, true);
      },
    });
  }

  /**
   * Save uploaded file metadata
   * Tracks upload metadata and generates unique file ID
   */
  async saveFileMetadata(file: Express.Multer.File): Promise<UploadResult> {
    const fileId = uuidv4();
    const uploadTime = Date.now();
    
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
      mimeType: file.mimetype,
      uploadTime: new Date(uploadTime).toISOString(),
    });

    return result;
  }

  /**
   * Track upload progress
   * Can be extended to support real-time progress updates
   */
  trackUploadProgress(fileId: string, progress: number): void {
    logger.debug('Upload progress', { fileId, progress: `${progress}%` });
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

