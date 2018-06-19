import * as debug from 'debug';
import { Router, Request, Response, NextFunction } from 'express';
import * as httpErrors from 'http-errors';
import * as beerController from '../controller/beer-controller';
import * as bodyParser from 'body-parser';

const beerRouter = Router();
export default beerRouter;

const myDebugger = debug('beerTracker:beer-router');
const jsonParser = bodyParser.json();

beerRouter.post('/beer', jsonParser, (req: Request, res: Response, next: NextFunction) => {
  myDebugger('POST /api/beer');
  beerController
    .createBeer(req.body)
    .then(beer => res.json(beer))
    .catch(next);
});

beerRouter.get('/beer', (req: Request, res: Response, next: NextFunction) => {
  myDebugger('GET /api/beer');
  beerController
    .fetchAllBeers()
    .then(beers => res.json(beers))
    .catch(next);
});

beerRouter.get('/beer/:id', (req: Request, res: Response, next: NextFunction) => {
  myDebugger('GET /api/beer/:id', req.params.id);
  beerController
    .fetchBeer(req.params.id)
    .then(beer => {
      if (!beer) return next(httpErrors(404, 'beer not found'));
      res.json(beer);
    })
    .catch(next);
});

beerRouter.put('/beer/:id', jsonParser, (req: Request, res: Response, next: NextFunction) => {
  myDebugger('PUT /api/beer/:id', req.params.id, req.body);
  beerController
    .updateBeer(req.params.id, req.body)
    .then(beer => {
      if (!beer) return next(httpErrors(404, 'beer not found'));
      res.json(beer);
    })
    .catch(next);
});

beerRouter.delete('/beer/:id', (req: Request, res: Response, next: NextFunction) => {
  myDebugger('DELETE /api/beer/:id', req.params.id);
  beerController
    .removeBeer(req.params.id)
    .then(() => res.status(204).send())
    .catch(next);
});

beerRouter.post(
  '/beer/:id/transaction',
  jsonParser,
  (req: Request, res: Response, next: NextFunction) => {
    myDebugger('POST /api/beer/:id/transaction', req.params.id, req.body);
    beerController
      .addTransaction(req.params.id, req.body)
      .then(beer => res.json(beer))
      .catch(next);
  }
);

beerRouter.get('/beer/:id/transaction', (req: Request, res: Response, next: NextFunction) => {
  myDebugger('GET /api/beer/:id/transaction', req.params.id);
  beerController
    .fetchAllTransactions(req.params.id)
    .then(beer => res.json(beer))
    .catch(next);
});

beerRouter.delete(
  '/beer/:id/transaction/:transId',
  (req: Request, res: Response, next: NextFunction) => {
    myDebugger(`DELETE /beer/${req.params.id}/transaction/${req.params.transId}`);
    beerController
      .removeTransaction(req.params.id, req.params.transId)
      .then(() => res.status(204).send())
      .catch(next);
  }
);
