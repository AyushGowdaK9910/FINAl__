/**
 * CON-2: LibreOffice Service
 * Handles document conversion using LibreOffice
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { logger } from '../utils/logger';

const execAsync = promisify(exec);

export interface LibreOfficeOptions {
  inputPath: string;
  outputPath: string;
  targetFormat: string;
}

export class LibreOfficeService {
  /**
   * Convert document using LibreOffice
   */
  async convert(options: LibreOfficeOptions): Promise<string> {
    const { inputPath, outputPath, targetFormat } = options;

    const formatMap: Record<string, string> = {
      pdf: 'pdf',
      docx: 'docx',
      doc: 'doc',
      odt: 'odt',
      txt: 'txt',
      html: 'html',
      rtf: 'rtf',
    };

    const outputFormat = formatMap[targetFormat.toLowerCase()] || targetFormat;
    const outputDir = path.dirname(outputPath);

    // LibreOffice command
    const command = `soffice --headless --convert-to ${outputFormat} --outdir "${outputDir}" "${inputPath}"`;

    logger.info('Running LibreOffice conversion', { command });

    try {
      const { stdout, stderr } = await execAsync(command, { timeout: 30000 });
      
      if (stderr && !stderr.includes('Info')) {
        logger.warn('LibreOffice stderr', { stderr });
      }

      // LibreOffice outputs to same directory with different extension
      const inputBasename = path.basename(inputPath, path.extname(inputPath));
      const expectedOutput = path.join(outputDir, `${inputBasename}.${outputFormat}`);

      // Check if file exists, if not use outputPath
      let finalOutput = outputPath;
      try {
        const fs = require('fs').promises;
        await fs.access(expectedOutput);
        if (expectedOutput !== outputPath) {
          await fs.rename(expectedOutput, outputPath);
        }
        finalOutput = outputPath;
      } catch {
        // File might already be at outputPath
      }

      logger.info('LibreOffice conversion completed', { finalOutput });
      return finalOutput;
    } catch (error) {
      logger.error('LibreOffice conversion failed', { error });
      throw new Error(`LibreOffice conversion failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Check if LibreOffice is available
   */
  async isAvailable(): Promise<boolean> {
    try {
      await execAsync('soffice --version', { timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }
}

