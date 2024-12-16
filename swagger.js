import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: "API Documentation",
    version: "1.0.0",
    description: "For Airbnb Management Platform",
  },
  servers: [
    {
      url: "http://localhost:8000/api/v1",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
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
  ],
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

swaggerAutogen()(outputFile, endpointsFiles, doc);