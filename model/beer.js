const Joi = require('joi');
const db = require('./db-admin');

const beerSchema = Joi.object().keys({
  name: Joi.string().required(),
  device: Joi.object(),
  transactions: Joi.Array(),
});

const verifySchema = schema => testObj => Joi.validate(schema, testObj);
const verifyBeerSchema = verifySchema(beerSchema);

const mapIdToSnap = snap => {
  let results = [];
  snap.forEach(doc => results.push({ ...doc.data(), id: doc.id }));
  return results;
};

/**
 * These are the current methods used by the beer-controller.
 * Try to implement as close to possible, but might need some consolidation.
 *
 * These should all return promises.
 * Also, it might be beneficial to create a common interface with Firebase.
 * Device and Beer share the same instances, so there shoudl be a common interface.
 *
 * This would mimic much how the mongo model works, but for Firebase.
 */

const beerModel = (beerData = null) => {
  if (beerData) {
    const { error } = verifyBeerSchema;

    if (error) {
      throw new TypeError(error);
    }
  }

  const save = async () => {
    return db.collection('beers').add(beerData);
  };

  const find = async () => {
    return db
      .collection('beers')
      .get()
      .then(mapIdToSnap);
  };

  const findOne = async id => {
    const beer = await db
      .collection('beers')
      .doc(id)
      .get();

    if (!beer.exists) {
      return Promise.reject('Not Found');
    }

    return { id: beer.id, ...beer.get() };
  };

  const findById = async id => {
    return findOne(id);
  };

  const findByIdAndUpdate = async (id, updateData) => {
    //TODO -- should validate update data
    return db
      .collection('beers')
      .doc(id)
      .update(updateData);
  };

  const remove = async id => {
    return db
      .collection('beers')
      .doc(id)
      .delete();
  };

  const findOneAndUpdate = async (id, update) => {
    return findByIdAndUpdate(id, update);
  };

  const actions = {
    save,
    find,
    findOne,
    findById,
    findByIdAndUpdate,
    findOneAndUpdate,
    remove,
  };

  if (beer) {
    return actions;
  }

  delete actions.save;
  return actions;
};

const Beer = {
  save,
  findOne,
  fetchAlLBeers,
  find,
  findByIdAndUpdate,
  remove,
  findById,
  findOneAndUpdate,
};

module.exports = beerModel

// const mongoose = require('mongoose');

// const beerSchema = mongoose.Schema({
//   name: { type: String, required: true },
//   device: { type: Object },
//   transactions: { type: Array },
// });

// module.exports = mongoose.model('beer', beerSchema);
