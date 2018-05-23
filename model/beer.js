const Joi = require('joi');

const beerSchema = Joi.object().keys({
  name: Joi.string().required(),
  device: Joi.object(),
  transactions: Joi.Array(),
});

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

const save = () => {};
const findOne = id => {};
const fetchAllBeers = () => {};
const find = () => {};
const findByIdAndUpdate = (id, updateData) => {};
const remove = () => {};
const findById = id => {};
const findOneAndUpdate = id => {};

const Beer = {
  save,
  findOne,
  fetchAlLBeers,
  find,
  findByIdAndUpdate,
  remove,
  findById,
  findOneAndUpdate
}

// const mongoose = require('mongoose');

// const beerSchema = mongoose.Schema({
//   name: { type: String, required: true },
//   device: { type: Object },
//   transactions: { type: Array },
// });

// module.exports = mongoose.model('beer', beerSchema);
