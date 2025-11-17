/**
 * CON-4: Logs Controller Tests
 */

import request from 'supertest';
import express, { Application } from 'express';
import { LogsController } from '../src/controllers/logs.controller';
import fs from 'fs/promises';
import path from 'path';

describe('LogsController', () => {
  let app: Application;
  let logsController: LogsController;
  const testLogDir = path.join(__dirname, '../temp-logs');

  beforeEach(async () => {
    app = express();
    app.use(express.json());
    logsController = new LogsController();

    // Create test log directory
    try {
      await fs.mkdir(testLogDir, { recursive: true });
    } catch {
      // Ignore errors
    }

    // Setup routes
    app.get('/api/logs', (req, res) => {
      logsController.getLogFiles(req, res);
    });
  });

  afterEach(async () => {
    try {
      await fs.rm(testLogDir, { recursive: true, force: true });
    } catch {
      // Ignore errors
    }
  });

  test('should return list of log files', async () => {
    // Create a test log file
    const testLogFile = path.join(testLogDir, 'test.log');
    await fs.writeFile(testLogFile, 'test content');

    const response = await request(app).get('/api/logs');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('should handle empty log directory', async () => {
    const response = await request(app).get('/api/logs');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});

