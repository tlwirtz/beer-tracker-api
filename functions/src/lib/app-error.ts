import * as debug from 'debug';
import * as httpErrors from 'http-errors';
import { ErrorRequestHandler, Request, Response, NextFunction } from 'express';

const myDebugger = debug('beerTracker:app-error');

const handler = (err: httpErrors.HttpError, req: Request, res: Response, next: NextFunction) => {
  myDebugger('building app error');
  console.error(`${err.message} -- ${err.name}`);
  if (err.status && err.name) {
    res.status(err.status).send(err.name);
    next();
    return;
  }

  const httpErr = httpErrors(500, err.message);
  res.status(httpErr.status).send(httpErr.name);
};

export default handler;
