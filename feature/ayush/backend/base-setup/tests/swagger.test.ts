/**
 * CON-7: Swagger Documentation Tests
 */

import request from 'supertest';
import app from '../src/express-setup';

describe('Swagger Documentation Endpoints', () => {
  test('GET /api-docs should serve Swagger UI', async () => {
    const response = await request(app).get('/api-docs').redirects(1);
    expect([200, 301]).toContain(response.status);
    if (response.status === 200) {
      expect(response.headers['content-type']).toContain('text/html');
    }
  });

  test('GET /api-docs.json should return OpenAPI spec', async () => {
    const response = await request(app).get('/api-docs.json');
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('application/json');
    expect(response.body).toHaveProperty('openapi');
    expect(response.body).toHaveProperty('info');
    expect(response.body.info.title).toBe('File Converter API');
  });

  test('GET /api-docs/redoc should serve Redoc UI', async () => {
    const response = await request(app).get('/api-docs/redoc');
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('text/html');
  });

  test('OpenAPI spec should have correct structure', async () => {
    const response = await request(app).get('/api-docs.json');
    expect(response.body.openapi).toBe('3.0.0');
    expect(response.body.info.version).toBe('1.0.0');
    expect(response.body.servers).toBeDefined();
    expect(Array.isArray(response.body.servers)).toBe(true);
  });
});

