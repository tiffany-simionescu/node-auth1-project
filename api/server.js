const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');

// Saves session info in database
const knexSessionStore = require('connect-session-knex')(session);
const dbConfig = require('../database/db-config');

const apiRouter = require('./api-router');

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

server.use(session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.SECRET || "Keep it secret, keep it safe!",
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    secure: false,
  },
  store: new knexSessionStore({
    knex: dbConfig,
    createTable: true,
  })
}))

server.use('/api', apiRouter);

server.get('/', (req, res) => {
  console.log(req.headers);
  res.json({ api: 'up' });
});

server.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    message: "Something went wrong"
  })
})

module.exports = server;