import * as admin from 'firebase-admin';
admin.initializeApp();

//* - Only need this if we deploy WITHOUT using google functions.
// const serviceAccount = require('../beer-tracker-db-key.json');
// const devServiceAccount = require('../beer-tracker-db-key-dev.json');
// const key = process.env.NODE_ENV === 'dev' ? devServiceAccount : serviceAccount;
// admin.initializeApp({
//   credential: admin.credential.cert(key),
// });

export default admin.firestore();
