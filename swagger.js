const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');



const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Gozem Package Delivery REST API',
      version: '1.0.0',
      description: 'Package Delivery REST API',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}`,
      },
    ],
  },
  apis: ['./src/routes/v1/*.ts'],
};

const specs = swaggerJsdoc(options);

module.exports = {
  specs,
  swaggerUi,
}
