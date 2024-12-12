// backend\models\ProgrammeSchema.js

const mongoose = require('mongoose');

const ProgrammeSchema = new mongoose.Schema({
  event_id: { type: String, required: true, unique: true }, // Unique primary key
  title: { type: String, required: true },
  venueId: { type: String, required: true },
  dateRange: { type: String, required: true }, // Updated to store date range as string
  duration: { type: String, required: true },
  price: { type: String, required: true },
  description: { type: String },
  presenter: { type: String },
  type: { type: String }, // Programme type
  language: { type: String }, // Language
  remarks: { type: String }, // Remarks
  eventUrl: { type: String }, // Promotional URL
  enquiry: { type: String }, // Enquiry phone number
});

module.exports = mongoose.model('Programme', ProgrammeSchema);
