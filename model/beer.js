const Joi = require('joi');
const db = require('./db-admin');
const httpErrors = require('http-errors');

const beerSchema = Joi.object().keys({
  name: Joi.string().required(),
  device: Joi.object(),
});

const transactionSchema = Joi.object().keys({
  type: Joi.string()
    .valid(['adjust-up', 'adjust-down'])
    .required(),
  qty: Joi.number().required(),
});

const verifySchema = schema => testObj => Joi.validate(testObj, schema);
const verifyBeerSchema = verifySchema(beerSchema);
const verifyTransactionSchema = verifySchema(transactionSchema);

const mapIdToSnap = async snap => {
  let results = [];
  snap.forEach(doc => results.push({ ...doc.data(), id: doc.id }));
  return results;
};

const mapTransactionToBeer = async beers => {
  return await Promise.all(
    beers.map(async beer => {
      const transactions = await fetchTransactions(beer.id);
      return { ...beer, transactions };
    })
  );
};

const fetchTransactions = async (beerId = null) => {
  let events = [];
  await db
    .collection('beers')
    .doc(beerId)
    .collection('transactions')
    .get()
    .then(snap => snap.forEach(doc => events.push({ id: doc.id, ...doc.data() })));

  return events;
};

const save = async beerData => {
  const { error } = verifyBeerSchema(beerData);

  if (error) {
    return Promise.reject(httpErrors.BadRequest(error));
  }

  return db
    .collection('beers')
    .add(beerData)
    .then(ref => findOne(ref.id));
};

const find = async () => {
  return db
    .collection('beers')
    .get()
    .then(mapIdToSnap)
    .then(mapTransactionToBeer);
};

const findOne = async id => {
  const beer = await db
    .collection('beers')
    .doc(id)
    .get();

  if (!beer.exists) {
    return Promise.reject('Not Found');
  }

  const transactions = await fetchTransactions(id);
  return { id: beer.id, ...beer.data(), transactions };
};

const findById = async id => {
  return findOne(id);
};

const findByIdAndUpdate = async (id, updateData) => {
  //TODO -- should validate update data

  const beer = await db
    .collection('beers')
    .doc(id)
    .get();
  if (!beer.exists) {
    return Promise.reject(httpErrors.NotFound());
  }

  return db
    .collection('beers')
    .doc(id)
    .update(updateData);
};

const remove = async id => {
  const beer = await db
    .collection('beers')
    .doc(id)
    .get();

  if (!beer.exists) {
    return Promise.reject('Not Found');
  }

  return db
    .collection('beers')
    .doc(id)
    .delete();
};

const findOneAndUpdate = async (id, update) => {
  return findByIdAndUpdate(id, update);
};

const addTransaction = async (beerId, transaction) => {
  const { error } = verifyTransactionSchema(transaction);

  if (error) {
    return Promise.reject(httpErrors.BadRequest(error));
  }

  const beer = await db
    .collection('beers')
    .doc(beerId)
    .get();

  if (!beer.exists) {
    return Promise.reject(httpErrors.NotFound());
  }

  return db
    .collection('beers')
    .doc(beerId)
    .collection('transactions')
    .add({ ...transaction, dateTime: Date.now() })
    .then(() => findOne(beerId));
};

const removeTransaction = async (beerId, transactionId) => {
  return db
    .collection('beers')
    .doc(beerId)
    .collection('transactions')
    .remove(transactionId);
};

const beerModel = {
  save,
  findOne,
  find,
  findByIdAndUpdate,
  remove,
  findById,
  findOneAndUpdate,
  addTransaction,
  removeTransaction,
};

module.exports = beerModel;
