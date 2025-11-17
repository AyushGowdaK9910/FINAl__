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
   */
  private async isFileCorrupted(filePath: string, mimeType?: string): Promise<boolean> {
    try {
      const buffer = await fs.readFile(filePath);
      const firstBytes = buffer.slice(0, 10);

      // Check for common file signatures
      if (mimeType?.startsWith('image/')) {
        // JPEG: FF D8 FF
        if (mimeType === 'image/jpeg') {
          return !(firstBytes[0] === 0xff && firstBytes[1] === 0xd8 && firstBytes[2] === 0xff);
        }
        // PNG: 89 50 4E 47
        if (mimeType === 'image/png') {
          return !(
            firstBytes[0] === 0x89 &&
            firstBytes[1] === 0x50 &&
            firstBytes[2] === 0x4e &&
            firstBytes[3] === 0x47
          );
        }
      }

      // PDF: %PDF
      if (mimeType === 'application/pdf') {
        const header = buffer.slice(0, 4).toString('ascii');
        return header !== '%PDF';
      }

      // DOCX: PK (ZIP signature)
      if (mimeType?.includes('wordprocessingml')) {
        return !(firstBytes[0] === 0x50 && firstBytes[1] === 0x4b);
      }

      return false;
    } catch {
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

