/**
 * CON-5: Upload Validation Middleware
 * Integrates with file validation service and handles automatic file deletion on validation failure
 */

import { Request, Response, NextFunction } from 'express';
import { FileValidationService } from '../services/validateFile';
import { logger } from '../utils/logger';
import fs from 'fs/promises';

const validationService = new FileValidationService();

/**
 * Upload validation middleware
 * Validates uploaded files and automatically deletes invalid files
 * Returns detailed validation errors to the client
 */
export const uploadValidation = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.file) {
    res.status(400).json({
      success: false,
      error: 'No file uploaded',
    });
    return;
  }

  const filePath = req.file.path;
  const originalMimeType = req.file.mimetype;

  logger.info('Validating uploaded file', {
    filename: req.file.originalname,
    mimeType: originalMimeType,
    size: req.file.size,
    path: filePath,
  });

  try {
    const validationResult = await validationService.validateFile(
      filePath,
      originalMimeType
    );

    if (!validationResult.valid) {
      logger.warn('File validation failed', {
        filename: req.file.originalname,
        errors: validationResult.errors,
        detectedMimeType: validationResult.detectedMimeType,
      });

      // Delete invalid file automatically
      try {
        await fs.unlink(filePath);
        logger.info('Invalid file deleted', { path: filePath });
      } catch (error) {
        logger.error('Failed to delete invalid file', { 
          error: error instanceof Error ? error.message : String(error),
          path: filePath 
        });
      }

      res.status(400).json({
        success: false,
        error: 'File validation failed',
        errors: validationResult.errors,
        detectedMimeType: validationResult.detectedMimeType,
        detectedExtension: validationResult.detectedExtension,
      });
      return;
    }

    // Attach validation result to request for downstream use
    (req as any).fileValidation = validationResult;
    
    logger.info('File validation passed', {
      filename: req.file.originalname,
      detectedMimeType: validationResult.detectedMimeType,
    });

    next();
  } catch (error) {
    logger.error('Validation middleware error', { 
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      filename: req.file.originalname,
    });

    // Attempt to clean up file on error
    try {
      await fs.unlink(filePath);
    } catch (unlinkError) {
      logger.error('Failed to delete file after validation error', { 
        error: unlinkError,
        path: filePath 
      });
    }

    res.status(500).json({
      success: false,
      error: 'Validation error occurred',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

