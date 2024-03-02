import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import express from 'express';
import YAML from 'yamljs';
import fs from 'fs';

const app = express();

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Virtual Examination Portal',
    version: '1.0.0',
    description: 'API documentation for your Node.js application',
  },
  components: {
    securitySchemes: {
      Auth: {
        type: 'apiKey',
        in: 'header',
        name: 'Authorization',
      },
    },
  },
  security: [
    {
      Auth: [],
    },
  ],
  basePath: '/',
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'], // Path to  route files
};

const swaggerSpec = swaggerJSDoc(options);

// Save the Swagger definition to a YAML file
const swaggerYamlFile = 'swagger.yaml';
fs.writeFileSync(swaggerYamlFile, YAML.stringify(swaggerSpec));

const swg = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

export default swg;