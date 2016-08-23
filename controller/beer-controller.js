'use strict';

const debug = require('debug')('beerTracker:beerController');
const httpErrors = require('http-errors');
const uuid = require('uuid');
const Beer = require('../model/beer');
const mongoose = require('mongoose');

exports.createBeer = function(beerData) {
  debug('createBeer');
  return new Promise((resolve, reject) => {
    new Beer(beerData).save()
    .then(beer => resolve(beer))
    .catch(err => reject(httpErrors(400, err.message)));
  });
};

exports.fetchBeer = function(beerId) {
  debug('fetchBeer', beerId);
  return new Promise((resolve, reject) => {
    Beer.findOne({_id: beerId})
    .then(beer => resolve(beer))
    .catch(err => reject(httpErrors(404, err.message)));
  });
};

exports.fetchAllBeers = function() {
  debug('fetchAllBeers');
  return new Promise((resolve, reject) => {
    Beer.find({})
    .then(resolve)
    .catch(err => reject(httpErrors(404, err.message)));
  });
};

exports.fetchBeerByDevice = function(deviceId) {
  debug('fetchBeerByDevice', deviceId);
  return new Promise((resolve, reject) => {
    Beer.find({})
    .then(beers => beers.filter(beer => beer.device.macId === deviceId))
    .then(resolve)
    .catch(reject);
  });
};

exports.updateBeer = function(beerId, beerData) {
  debug('updating beer', beerId);
  return new Promise((resolve, reject) => {
    if (Object.keys(beerData).length === 0) return reject(httpErrors(400, 'need to provide a body'));

    const beerKeys = ['name', 'device', 'transactions'];
    Object.keys(beerData).forEach((key) => {
      if (beerKeys.indexOf(key) === -1) return reject(httpErrors(400, 'key does not exist in Beer object'));
    });

    Beer.findByIdAndUpdate(beerId, beerData)
    .then(() => Beer.findOne({_id: beerId}).then(resolve))
    .catch(err => reject(httpErrors(404, err.message)));
  });
};

exports.removeBeer = function(beerId){
  debug('delete one beer');
  return new Promise((resolve, reject) => {
    Beer.remove({_id: beerId})
    .then(resolve)
    .catch(() => reject(httpErrors(404, 'beer not found')));
  });
};

exports.removeAllBeers = function(){
  return Beer.remove({});
};

exports.addTransaction = function(beerId, transaction) {
  debug('beerTracker:addTransaction', transaction);
  return new Promise((resolve, reject) => {
    if (!transaction || !transaction.type || !transaction.qty) return reject(httpErrors(400, 'bad request - no type or qty'));

    transaction.id = uuid.v4();
    transaction.dateTime = Date.now();

    Beer.findByIdAndUpdate(
      beerId,
      {$push: {'transactions': transaction}},
      {safe: true, upsert: true, new: true}
    ).then(resolve)
    .catch((err) => reject(httpErrors(404, err.message)) );
  });
};

exports.fetchAllTransactions = function(beerId) {
  debug('beerTracker:fetchAllTransactions');
  return new Promise((resolve, reject) => {
    Beer.findById({_id: beerId})
    .then(beer => resolve(beer.transactions))
    .catch(err => reject(httpErrors(404, err.message)));
  });
};

exports.removeTransaction = function(beerId, transactionId) {
  debug('beerTracker:removeTransaction');
  return new Promise((resolve, reject) => {
    Beer.findOneAndUpdate({_id: beerId},
      {$pull: {transactions: {id: transactionId}}},
      {'new':true})
    .then(beer => {
      resolve(beer);
    })
    .catch(err => reject(httpErrors(404, err.message)));
  });
};
