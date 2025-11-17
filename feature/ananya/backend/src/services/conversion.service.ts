/**
 * CON-2: File Conversion Service
 * Implements conversion using LibreOffice, OCR, ImageMagick, and Ghostscript
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs/promises';
import { logger } from '../utils/logger';

const execAsync = promisify(exec);

export interface ConversionOptions {
  sourceFormat: string;
  targetFormat: string;
  inputPath: string;
  outputPath?: string;
  ocrEnabled?: boolean;
}

export class ConversionService {
  private tempDir: string;

  constructor(tempDir: string = './temp') {
    this.tempDir = tempDir;
  }

  /**
   * Convert file using appropriate tool based on formats
   * Logs conversion start/end events and performance metrics
   */
  async convert(options: ConversionOptions): Promise<string> {
    const { sourceFormat, targetFormat, inputPath, ocrEnabled = false } = options;
    const outputPath = options.outputPath || this.generateOutputPath(inputPath, targetFormat);
    let tempFiles: string[] = [];
    const startTime = Date.now();
    const conversionId = uuidv4().substring(0, 8);

    logger.info('Conversion started', { 
      conversionId,
      sourceFormat, 
      targetFormat, 
      inputPath,
      ocrEnabled 
    });

    try {
      let result: string;

      // Document conversions using LibreOffice
      if (this.isDocumentFormat(sourceFormat) && this.isDocumentFormat(targetFormat)) {
        result = await this.convertWithLibreOffice(inputPath, outputPath, targetFormat);
      }
      // Image conversions using ImageMagick
      else if (this.isImageFormat(sourceFormat) && this.isImageFormat(targetFormat)) {
        result = await this.convertWithImageMagick(inputPath, outputPath, targetFormat);
      }
      // PDF operations using Ghostscript
      else if (sourceFormat === 'pdf' || targetFormat === 'pdf') {
        result = await this.convertWithGhostscript(inputPath, outputPath, sourceFormat, targetFormat);
      }
      // OCR for images to text
      else if (ocrEnabled && this.isImageFormat(sourceFormat) && targetFormat === 'txt') {
        result = await this.convertWithOCR(inputPath, outputPath);
      }
      else {
        throw new Error(`Unsupported conversion: ${sourceFormat} -> ${targetFormat}`);
      }

      // Cleanup temp files after successful conversion
      await this.cleanupTempFiles(tempFiles);
      
      const duration = Date.now() - startTime;
      const fileSize = await this.getFileSize(result);
      
      logger.info('Conversion completed successfully', {
        conversionId,
        sourceFormat,
        targetFormat,
        inputPath,
        outputPath: result,
        duration: `${duration}ms`,
        fileSize,
        performance: {
          durationMs: duration,
          durationSeconds: (duration / 1000).toFixed(2),
        }
      });
      
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      logger.error('Conversion failed', { 
        conversionId,
        error: error instanceof Error ? error.message : String(error),
        sourceFormat, 
        targetFormat,
        inputPath,
        duration: `${duration}ms`,
        stack: error instanceof Error ? error.stack : undefined
      });
      // Cleanup temp files even on error
      await this.cleanupTempFiles(tempFiles);
      throw error;
    }
  }

  /**
   * Get file size in bytes
   */
  private async getFileSize(filePath: string): Promise<number> {
    try {
      const stats = await fs.stat(filePath);
      return stats.size;
    } catch {
      return 0;
    }
  }

  /**
   * Cleanup temporary files
   */
  private async cleanupTempFiles(files: string[]): Promise<void> {
    for (const file of files) {
      try {
        await fs.unlink(file);
        logger.debug('Cleaned up temp file', { file });
      } catch (error) {
        logger.warn('Failed to cleanup temp file', { file, error });
      }
    }
  }

  /**
   * CON-2: Convert using LibreOffice
   * Logs conversion progress and performance
   */
  private async convertWithLibreOffice(
    inputPath: string,
    outputPath: string,
    targetFormat: string
  ): Promise<string> {
    const startTime = Date.now();
    logger.info('LibreOffice conversion started', { inputPath, targetFormat, outputPath });
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
        await fs.access(expectedOutput);
        if (expectedOutput !== outputPath) {
          await fs.rename(expectedOutput, outputPath);
        }
        finalOutput = outputPath;
      } catch {
        // File might already be at outputPath
      }

      const duration = Date.now() - startTime;
      logger.info('LibreOffice conversion completed', { 
        finalOutput, 
        duration: `${duration}ms`,
        performance: { durationMs: duration }
      });
      return finalOutput;
    } catch (error) {
      const duration = Date.now() - startTime;
      logger.error('LibreOffice conversion failed', { 
        error: error instanceof Error ? error.message : String(error),
        inputPath,
        targetFormat,
        duration: `${duration}ms`
      });
      throw new Error(`LibreOffice conversion failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * CON-2: Convert using ImageMagick
   * Logs conversion progress and performance
   */
  private async convertWithImageMagick(
    inputPath: string,
    outputPath: string,
    targetFormat: string
  ): Promise<string> {
    const startTime = Date.now();
    const command = `convert "${inputPath}" "${outputPath}"`;

    logger.info('ImageMagick conversion started', { command, inputPath, targetFormat });

    try {
      const { stdout, stderr } = await execAsync(command, { timeout: 10000 });
      
      if (stderr) {
        logger.warn('ImageMagick stderr', { stderr });
      }

      const duration = Date.now() - startTime;
      logger.info('ImageMagick conversion completed', { 
        outputPath,
        duration: `${duration}ms`,
        performance: { durationMs: duration }
      });
      return outputPath;
    } catch (error) {
      const duration = Date.now() - startTime;
      logger.error('ImageMagick conversion failed', { 
        error: error instanceof Error ? error.message : String(error),
        inputPath,
        targetFormat,
        duration: `${duration}ms`
      });
      throw new Error(`ImageMagick conversion failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * CON-2: Convert using Ghostscript
   * Logs conversion progress and performance
   */
  private async convertWithGhostscript(
    inputPath: string,
    outputPath: string,
    sourceFormat: string,
    targetFormat: string
  ): Promise<string> {
    if (targetFormat === 'pdf') {
      const startTime = Date.now();
      // Convert to PDF
      const command = `gs -dNOPAUSE -dBATCH -sDEVICE=pdfwrite -sOutputFile="${outputPath}" "${inputPath}"`;

      logger.info('Ghostscript PDF conversion started', { command, inputPath });

      try {
        await execAsync(command, { timeout: 30000 });
        const duration = Date.now() - startTime;
        logger.info('Ghostscript conversion completed', { 
          outputPath,
          duration: `${duration}ms`,
          performance: { durationMs: duration }
        });
        return outputPath;
      } catch (error) {
        const duration = Date.now() - startTime;
        logger.error('Ghostscript conversion failed', { 
          error: error instanceof Error ? error.message : String(error),
          inputPath,
          duration: `${duration}ms`
        });
        throw new Error(`Ghostscript conversion failed: ${error instanceof Error ? error.message : String(error)}`);
      }
    } else {
      throw new Error(`Ghostscript does not support conversion to ${targetFormat}`);
    }
  }

  /**
   * CON-2: Convert using Tesseract OCR
   * Logs conversion progress and performance
   */
  private async convertWithOCR(inputPath: string, outputPath: string): Promise<string> {
    const startTime = Date.now();
    const command = `tesseract "${inputPath}" "${outputPath.replace(/\.txt$/, '')}" -l eng`;

    logger.info('OCR conversion started', { command, inputPath });

    try {
      const { stdout, stderr } = await execAsync(command, { timeout: 30000 });
      
      if (stderr && !stderr.includes('Tesseract')) {
        logger.warn('OCR stderr', { stderr });
      }

      // Tesseract adds .txt extension
      const finalPath = outputPath.endsWith('.txt') ? outputPath : `${outputPath}.txt`;
      const duration = Date.now() - startTime;
      
      logger.info('OCR conversion completed', { 
        finalPath,
        duration: `${duration}ms`,
        performance: { durationMs: duration }
      });
      return finalPath;
    } catch (error) {
      const duration = Date.now() - startTime;
      logger.error('OCR conversion failed', { 
        error: error instanceof Error ? error.message : String(error),
        inputPath,
        duration: `${duration}ms`
      });
      throw new Error(`OCR conversion failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private generateOutputPath(inputPath: string, targetFormat: string): string {
    const inputDir = path.dirname(inputPath);
    const inputBasename = path.basename(inputPath, path.extname(inputPath));
    const outputFilename = `${inputBasename}_${uuidv4().substring(0, 8)}.${targetFormat}`;
    return path.join(inputDir, outputFilename);
  }

  private isDocumentFormat(format: string): boolean {
    const docFormats = ['doc', 'docx', 'odt', 'rtf', 'txt', 'html', 'pdf'];
    return docFormats.includes(format.toLowerCase());
  }

  private isImageFormat(format: string): boolean {
    const imageFormats = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'webp'];
    return imageFormats.includes(format.toLowerCase());
  }
}

