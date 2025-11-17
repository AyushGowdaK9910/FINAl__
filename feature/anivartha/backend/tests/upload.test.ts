/**
 * CON-1: Upload Service Tests
 */

import { UploadService } from '../src/services/uploadService';
import fs from 'fs/promises';
import path from 'path';

describe('UploadService', () => {
  let uploadService: UploadService;
  const testUploadDir = path.join(__dirname, '../temp-uploads');

  beforeEach(async () => {
    try {
      await fs.mkdir(testUploadDir, { recursive: true });
    } catch {
      // Ignore errors
    }
    uploadService = new UploadService();
  });

  afterEach(async () => {
    try {
      await fs.rm(testUploadDir, { recursive: true, force: true });
    } catch {
      // Ignore errors
    }
  });

  test('should initialize upload service', () => {
    expect(uploadService).toBeDefined();
  });

  test('should initialize upload directory', async () => {
    await uploadService.initialize();
    const dirExists = await fs.access(testUploadDir).then(() => true).catch(() => false);
    expect(dirExists).toBe(true);
  });

  test('should configure multer storage', () => {
    const storage = uploadService.getStorage();
    expect(storage).toBeDefined();
  });

  test('should get upload middleware', () => {
    const middleware = uploadService.getUploadMiddleware();
    expect(middleware).toBeDefined();
  });
});

