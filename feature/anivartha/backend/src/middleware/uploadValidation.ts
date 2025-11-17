/**
 * CON-5: Upload Validation Middleware
 */

import { Request, Response, NextFunction } from 'express';
import { FileValidationService } from '../services/validateFile';
import { logger } from '../utils/logger';

const validationService = new FileValidationService();

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

  try {
    const validationResult = await validationService.validateFile(
      req.file.path,
      req.file.mimetype
    );

    if (!validationResult.valid) {
      // Delete invalid file
      const fs = require('fs').promises;
      try {
        await fs.unlink(req.file.path);
      } catch (error) {
        logger.warn('Failed to delete invalid file', { error });
      }

      logger.warn('File validation failed', {
        filename: req.file.originalname,
        errors: validationResult.errors,
      });

      res.status(400).json({
        success: false,
        error: 'File validation failed',
        errors: validationResult.errors,
      });
      return;
    }

    // Attach validation result to request
    (req as any).fileValidation = validationResult;
    next();
  } catch (error) {
    logger.error('Upload validation error', { error });
    res.status(500).json({
      success: false,
      error: 'Validation error occurred',
    });
  }
};

