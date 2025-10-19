import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Ride-Connect API',
      version: '1.0.0',
      description: 'API for the Ride-Connect application, an Uber-inspired ride-hailing service.',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
  },
  // Path to the files containing OpenAPI annotations
  apis: ['./src/routers/*.ts'],
};

export const swaggerSpecs = swaggerJsdoc(options);
