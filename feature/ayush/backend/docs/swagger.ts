/**
 * CON-7: Swagger/OpenAPI Documentation Setup
 * 
 * Features:
 * - Install swagger-jsdoc and swagger-ui-express
 * - Configure OpenAPI 3.0 specification
 * - Set up Swagger UI endpoint
 * - Add API documentation structure
 */

import { Application } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { serve, setup } from 'swagger-ui-express';
import redoc from 'redoc-express';

// OpenAPI 3.0 specification configuration
const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'File Converter API',
      version: '1.0.0',
      description: 'API documentation for File Converter Service - Complete API reference with request/response schemas',
      contact: {
        name: 'API Support',
        email: 'support@fileconverter.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
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
  apis: ['./src/**/*.ts'], // Path to the API files
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
  app.get('/api-docs.json', (req, res) => {
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

