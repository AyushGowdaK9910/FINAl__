/**
 * CON-5: File Validation Service
 * Validates file types, MIME types, and detects corruption
 * 
 * Features:
 * - MIME type validation
 * - File extension checking
 * - File size validation
 * - File corruption detection
 * - Magic number validation
 */

import { fileTypeFromFile } from 'file-type';
import mime from 'mime-types';
import fs from 'fs/promises';
import path from 'path';
import { logger } from '../utils/logger';

/**
 * Validation result interface
 * Contains validation status and error messages
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  detectedMimeType?: string;
  detectedExtension?: string;
}

/**
 * FileValidationService class
 * Manages file validation operations including MIME type and extension checking
 */
export class FileValidationService {
  private allowedMimeTypes: string[];
  private allowedExtensions: string[];
  private maxFileSize: number;

  /**
   * Initialize file validation service
   * @param allowedMimeTypes List of allowed MIME types
   * @param allowedExtensions List of allowed file extensions
   * @param maxFileSize Maximum file size in bytes (default: 50MB)
   */
  constructor(
    allowedMimeTypes: string[] = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/bmp',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'text/plain',
    ],
    allowedExtensions: string[] = ['pdf', 'jpg', 'jpeg', 'png', 'gif', 'bmp', 'docx', 'doc', 'txt'],
    maxFileSize: number = 50 * 1024 * 1024
  ) {
    this.allowedMimeTypes = allowedMimeTypes;
    this.allowedExtensions = allowedExtensions;
    this.maxFileSize = maxFileSize;
    
    logger.info('FileValidationService initialized', {
      allowedMimeTypes: this.allowedMimeTypes.length,
      allowedExtensions: this.allowedExtensions.length,
      maxFileSize: `${this.maxFileSize / 1024 / 1024}MB`,
    });
  }

  /**
   * Validate file
   */
  async validateFile(filePath: string, originalMimeType?: string): Promise<ValidationResult> {
    const errors: string[] = [];

    try {
      // Check if file exists
      await fs.access(filePath);

      // Check file size
      const stats = await fs.stat(filePath);
      if (stats.size > this.maxFileSize) {
        errors.push(`File size exceeds maximum allowed size of ${this.maxFileSize / 1024 / 1024}MB`);
      }

      if (stats.size === 0) {
        errors.push('File is empty');
      }

      // Detect actual file type
      const fileType = await fileTypeFromFile(filePath);
      const detectedMimeType = fileType?.mime;
      const detectedExtension = fileType?.ext;

      // Validate MIME type
      if (originalMimeType) {
        if (!this.allowedMimeTypes.includes(originalMimeType)) {
          errors.push(`MIME type ${originalMimeType} is not allowed`);
        }
      }

      if (detectedMimeType) {
        if (!this.allowedMimeTypes.includes(detectedMimeType)) {
          errors.push(`Detected MIME type ${detectedMimeType} is not allowed`);
        }

        // Check if declared MIME type matches detected
        if (originalMimeType && originalMimeType !== detectedMimeType) {
          errors.push(
            `MIME type mismatch: declared ${originalMimeType}, detected ${detectedMimeType}`
          );
        }
      }

      // Validate extension
      const ext = path.extname(filePath).slice(1).toLowerCase();
      if (ext && !this.allowedExtensions.includes(ext)) {
        errors.push(`File extension .${ext} is not allowed`);
      }

      if (detectedExtension && !this.allowedExtensions.includes(detectedExtension)) {
        errors.push(`Detected extension .${detectedExtension} is not allowed`);
      }

      // Check for file corruption (basic checks)
      if (await this.isFileCorrupted(filePath, detectedMimeType)) {
        errors.push('File appears to be corrupted');
      }

      return {
        valid: errors.length === 0,
        errors,
        detectedMimeType,
        detectedExtension,
      };
    } catch (error) {
      logger.error('File validation error', { filePath, error });
      return {
        valid: false,
        errors: [`Validation error: ${error instanceof Error ? error.message : String(error)}`],
      };
    }
  }

  /**
   * Check if file is corrupted
   * Implements file signature checking and magic number validation
   * Detects corrupted image files, PDFs, and DOCX files
   */
  private async isFileCorrupted(filePath: string, mimeType?: string): Promise<boolean> {
    try {
      const buffer = await fs.readFile(filePath);
      const firstBytes = buffer.slice(0, 16); // Read more bytes for better detection

      // Check for common file signatures (magic numbers)
      if (mimeType?.startsWith('image/')) {
        // JPEG: FF D8 FF
        if (mimeType === 'image/jpeg' || mimeType === 'image/jpg') {
          const isValid = firstBytes[0] === 0xff && firstBytes[1] === 0xd8 && firstBytes[2] === 0xff;
          if (!isValid) {
            logger.warn('Invalid JPEG signature detected', { filePath });
          }
          return !isValid;
        }
        
        // PNG: 89 50 4E 47 0D 0A 1A 0A
        if (mimeType === 'image/png') {
          const isValid = (
            firstBytes[0] === 0x89 &&
            firstBytes[1] === 0x50 &&
            firstBytes[2] === 0x4e &&
            firstBytes[3] === 0x47 &&
            firstBytes[4] === 0x0d &&
            firstBytes[5] === 0x0a &&
            firstBytes[6] === 0x1a &&
            firstBytes[7] === 0x0a
          );
          if (!isValid) {
            logger.warn('Invalid PNG signature detected', { filePath });
          }
          return !isValid;
        }
        
        // GIF: 47 49 46 38 (GIF8)
        if (mimeType === 'image/gif') {
          const isValid = (
            firstBytes[0] === 0x47 &&
            firstBytes[1] === 0x49 &&
            firstBytes[2] === 0x46 &&
            firstBytes[3] === 0x38
          );
          if (!isValid) {
            logger.warn('Invalid GIF signature detected', { filePath });
          }
          return !isValid;
        }
        
        // BMP: 42 4D (BM)
        if (mimeType === 'image/bmp') {
          const isValid = firstBytes[0] === 0x42 && firstBytes[1] === 0x4d;
          if (!isValid) {
            logger.warn('Invalid BMP signature detected', { filePath });
          }
          return !isValid;
        }
      }

      // PDF: %PDF (25 50 44 46)
      if (mimeType === 'application/pdf') {
        const header = buffer.slice(0, 4).toString('ascii');
        const isValid = header === '%PDF';
        if (!isValid) {
          logger.warn('Invalid PDF header detected', { filePath, header });
        }
        return !isValid;
      }

      // DOCX: PK (ZIP signature) - 50 4B 03 04
      if (mimeType?.includes('wordprocessingml') || mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const isValid = (
          firstBytes[0] === 0x50 &&
          firstBytes[1] === 0x4b &&
          firstBytes[2] === 0x03 &&
          firstBytes[3] === 0x04
        );
        if (!isValid) {
          logger.warn('Invalid DOCX (ZIP) signature detected', { filePath });
        }
        return !isValid;
      }

      return false;
    } catch (error) {
      logger.error('Error checking file corruption', { filePath, error });
      return true; // If we can't read, consider corrupted
    }
  }

  /**
   * Get allowed MIME types
   */
  getAllowedMimeTypes(): string[] {
    return [...this.allowedMimeTypes];
  }

  /**
   * Get allowed extensions
   */
  getAllowedExtensions(): string[] {
    return [...this.allowedExtensions];
  }
}

