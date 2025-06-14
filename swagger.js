const swaggerAutogen = require('swagger-autogen');
const fs = require('fs');
const yaml = require('js-yaml');
require('dotenv').config();

const outputFile = './swaggerDoc.json';
const endpointsFiles = [
    './src/main.js',
    './src/routes/userRoute.js',
    './src/routes/tagRoute.js'
  ];
const doc = {
    info: {
        title: 'API de Red Social',
        description: 'Documentación de la API para la red social'
    },
    host:  `localhost:${process.env.PORT || 3000}`,
    schemes: ['http'],
    tags: [
      { name: 'Users'},
      { name: 'Tags'}
    ]
};

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    // Convertimos JSON a YAML
    const jsonContent = require(outputFile);
    const yamlContent = yaml.dump(jsonContent);
  
    fs.writeFileSync('./swagger.yaml', yamlContent, 'utf8');
    console.log('Swagger YAML generado exitosamente como swagger.yaml');
  });