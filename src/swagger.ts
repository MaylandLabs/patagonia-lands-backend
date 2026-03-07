import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Patagonia Lands API',
      version: '1.0.0',
      description: 'API for Patagonia Lands real estate website',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    tags: [
      { name: 'Auth', description: 'Authentication' },
      { name: 'Properties', description: 'Public property endpoints' },
      { name: 'Admin Properties', description: 'Admin property management' },
      { name: 'Publish Requests', description: 'Publish request endpoints' },
    ],
  },
  apis: ['./src/routes/*.ts', './dist/routes/*.js'],
};

export const swaggerSpec = swaggerJsdoc(options);
