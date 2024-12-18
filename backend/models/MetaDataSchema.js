// backend/models/MetaDataSchema.js

const mongoose = require('mongoose');

/**
 * MetaData Schema
 * Used to store system metadata like the last updated timestamp.
 */
const MetaDataSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true },  // Unique key to identify metadata
    value: { type: mongoose.Schema.Types.Mixed, required: true }, // Metadata value
    updatedAt: { type: Date, default: Date.now }, // Timestamp of last update
});

module.exports = mongoose.model('MetaData', MetaDataSchema);
