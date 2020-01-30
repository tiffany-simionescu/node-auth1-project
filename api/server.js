const express = require('express');

const apiRouter = require('./api-router');
const configMiddleware = require('./config-middleware');

const server = express();

configMiddleware(server);

server.use('/api', apiRouter);

module.exports = server;