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
    schemas: {
      SignUpRequest: {
        type: 'object',
        properties: {
          first_name: { type: 'string', example: 'John' },
          last_name: { type: 'string', example: 'Doe' },
          email: {
            type: 'array',
            items: { type: 'string', format: 'email', example: 'john.doe@example.com' },
          },
          phone: { type: 'array', items: { type: 'string', format: 'string', example: '+919876543210' } },
          role: {
            type: 'string',
            enum: ['Owner', 'Admin'],
            example: 'Admin',
          },
          address: { 
            type: 'object', 
            example: {
              building_no: "123",
              city: "Springfield",
              street: "Main Street",
              area: "Downtown",
              landmark: "Near City Mall",
              country: "Dubai",
              pincode: "123456"
            } 
          },
        },
        required: ['first_name', 'last_name', 'email', 'phone', 'address'],
      },
      ApiResponse: {
        type: 'object',
        properties: {
          status: { type: 'integer', example: 201 },
          data: {
            type: 'object',
            properties: {
              newUser: { $ref: '#/components/schemas/SignUpRequest' },
              password: { type: 'string', example: 'GeneratedPassword123' },
            },
          },
          message: { type: 'string', example: 'User created Successfully' },
        },
      },
    }
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
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

// Generate Swagger documentation
swaggerAutogen({ openapi: '3.0.0' })(outputFile, endpointsFiles, doc);