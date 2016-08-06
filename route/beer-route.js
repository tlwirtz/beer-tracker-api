'use strict';
const debug = require('debug')('beerTracker:beer-router');
const Router = require('express').Router;
const httpErrors = require('http-errors');
const beerController = require('../controller/beer-controller');

const beerRouter = module.exports = new Router();
const jsonParser = require('body-parser').json();

beerRouter.post('/beer', jsonParser, (req, res, next) => {
  debug('POST /api/beer');
  beerController.createBeer(req.body)
  .then(beer => res.json(beer))
  .catch(next);
});

beerRouter.get('/beer', (req, res, next) => {
  debug('GET /api/beer');
  beerController.fetchAllBeers()
  .then(beers => res.json(beers))
  .catch(next);
});

beerRouter.get('/beer/:id', (req, res, next) => {
  debug('GET /api/beer/:id', req.params.id);
  beerController.fetchBeer(req.params.id)
  .then(beer => {
    if (!beer) return next(httpErrors(404, 'beer not found'));
    res.json(beer);
  })
  .catch(next);
});

beerRouter.put('/beer/:id', jsonParser, (req, res, next) => {
  debug('PUT /api/beer/:id', req.params.id, req.body);
  beerController.updateBeer(req.params.id, req.body)
  .then(beer => {
    if (!beer) return next(httpErrors(404, 'beer not found'));
    res.json(beer);
  })
  .catch(next);
});

beerRouter.delete('/beer/:id', (req, res, next) => {
  debug('DELETE /api/beer/:id', req.params.id);
  beerController.removeBeer(req.params.id)
  .then(() => res.status(204).send())
  .catch(next);
});

beerRouter.post('/beer/:id/transaction', jsonParser, (req, res,next) => {
  debug('POST /api/beer/:id/transaction', req.params.id, req.body);
  beerController.addTransaction(req.params.id, req.body)
  .then(beer => res.json(beer))
  .catch(next);
});

beerRouter.get('/beer/:id/transaction', (req, res, next) => {
  debug('GET /api/beer/:id/transaction', req.params.id);
  beerController.fetchAllTransactions(req.params.id)
  .then(beer => res.json(beer))
  .catch(next);
});

beerRouter.delete('/beer/:id/transaction/:transId',(req, res, next) => {
  debug(`DELETE /beer/${req.params.id}/transaction/${req.params.transId}`);
  beerController.removeTransaction(req.params.id, req.params.transId)
  .then(beer => res.json(beer))
  .catch(next);
});
