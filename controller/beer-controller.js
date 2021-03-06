'use strict';
const debug = require('debug')('beerTracker:beerController');
const httpErrors = require('http-errors');
const Beer = require('../model/beer');

exports.createBeer = function(beerData) {
  debug('createBeer');
  return new Promise((resolve, reject) => {
    Beer.save(beerData)
      .then(beer => resolve(beer))
      .catch(err => reject(httpErrors(400, err.message)));
  });
};

exports.fetchBeer = function(beerId) {
  debug('fetchBeer', beerId);
  return new Promise((resolve, reject) => {
    Beer.findOne(beerId)
      .then(beer => resolve(beer))
      .catch(err => reject(httpErrors(404, err.message)));
  });
};

exports.fetchAllBeers = function() {
  debug('fetchAllBeers');
  return new Promise((resolve, reject) => {
    Beer.find()
      .then(resolve)
      .catch(err => reject(httpErrors(404, err.message)));
  });
};

exports.fetchBeerByDevice = function(deviceId) {
  debug('fetchBeerByDevice', deviceId);
  return new Promise((resolve, reject) => {
    Beer.find()
      .then(beers =>
        beers.filter(beer => beer.device && beer.device.macId.toString() === deviceId.toString())
      )
      .then(resolve)
      .catch(reject);
  });
};

exports.updateBeer = function(beerId, beerData) {
  debug('updating beer', beerId);
  return new Promise((resolve, reject) => {
    if (Object.keys(beerData).length === 0)
      return reject(httpErrors(400, 'need to provide a body'));

    //TODO -- this validation should be handled by the model
    const beerKeys = ['name', 'device', 'transactions'];
    Object.keys(beerData).forEach(key => {
      if (beerKeys.indexOf(key) === -1)
        return reject(httpErrors(400, 'key does not exist in Beer object'));
    });

    Beer.findByIdAndUpdate(beerId, beerData)
      .then(() => Beer.findOne(beerId).then(resolve)) //should we fetch beers here?
      .catch(err => reject(httpErrors(404, err.message)));
  });
};

exports.removeBeer = function(beerId) {
  debug('delete one beer');
  return new Promise((resolve, reject) => {
    Beer.remove(beerId)
      .then(resolve)
      .catch(() => reject(httpErrors(404, 'beer not found')));
  });
};

exports.addTransaction = function(beerId, transaction) {
  debug('beerTracker:addTransaction', transaction);
  return new Promise((resolve, reject) => {

    Beer.addTransaction(beerId, transaction)
      .then(resolve)
      .catch(reject);
  });
};

exports.fetchAllTransactions = function(beerId) {
  debug('beerTracker:fetchAllTransactions');
  return new Promise((resolve, reject) => {
    Beer.findById(beerId)
      .then(beer => resolve(beer.transactions))
      .catch(err => reject(httpErrors(404, err.message)));
  });
};

exports.removeTransaction = function(beerId, transactionId) {
  debug('beerTracker:removeTransaction');
  return new Promise((resolve, reject) => {
    Beer.remove(beerId, transactionId)
      .then(resolve)
      .catch(err => reject(httpErrors(404, err.message)));
  });
};
