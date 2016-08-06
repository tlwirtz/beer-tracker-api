'use strict';

const mongoose = require('mongoose');

const beerSchema = mongoose.Schema({
  name: {type: String, required: true},
  device: {type: Object},
  transactions: {type: Array}
});

module.exports = mongoose.model('beer', beerSchema);
