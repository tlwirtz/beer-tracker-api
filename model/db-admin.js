const admin = require('firebase-admin');
const serviceAccount = require('../beer-tracker-db-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin.firestore();
