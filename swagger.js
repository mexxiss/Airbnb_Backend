import swaggerAutogen from 'swagger-autogen';

// Swagger documentation config
const doc = {
  info: {
    title: "API Documentation",
    version: "1.0.0",
    description: "For Airbnb Management Platform",
  },
  host: 'localhost:8000',
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
      },
    },
  },
  basePath: '/api/v1',
  security: [
    {
      bearerAuth: [],
    },
  ],
  tags: [
    {
      name: "Users",
      description: "User management routes",
    },
    {
      name: "Admin",
      description: "Admin-related routes",
    },
    {
      name: "General",
      description: "Other general routes",
    },
  ],
  paths: {
    '/users': {
      get: {
        tags: ['Users'],
        summary: 'Get all users',
        responses: {
          '200': { description: 'Success' }
        }
      }
    },
    '/admin': {
      get: {
        tags: ['Admin'],
        summary: 'Admin route',
        responses: {
          '200': { description: 'Success' }
        }
      }
    },
  }
};

const outputFile = './swagger.json';
const endpointsFiles = [ './routes/index.js' ];

// Generate Swagger documentation
swaggerAutogen({ openapi: '3.0.0' })(outputFile, endpointsFiles, doc);