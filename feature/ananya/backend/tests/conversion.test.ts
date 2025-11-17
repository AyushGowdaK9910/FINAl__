/**
 * CON-2: Tests for Conversion Service
 */

import { ConversionService } from '../src/services/conversion.service';
import fs from 'fs/promises';
import path from 'path';

describe('ConversionService', () => {
  let conversionService: ConversionService;
  const testDir = path.join(__dirname, '../temp');

  beforeAll(async () => {
    await fs.mkdir(testDir, { recursive: true });
    conversionService = new ConversionService(testDir);
  });

  afterAll(async () => {
    // Cleanup
    try {
      await fs.rm(testDir, { recursive: true });
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  test('should initialize conversion service', () => {
    expect(conversionService).toBeDefined();
  });

  // Add more tests for actual conversion when test files are available
});

