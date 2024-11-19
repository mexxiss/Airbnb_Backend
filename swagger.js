import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'My API',
    description: 'Description'
  },
  host: 'localhost:8000'
};

const outputFile = './swagger.json';
const routes = ['./routes/index.js'];

swaggerAutogen()(outputFile, routes, doc);