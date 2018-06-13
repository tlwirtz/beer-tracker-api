import * as functions from 'firebase-functions';
import * as express from 'express';
import * as beerRouter from './route/beer-route';

const app = express();
app.disable('x-powered-by');

app.use(beerRouter);

export const api = functions.https.onRequest(app);
