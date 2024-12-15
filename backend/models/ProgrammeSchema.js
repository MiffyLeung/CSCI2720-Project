// backend/models/ProgrammeSchema.js

const mongoose = require('mongoose');

/**
 * Programme Schema for managing event programmes.
 * 
 * Fields:
 * - event_id: Unique identifier for the programme (required, unique).
 * - title: Title of the programme (required).
 * - venue_id: ID linking to the venue (required).
 * - dateline: Original datetime range for display (required).
 * - dateStart: Start datetime of the programme (required, used for filtering/sorting).
 * - dateEnd: End datetime of the programme (required, used for filtering).
 * - duration: Duration of each event in the programme.
 * - price: Price of the programme.
 * - description: Detailed description of the programme.
 * - presenter: Name of the presenter or organizer.
 * - type: Type or category of the programme.
 * - languages: Languages available for the programme (required).
 * - remarks: Additional remarks about the programme.
 * - eventUrl: URL for promotional purposes.
 * - enquiry: Enquiry phone number.
 * - submitdate: Datetime when the programme was submitted (required).
 * - comment: List of comments for the programme.
 * - likes: Number of likes (default 0, cannot be negative).
 */
const ProgrammeSchema = new mongoose.Schema({
  event_id: { type: String, required: true, unique: true }, // Unique primary key
  title: { type: String, required: true },
  venue: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue', required: true }, // Date of the most recent event
  dateline: { type: String, required: true }, // Original datetime range for display
  dateStart: { type: Date, required: true }, // Start datetime of the programme
  dateEnd: { type: Date, required: true }, // End datetime of the programme
  duration: { type: String }, // Length of each event
  price: { type: String }, // Price information
  description: { type: String }, // Detailed description
  presenter: { type: String }, // Name of the presenter
  type: { type: String }, // Programme type or category
  languages: [{ type: String, required: true }], // Available languages
  remarks: { type: String }, // Additional remarks
  eventUrl: { type: String }, // Promotional URL
  enquiry: { type: String }, // Enquiry phone number
  submitdate: { type: Date, required: true }, // Datetime when submitted
  comment: [{ type: String }], // List of comments
  likes: { type: Number, default: 0, min: 0, required: true }, // Like count
});

module.exports = mongoose.model('Programme', ProgrammeSchema);