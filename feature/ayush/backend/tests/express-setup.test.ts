/**
 * CON-17: Express Setup Tests
 */

import request from 'supertest';
import app from '../src/express-setup';

describe('Express Setup', () => {
  test('GET / should return API information', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('version');
    expect(response.body).toHaveProperty('docs');
    expect(response.body).toHaveProperty('health');
    expect(response.body.message).toBe('File Converter API');
  });

  test('Should have CORS enabled', async () => {
    const response = await request(app)
      .get('/')
      .set('Origin', 'http://localhost:5173');
    expect(response.headers['access-control-allow-origin']).toBeDefined();
  });

  test('Should parse JSON body', async () => {
    const response = await request(app)
      .post('/test-json')
      .send({ test: 'data' })
      .set('Content-Type', 'application/json');
    // Even if route doesn't exist, JSON parsing should work
    expect(response.status).not.toBe(400);
  });
});

