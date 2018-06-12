const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const beerRouter = require('../route/beer-route');

admin.initializeApp();
// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions
//

const app = express();
app.disable('x-powered-by');

app.use(beerRouter);

exports.api = functions.https.onRequest(app);

exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send('Hello from Firebase!');
});
