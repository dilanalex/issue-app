module.exports = {
  openapi: '3.0.0',
  info: {
    title: 'Testlio Trial-Day API',
    version: '1.0.0',
    description: 'API documentation for the Testlio trial-day project',
  },
  servers: [
    { url: 'http://localhost:8080' }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  }
};