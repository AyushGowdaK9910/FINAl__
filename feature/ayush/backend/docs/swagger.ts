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

// Generate Swagger specification from JSDoc comments
// Configure API path scanning to find all route definitions
const swaggerSpec = swaggerJsdoc(options);

/**
 * Setup Swagger documentation
 * Implements setupSwagger function with API path scanning
 * Configure Swagger JSON endpoint and custom Swagger UI theme
 */
export const setupSwagger = (app: Application): void => {
  // Swagger UI endpoint - Set up custom Swagger UI theme
  app.use('/api-docs', serve, setup(swaggerSpec, {
    explorer: true,
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info { margin: 20px 0; }
      .swagger-ui .scheme-container { background: #fafafa; padding: 10px; }
    `,
    customSiteTitle: 'File Converter API Documentation',
    customfavIcon: '/favicon.ico',
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      showExtensions: true,
      showCommonExtensions: true,
    },
  }));

  // Swagger JSON endpoint - Add Swagger JSON endpoint for programmatic access
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
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

