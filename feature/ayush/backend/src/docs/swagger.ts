/**
 * CON-7: Swagger/OpenAPI Documentation Setup
 */

import { Application } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import { serve, setup } from 'swagger-ui-express';
import redoc from 'redoc-express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'File Converter API',
      version: '1.0.0',
      description: 'API documentation for File Converter Service',
      contact: {
        name: 'API Support',
        email: 'support@fileconverter.com',
      },
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    tags: [
      {
        name: 'Health',
        description: 'Health check endpoints',
      },
      {
        name: 'Files',
        description: 'File operations',
      },
    ],
    components: {
      schemas: {
        HealthResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'ok',
            },
            uptime: {
              type: 'number',
              example: 12345,
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
            },
            message: {
              type: 'string',
            },
          },
        },
      },
    },
  },
  apis: ['./src/**/*.ts'], // Path to the API files (relative to project root)
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Application): void => {
  // Swagger UI
  app.use('/api-docs', serve, setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'File Converter API Documentation',
  }));

  // Swagger JSON endpoint
  app.get('/api-docs.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  // Redoc
  app.get('/api-docs/redoc', redoc({
    title: 'File Converter API',
    specUrl: '/api-docs.json',
    nonce: '',
    redocOptions: {
      theme: {
        colors: {
          primary: {
            main: '#32329f',
          },
        },
      },
    },
  }));
};

