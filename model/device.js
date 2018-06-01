const Joi = require('joi');
const db = require('./db-admin');

const deviceSchema = Joi.object().keys({
  name: Joi.string().required(),
  macId: Joi.string().required(),
  beerId: Joi.string(),
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
const findOne = () => {};
const find = id => {};
const findByIdAndUpdate = () => {};
const remove = id => {};

const Device = {
  save,
  findOne,
  find,
  findByIdAndUpdate,
  remove,
};
// const mongoose = require('mongoose');
// const deviceSchema = mongoose.Schema({
//   name: { type: String, required: true },
//   macId: { type: String, required: true },
//   beerId: { type: mongoose.Schema.ObjectId, required: false },
// });

// module.exports = mongoose.model('device', deviceSchema);
