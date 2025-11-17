/**
 * CON-9: Health Check Tests
 */

import request from 'supertest';
import app from '../src/express-setup';

describe('Health Check Endpoints', () => {
  test('GET /api/health should return 200', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
    expect(response.body.uptime).toBeDefined();
  });

  test('GET /api/health/detailed should return detailed status', async () => {
    const response = await request(app).get('/api/health/detailed');
    expect([200, 503]).toContain(response.status);
    expect(response.body.status).toBeDefined();
    expect(response.body.services).toBeDefined();
  });

  test('GET /api/health/uptime should return uptime', async () => {
    const response = await request(app).get('/api/health/uptime');
    expect(response.status).toBe(200);
    expect(response.body.uptime).toBeDefined();
    expect(response.body.formatted).toBeDefined();
  });
});

