'use strict';

process.env.MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost/beerTest';
const expect = require('chai').expect;
const request = require('superagent-use');
const superPromise = require('superagent-promise-plugin');
const debug = require('debug')('beerTracker:beer-route-test');

const port = process.env.PORT || 3000;
const baseUrl = `localhost:${port}/api`;

const server = require('../server');
const beerController = require('../controller/beer-controller');
request.use(superPromise);

describe('testing beer-routes', function() {
  before((done) => {
    debug('before beer route');
    if(!server.isRunning) {
      server.listen(port, () => {
        server.isRunning = true;
        done();
      });
      return;
    }
    done();
  });

  after((done) => {
    if(server.isRunning) {
      server.close(() => {
        server.isRunning = false;
        done();
      });
      return;
    }
    done();
  });

  describe('testing beer router', function() {
    beforeEach((done) => {
      //create some beers
      done();
    });

    it('should return some beers');
  });
});
