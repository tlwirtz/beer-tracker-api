'use strict';

const debug = require('debug')('beerTracker:deviceController');
const httpErrors = require('http-errors');
const Device = require('../model/device');

exports.createDevice = function(deviceData) {
  debug('createDevice');
  return new Promise((resolve, reject) => {
    new Device(deviceData).save()
    .then(device => resolve(device))
    .catch(err => reject(httpErrors(400, err.message)));
  });
};

exports.fetchAllDevices = function() {
  debug('fetchAllDevices');
  return new Promise((resolve, reject) => {
    Device.find({})
    .then(resolve)
    .catch(err => reject(httpErrors(404, err.message)));
  });
};
