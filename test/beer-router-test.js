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

  describe('testing /beer route', function() {
    beforeEach((done) => {
      beerController.createBeer({name: 'myBeer', device: {macId: '1234', name:'myDevice'}})
      .then(beer => {
        this.tempBeer = beer;
        done();
      })
      .catch(done);
    });

    afterEach((done) => {
      beerController.removeAllBeers()
      .then(() => done())
      .catch(done);
    });

    describe('GET /beer', () => {
      it('should return an array of beers', (done) => {
        request.get(`${baseUrl}/beer`)
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an('array');
          done();
        });
      });
    });

    describe('GET /beer/:id', () => {
      it('/beer/:id should return the requested beer', (done) => {
        request.get(`${baseUrl}/beer/${this.tempBeer._id}`)
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res.body._id).to.equal(this.tempBeer._id.toString());
          done();
        })
        .catch(done);
      });
    });

    describe('PUT /beer/:id', () => {
      it('should update the requested beer', (done) => {
        request.put(`${baseUrl}/beer/${this.tempBeer._id}`)
        .send({name: 'MyNewName'})
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('MyNewName');
          done();
        })
        .catch(done);
      });

      it('should throw a 404 error if the beer is not found', (done) => {
        request.put(`${baseUrl}/beer/1234`)
        .send({name: 'MyNewName'})
        .then(done)
        .catch(err => {
          expect(err.response.status).to.equal(404);
          done();
        });
      });

      it('should thow a 400 error if the no body is sent', (done) => {
        request.put(`${baseUrl}/beer/${this.tempBeer._id}`)
        .then(done)
        .catch(err => {
          expect(err.response.status).to.equal(400);
          done();
        });
      });
    });

    describe('POST /beer', () => {
      it('should return the beer', (done) => {
        request.post(`${baseUrl}/beer`)
        .send({
          name: 'MySecondBeer',
          device: {
            macId: '4567',
            name: 'SecondDevice'
          }
        })
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res.body.name).to.equal('MySecondBeer');
          expect(res.body.device.macId).to.equal('4567');
          expect(res.body.device.name).to.equal('SecondDevice');
          done();
        });
      });

      it('should return a 400 error if no beer is sent', (done) => {
        request.post(`${baseUrl}/beer`)
        .then(done)
        .catch(err => {
          expect(err.response.status).to.equal(400);
          done();
        });
      });
    });

    describe('DELETE /beer/:id', () => {
      it('should return a 204', (done) => {
        request.del(`${baseUrl}/beer/${this.tempBeer._id}`)
        .then(res => {
          expect(res.status).to.equal(204);
          beerController.fetchAllBeers()
          .then(beers => {
            expect(beers.length).to.equal(0);
            done();
          });
        })
        .catch(done);
      });
    });

    it('should return a 404 if the beer is not found', (done) => {
      request.del(`${baseUrl}/beer/1234`)
        .then(done)
        .catch(err => {
          expect(err.response.status).to.equal(404);
          done();
        })
          .catch(done);
    });


    describe('POST /api/beer/:id/transaction', () => {
      it('should return a beer with a transaction', (done) => {
        request.post(`${baseUrl}/beer/${this.tempBeer._id}/transaction`)
        .send({
          type:'adjust-up',
          qty:30
        })
        .then(res => {
          expect(res.status).to.equal(200);
          expect(res.body.transactions.length).to.equal(1);
          expect(res.body.transactions[0]).to.have.property('id');
          expect(res.body.transactions[0]).to.have.property('dateTime');
          expect(res.body.transactions[0].qty).to.equal(30);
          expect(res.body.transactions[0].type).to.equal('adjust-up');
          done();
        })
        .catch(done);
      });

      it('should return a 404 if the beer can\'t be found', (done) => {
        request.post(`${baseUrl}/beer/1234/transaction`)
        .send({
          type:'adjust-up',
          qty:30
        })
        .then(done)
        .catch(err => {
          expect(err.response.status).to.equal(404);
          done();
        });
      });

      it('should return a 400 if there no transaction is sent', (done) => {
        request.post(`${baseUrl}/beer/${this.tempBeer._id}/transaction`)
        .send({})
        .then(done)
        .catch(err => {
          expect(err.response.status).to.equal(400);
          done();
        });
      });
    });

    describe('GET /api/beer/:id/transaction', () => {
      it('should return an array of transactions');
      it('should return a 404 f the beer can\'t be found');
    });

    describe('DELETE /api/beer/:id/transaction/:transId', () => {
      it('shoudl return a 204 if the transaction was deleted');
      it('should return a 404 if the transaction isn\'t found');
    });
  });
});
