/**
 * CON-2: ImageMagick Service
 * Handles image format conversion using ImageMagick
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { logger } from '../utils/logger';

const execAsync = promisify(exec);

export interface ImageMagickOptions {
  inputPath: string;
  outputPath: string;
  targetFormat: string;
  quality?: number;
  resize?: string;
}

export class ImageMagickService {
  /**
   * Convert image using ImageMagick
   */
  async convert(options: ImageMagickOptions): Promise<string> {
    const { inputPath, outputPath, targetFormat, quality, resize } = options;

    let command = `convert "${inputPath}"`;

    // Add resize option if provided
    if (resize) {
      command += ` -resize ${resize}`;
    }

    // Add quality option for JPEG
    if (quality && (targetFormat.toLowerCase() === 'jpg' || targetFormat.toLowerCase() === 'jpeg')) {
      command += ` -quality ${quality}`;
    }

    command += ` "${outputPath}"`;

    logger.info('Running ImageMagick conversion', { command });

    try {
      const { stdout, stderr } = await execAsync(command, { timeout: 10000 });
      
      if (stderr) {
        logger.warn('ImageMagick stderr', { stderr });
      }

      logger.info('ImageMagick conversion completed', { outputPath });
      return outputPath;
    } catch (error) {
      logger.error('ImageMagick conversion failed', { error });
      throw new Error(`ImageMagick conversion failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Check if ImageMagick is available
   */
  async isAvailable(): Promise<boolean> {
    try {
      await execAsync('convert --version', { timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get image information
   */
  async getImageInfo(imagePath: string): Promise<any> {
    try {
      const { stdout } = await execAsync(`identify "${imagePath}"`, { timeout: 5000 });
      // Parse identify output
      const parts = stdout.trim().split(/\s+/);
      return {
        format: parts[1],
        dimensions: parts[2],
        size: parts[3],
        depth: parts[4],
      };
    } catch (error) {
      logger.error('Failed to get image info', { error });
      throw error;
    }
  }
}

