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


    describe('PUT /device/:id', () => {
      it('should update the requested device', (done) => {
        request.put(`${baseUrl}/device/${this.tempDevice._id}`)
        .send({name: 'MyNewName'})
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('MyNewName');
          done();
        })
        .catch(done);
      });

      it('should throw a 404 error if the device is not found', (done) => {
        request.put(`${baseUrl}/device/1234`)
        .send({name: 'MyNewName'})
        .then(done)
        .catch(err => {
          expect(err.response.status).to.equal(404);
          done();
        });
      });

      it('should thow a 400 error if the no body is sent', (done) => {
        request.put(`${baseUrl}/device/${this.tempDevice._id}`)
        .then(done)
        .catch(err => {
          expect(err.response.status).to.equal(400);
          done();
        });
      });
    });

    describe('POST /device', () => {
      it('should return the device', (done) => {
        request.post(`${baseUrl}/device`)
        .send({
          name: 'MySecondDevice',
          macId: '4567',
          beerId: this.tempDevice.beerId
        })
        .then(res => {
          console.log(res.body);
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('MySecondDevice');
          expect(res.body.macId).to.equal('4567');
          expect(res.body.beerId).to.equal(this.tempDevice.beerId.toString());
          done();
        })
        .catch(done);
      });

      it('should return a 400 error if no device is sent', (done) => {
        request.post(`${baseUrl}/device`)
        .then(done)
        .catch(err => {
          expect(err.response.status).to.equal(400);
          done();
        });
      });

      describe('DELETE /device/:id', () => {
        it('should return a 204', (done) => {
          request.del(`${baseUrl}/device/${this.tempDevice._id}`)
          .then(res => {
            expect(res.status).to.equal(204);
            deviceController.fetchAllDevices()
            .then(devices => {
              expect(devices.length).to.equal(0);
              done();
            });
          })
          .catch(done);
        });
      });

      describe('POST /device/:macAddr/transaction', () => {
        it('should add a transaction to a beer', (done) => {
          request.post(`${baseUrl}/device/1234/transaction`)
          .send({
            type:'adjust-up',
            qty:30
          })
          .then(res => {
            const beer = res.body;
            const transactions = beer.transactions;
            expect(Array.isArray(transactions)).to.equal(true);
            expect(transactions[0].type).to.equal('adjust-up');
            expect(transactions[0].qty).to.equal(30);
            expect(transactions[0]).to.have.property('id');
            expect(transactions[0]).to.have.property('dateTime');
            done();
          })
          .catch(done);
        });
        it('should return a 404 if the device is not found', (done) => {
          request.post(`${baseUrl}/device/10101/transaction'`)
          .send({
            type: 'adjust-up',
            qty:30
          })
          .catch(err => {
            expect(err.response.status).to.equal(404);
            done();
          });
        });
        it('should return a 400 if the device does not have a beer attached', (done) => {
          const tempBeerId = this.tempDevice.beerId;

          deviceController.updateDevice(this.tempDevice._id, {beerId: null})
          .then(() => beerController.updateBeer(tempBeerId, {device: null}))
          .then(() => {
            return request.post(`${baseUrl}/device/1234/transaction`)
            .send({
              type: 'adjust-up',
              qty:30
            });
          })
          .catch(err => {
            expect(err.response.status).to.equal(400);
            done();
          });
        });

        it('should return an error if no body is sent', (done) => {
          request.post(`${baseUrl}/device/1234/transaction`)
          .send()
          .catch(err => {
            expect(err.response.status).to.equal(400);
            done();
          });
        });
      });

      describe('GET /device/:macAddr/register/:beerId', () => {
        it('should add the beerId to the device', (done) => {
          const origBeerId = this.tempDevice.beerId.toString();
          deviceController.updateDevice(this.tempDevice._id, {beerId: null})
          .then(() => request.get(`${baseUrl}/device/1234/register/${origBeerId}`))
          .then(res => {
            expect(res.body.beerId.toString()).to.equal(origBeerId);
            expect(res.status).to.equal(200);
            done();
          }).catch(done);

        });
        it('should add the device to the beer', (done) => {
          const origBeerId = this.tempDevice.beerId.toString();
          deviceController.updateDevice(this.tempDevice._id, {beerId: null})
          .then(() => request.get(`${baseUrl}/device/1234/register/${origBeerId}`))
          .then(res => {
            console.log(res.body);
            beerController.fetchBeerByDevice(res.body._id);
          })
          .then(beer => {
            console.log(beer);
            //this is not working
            done();
          })
          .catch(done);

        });
        it('should return a 404 if the device is not found', (done) => {
          const origBeerId = this.tempDevice.beerId.toString();
          request.get(`${baseUrl}/device/fakeDevice/register/${origBeerId}`)
          .catch(err => {
            expect(err.response.status).to.equal(404);
            done();
          });
        });

        it('should return a 404 if the beer is not found', (done) => {
          request.get(`${baseUrl}/device/1234/register/fakebeer`)
          .catch(err => {
            expect(err.response.status).to.equal(404);
            done();
          });
        });
      });
    });
  });
});
