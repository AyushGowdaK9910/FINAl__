/**
 * CON-2: Ghostscript Service
 * Handles PDF operations using Ghostscript
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { logger } from '../utils/logger';

const execAsync = promisify(exec);

export interface GhostscriptOptions {
  inputPath: string;
  outputPath: string;
  operation: 'pdfwrite' | 'pdf2image';
  options?: string[];
}

export class GhostscriptService {
  /**
   * Convert to PDF using Ghostscript
   */
  async convertToPDF(inputPath: string, outputPath: string): Promise<string> {
    const command = `gs -dNOPAUSE -dBATCH -sDEVICE=pdfwrite -sOutputFile="${outputPath}" "${inputPath}"`;

    logger.info('Running Ghostscript PDF conversion', { command });

    try {
      await execAsync(command, { timeout: 30000 });
      logger.info('Ghostscript conversion completed', { outputPath });
      return outputPath;
    } catch (error) {
      logger.error('Ghostscript conversion failed', { error });
      throw new Error(`Ghostscript conversion failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Convert PDF to images
   */
  async convertPDFToImages(inputPath: string, outputDir: string, format: string = 'png'): Promise<string[]> {
    const outputPattern = `${outputDir}/page-%d.${format}`;
    const command = `gs -dNOPAUSE -dBATCH -sDEVICE=${format} -sOutputFile="${outputPattern}" "${inputPath}"`;

    logger.info('Running Ghostscript PDF to image conversion', { command });

    try {
      await execAsync(command, { timeout: 30000 });
      
      // List generated files
      const fs = require('fs').promises;
      const files = await fs.readdir(outputDir);
      const imageFiles = files
        .filter(file => file.startsWith('page-') && file.endsWith(`.${format}`))
        .map(file => `${outputDir}/${file}`)
        .sort();

      logger.info('Ghostscript PDF to image conversion completed', { count: imageFiles.length });
      return imageFiles;
    } catch (error) {
      logger.error('Ghostscript PDF to image conversion failed', { error });
      throw new Error(`Ghostscript conversion failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Check if Ghostscript is available
   */
  async isAvailable(): Promise<boolean> {
    try {
      await execAsync('gs --version', { timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get PDF information
   */
  async getPDFInfo(pdfPath: string): Promise<any> {
    try {
      const { stdout } = await execAsync(`gs -q -dNODISPLAY -c "(${pdfPath}) (r) file runpdfbegin pdfpagecount = quit"`, { timeout: 5000 });
      const pageCount = parseInt(stdout.trim(), 10);
      return { pageCount };
    } catch (error) {
      logger.error('Failed to get PDF info', { error });
      return { pageCount: 0 };
    }
  }
}

