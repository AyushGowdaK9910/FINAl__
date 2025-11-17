/**
 * CON-5: File Validation Tests
 */

import { FileValidationService } from '../src/services/validateFile';
import fs from 'fs/promises';
import path from 'path';

describe('FileValidationService', () => {
  let validationService: FileValidationService;
  const testDir = path.join(__dirname, '../temp-validation');

  beforeEach(async () => {
    try {
      await fs.mkdir(testDir, { recursive: true });
    } catch {
      // Ignore errors
    }
    validationService = new FileValidationService();
  });

  afterEach(async () => {
    try {
      await fs.rm(testDir, { recursive: true, force: true });
    } catch {
      // Ignore errors
    }
  });

  test('should initialize validation service', () => {
    expect(validationService).toBeDefined();
  });

  test('should validate PDF files', async () => {
    const testFile = path.join(testDir, 'test.pdf');
    await fs.writeFile(testFile, 'test content');
    
    const result = await validationService.validateFile(testFile, 'application/pdf');
    expect(result.valid).toBe(true);
  });

  test('should validate image files', async () => {
    const jpegFile = path.join(testDir, 'test.jpg');
    await fs.writeFile(jpegFile, 'test content');
    
    const result = await validationService.validateFile(jpegFile, 'image/jpeg');
    expect(result.valid).toBe(true);
  });

  test('should reject files that are too large', async () => {
    // Create a large file
    const largeFile = path.join(testDir, 'large.pdf');
    const largeContent = Buffer.alloc(100 * 1024 * 1024); // 100MB
    await fs.writeFile(largeFile, largeContent);
    
    const result = await validationService.validateFile(largeFile, 'application/pdf');
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  test('should reject unsupported file types', async () => {
    const exeFile = path.join(testDir, 'test.exe');
    await fs.writeFile(exeFile, 'test content');
    
    const result = await validationService.validateFile(exeFile, 'application/x-executable');
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });
});

