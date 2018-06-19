import * as debug from 'debug';
import * as httpErrors from 'http-errors';
import Beer, { BeerSchema, BeerTransaction } from '../model/beer';

const customDebugger = debug('beerTracker:beerController');

export const createBeer = function(beerData: BeerSchema) {
  customDebugger('createBeer');
  return new Promise((resolve, reject) => {
    Beer.save(beerData)
      .then(beer => resolve(beer))
      .catch(err => reject(httpErrors(400, err.message)));
  });
};

export const fetchBeer = function(beerId: string) {
  customDebugger('fetchBeer', beerId);
  return new Promise((resolve, reject) => {
    Beer.findOne(beerId)
      .then(beer => resolve(beer))
      .catch(err => reject(httpErrors(404, err.message)));
  });
};

export const fetchAllBeers = function() {
  customDebugger('fetchAllBeers');
  return new Promise((resolve, reject) => {
    Beer.find()
      .then(resolve)
      .catch(err => reject(httpErrors(404, err.message)));
  });
};

//! -- THIS IS NOT SUPPORTED BY CURRENT BEER MODEL
// export const fetchBeerByDevice = function(deviceId) {
//   customDebugger('fetchBeerByDevice', deviceId);
//   return new Promise((resolve, reject) => {
//     Beer.find()
//       .then(beers =>
//         beers.filter(beer => beer.device && beer.device.macId.toString() === deviceId.toString())
//       )
//       .then(resolve)
//       .catch(reject);
//   });
// };

export const updateBeer = function(beerId: string, beerData: BeerSchema) {
  customDebugger('updating beer', beerId);
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

export const removeBeer = function(beerId: string) {
  customDebugger('delete one beer');
  return new Promise((resolve, reject) => {
    Beer.remove(beerId)
      .then(resolve)
      .catch(() => reject(httpErrors(404, 'beer not found')));
  });
};

export const addTransaction = function(beerId: string, transaction: BeerTransaction) {
  customDebugger('beerTracker:addTransaction', transaction);
  return new Promise((resolve, reject) => {
    Beer.addTransaction(beerId, transaction)
      .then(resolve)
      .catch(reject);
  });
};

export const fetchAllTransactions = function(beerId: string) {
  customDebugger('beerTracker:fetchAllTransactions');
  return new Promise((resolve, reject) => {
    Beer.findById(beerId)
      .then(beer => resolve(beer.transactions))
      .catch(err => reject(httpErrors(404, err.message)));
  });
};

export const removeTransaction = function(beerId: string, transactionId: string) {
  customDebugger('beerTracker:removeTransaction');
  return new Promise((resolve, reject) => {
    Beer.removeTransaction(beerId, transactionId)
      .then(resolve)
      .catch(err => reject(httpErrors(404, err.message)));
  });
};
