'use strict';

const Koa = require('koa');
const bodyParser = require('koa-bodyparser');

const config = require('./config');
const router = require('./lib/routes');
const sequelize = require('./lib/models/connection');

const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('koa2-swagger-ui');
const swaggerDef = require('./lib/middleware/swaggerDef');

//require('./lib/models/user');
require('./lib/models/issueRevision');

const app = new Koa();

const swaggerSpec = swaggerJSDoc({
  swaggerDefinition: swaggerDef,
  apis: ['./lib/routes.js'], // Path to the API docs
});
app.use(
  swaggerUi.koaSwagger({
    routePrefix: '/docs', // Swagger UI endpoint
    swaggerOptions: { spec: swaggerSpec },
  })
);

app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(config.port);
console.log('Listening on http://localhost:%s/', config.port);
console.log('Swagger docs at http://localhost:8080/docs');

/*sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database synchronized (with alter)');
    app.listen(config.port);
    console.log('Listening on http://localhost:%s/', config.port);
  })
  .catch((err) => {
    console.error('Error synchronizing database:', err);
  });*/