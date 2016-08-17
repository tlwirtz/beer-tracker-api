'use strict';
const debug = require('debug')('beerTracker:device-router');
const Router = require('express').Router;
const httpErrors = require('http-errors');
const beerController = require('../controller/beer-controller');
const deviceController = require('../controller/device-controller');
const jsonParser = require('body-parser').json();

const deviceRouter = module.exports = new Router();
deviceRouter.post('/device/:macAddr/transaction', jsonParser, (req, res, next) => {
  debug('POST /api/device/:macAddr/transaction');
  beerController.findBeerByDevice(req.params.macAddr)
  .then(beers => beerController.addTransaction(beers[0], req.body))
  .then(beer => res.json(beer))
  .catch(next);
});

deviceRouter.get('/device', (req, res, next) => {
  debug('GET /api/devices');
  deviceController.fetchAllDevices()
  .then(devices => res.json(devices))
  .catch(next);
});

deviceRouter.post('/device', (req, res, next) => {
  debug('POST /api/devices');
  deviceController.createDevice(req.body)
  .then(device => res.json(device))
  .catch(next);
});

deviceRouter.get('/device/:id', (req, res, next) => {
  debug('GET /api/device/:id', req.params.id);
  deviceController.fetchBeer(req.params.id)
  .then(device => {
    if (!device) return next(httpErrors(404, 'device not found'));
    res.json(device);
  })
  .catch(next);
});

deviceRouter.put('/device/:id', jsonParser, (req, res, next) => {
  debug('PUT /api/device/:id', req.params.id, req.body);
  deviceController.updateBeer(req.params.id, req.body)
  .then(device => {
    if (!device) return next(httpErrors(404, 'device not found'));
    res.json(device);
  })
  .catch(next);
});

deviceRouter.delete('/device/:id', (req, res, next) => {
  debug('DELETE /api/device/:id', req.params.id);
  deviceController.removeBeer(req.params.id)
  .then(() => res.status(204).send())
  .catch(next);
});
