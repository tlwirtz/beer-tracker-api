const admin = require('firebase-admin');
const serviceAccount = require('../beer-tracker-db-key.json');
const devServiceAccount = require('../beer-tracker-db-key-dev.json');

const key = process.env.NODE_ENV === 'dev' ? devServiceAccount : serviceAccount;

admin.initializeApp({
  credential: admin.credential.cert(key),
});

module.exports = admin.firestore();
