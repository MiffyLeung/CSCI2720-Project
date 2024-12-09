// backend/models/Location.js

const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  description: { type: String },
});

module.exports = mongoose.model('Location', LocationSchema);
