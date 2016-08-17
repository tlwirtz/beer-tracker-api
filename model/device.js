'use strict';

const mongoose = require('mongoose');
const deviceSchema = mongoose.Schema({
  name: {type: String, required: true},
  macId: {type: String, required: true},
  beerId: {type: mongoose.Schema.ObjectId, required: false}
});

module.exports = mongoose.model('device', deviceSchema);
