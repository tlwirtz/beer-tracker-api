'use strict';

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const httpErrors = require('http-errors');
const debug = require('debug')('beerTracker:server');

const handleError = require('./lib/app-error');

const app = express();
const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost/beerTracker';

mongoose.connect(mongoURI);

app.use(morgan('dev'));

app.all('*', function(req, res, next) {
  debug('404 * route');
  next(httpErrors(404, 'Not Found'));
});

app.use(handleError);

const server = app.listen(port, function() {
  debug('server is up on port', port);
});

server.isRunning = true;
module.exports = server;
