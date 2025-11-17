/**
 * CON-2: OCR Service
 * Handles OCR conversion using Tesseract
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { logger } from '../utils/logger';

const execAsync = promisify(exec);

export interface OCROptions {
  inputPath: string;
  outputPath: string;
  language?: string;
}

export class OCRService {
  /**
   * Convert image to text using Tesseract OCR
   */
  async convert(options: OCROptions): Promise<string> {
    const { inputPath, outputPath, language = 'eng' } = options;
    const command = `tesseract "${inputPath}" "${outputPath.replace(/\.txt$/, '')}" -l ${language}`;

    logger.info('Running OCR conversion', { command });

    try {
      const { stdout, stderr } = await execAsync(command, { timeout: 30000 });
      
      if (stderr && !stderr.includes('Tesseract')) {
        logger.warn('OCR stderr', { stderr });
      }

      // Tesseract adds .txt extension
      const finalPath = outputPath.endsWith('.txt') ? outputPath : `${outputPath}.txt`;
      
      logger.info('OCR conversion completed', { finalPath });
      return finalPath;
    } catch (error) {
      logger.error('OCR conversion failed', { error });
      throw new Error(`OCR conversion failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Check if Tesseract is available
   */
  async isAvailable(): Promise<boolean> {
    try {
      await execAsync('tesseract --version', { timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get available OCR languages
   */
  async getAvailableLanguages(): Promise<string[]> {
    try {
      const { stdout } = await execAsync('tesseract --list-langs', { timeout: 5000 });
      const languages = stdout
        .split('\n')
        .filter(line => line.trim() && !line.includes('List of available languages'))
        .map(line => line.trim());
      return languages;
    } catch {
      return ['eng']; // Default to English
    }
  }
}

