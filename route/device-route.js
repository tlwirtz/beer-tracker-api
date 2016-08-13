'use strict';

const debug = require('debug')('beerTracker:device-route');
const Router = require('express').Router;
const httpErrors = requrie('http-errors');
const jsonParser = require('body-parser').json();
const beerController = require('../controller/beer-controller');

const deviceRouter = module.exports = new Router;
// /api/devices/:macAddr/transaction
// make req to /api/devices

deviceRouter.post('/devices/:macAddr/transaction', jsonParser, (req, res, next) => {
  debug('POST /api/devices/:macAddr/transaction');
  //adds a transaction to the beer associated with MAC address
});

deviceRouter.get('/devices/', (req, res, next) => {
  //returns all the devices currently in use.
  //probably time to build a device model
});
