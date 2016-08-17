'use strict';
const debug = require('debug')('beerTracker:device-router');
const Router = require('express').Router;
const httpErrors = require('http-errors');
const beerController = require('../controller/beer-controller');
const deviceController = require('../controller/device-controller');
const jsonParser = require('body-parser').json();

const deviceRouter = module.exports = new Router();

//TODO -- add all basic crud routes
deviceRouter.post('/device/:macAddr/transaction', jsonParser, (req, res, next) => {
  debug('POST /api/device/:macAddr/transaction');
  beerController.findBeerByDevice(req.params.macAddr)
  .then(beers => beerController.addTransaction(beers[0], req.body))
  .then(beer => res.json(beer))
  .catch(next);
});

deviceRouter.get('/devices', (req, res, next) => {
  debug('GET /api/devices');
  //return devices using controller
});

deviceRouter.post('/devices', (req, res, next) => {
  //use device controller
});
