const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const httpErrors = require('http-errors');
const debug = require('debug')('beerTracker:server');

const handleError = require('./lib/app-error');
const beerRouter = require('./route/beer-route');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(morgan('dev'));

app.all('/', (req, res, next) => {
  res.send('Nice work, now crack open a beer.');
});

app.use('/api', beerRouter);

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
