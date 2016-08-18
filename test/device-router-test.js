'use strict';

process.env.MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost/beerTest';
const expect = require('chai').expect;
const request = require('superagent-use');
const superPromise = require('superagent-promise-plugin');
const debug = require('debug')('beerTracker:device-route-test');

const port = process.env.PORT || 3000;
const baseUrl = `localhost:${port}/api`;

const server = require('../server');
const beerController = require('../controller/beer-controller');
const deviceController = require('../controller/device-controller');
request.use(superPromise);


describe('testing device routes', function() {
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


  describe('testing /decice route', function() {
    beforeEach((done) => {
      beerController.createBeer({name: 'myTestBeer', device:{macId: '1234', name: 'myDevice'}})
      .then(beer => deviceController.createDevice(
        {
          name: 'myTestDevice',
          macId:'1234',
          beerId: beer._id
        }
      ))
      .then(device => {
        this.tempDevice = device;
        done();
      })
      .catch(done);
    });

    afterEach((done) => {
      Promise.all([
        deviceController.removeAllDevices(),
        beerController.removeAllBeers()
      ])
      .then(() => done())
      .catch(done);
    });

    describe('GET /device', () => {
      it('should return an array of devices', (done) => {
        request.get(`${baseUrl}/device`)
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an('array');
          done();
        });
      });
    });

    describe('GET /device/:id', () => {
      it('/device/:id should return the requested device', (done) => {
        request.get(`${baseUrl}/device/${this.tempDevice._id}`)
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res.body._id).to.equal(this.tempDevice._id.toString());
          done();
        })
        .catch(done);
      });
    });
  });
});
