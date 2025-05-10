'use strict';

const Koa = require('koa');
const bodyParser = require('koa-bodyparser');

const config = require('./config');
const router = require('./lib/routes');
const sequelize = require('./lib/models/connection');

//require('./lib/models/user');
require('./lib/models/issueRevision');

const app = new Koa();

app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(config.port);
console.log('Listening on http://localhost:%s/', config.port);

/*sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database synchronized (with alter)');
    app.listen(config.port);
    console.log('Listening on http://localhost:%s/', config.port);
  })
  .catch((err) => {
    console.error('Error synchronizing database:', err);
  });*/