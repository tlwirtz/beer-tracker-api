'use strict';

const debug = require('debug')('deviceTracker:deviceController');
const httpErrors = require('http-errors');
const Device = require('../model/device');

//TODO -- add error handling
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

exports.updateDevice = function(deviceId, deviceData) {
  debug('updating device', deviceId);
  return new Promise((resolve, reject) => {
    if (Object.keys(deviceData).length === 0) return reject(httpErrors(400, 'need to provide a body'));

    const deviceKeys = ['name', 'device', 'beerId'];
    Object.keys(deviceData).forEach((key) => {
      if (deviceKeys.indexOf(key) === -1) return reject(httpErrors(400, 'key does not exist in Device object'));
    });

    Device.findByIdAndUpdate(deviceId, deviceData)
    .then(() => Device.findOne({_id: deviceId}).then(resolve))
    .catch(err => reject(httpErrors(404, err.message)));
  });
};

exports.removeDevice = function(deviceId){
  debug('delete one device');
  return new Promise((resolve, reject) => {
    Device.remove({_id: deviceId})
    .then(resolve)
    .catch(() => reject(httpErrors(404, 'device not found')));
  });
};

exports.removeAllDevices = function(){
  return Device.remove({});
};
