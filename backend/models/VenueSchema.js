// backend/models/VenueSchema.js
const mongoose = require('mongoose');

/**
 * Venue Schema for managing venue information.
 * 
 * Fields:
 * - venue_id: Unique identifier for the venue (required, unique).
 * - name: Name of the venue (required).
 * - description: Description of the venue.
 * - coordinates: Geographical coordinates of the venue (latitude and longitude, both required).
 * - recentEvent: Date of the most recent event held at the venue.
 */
const VenueSchema = new mongoose.Schema({
    venue_id: { type: String, required: true, unique: true }, // Unique identifier for the venue
    name: { type: String, required: true }, // Name of the venue
    description: { type: String }, // Description of the venue
    coordinates: {
        latitude: { type: Number, required: true }, // Latitude of the venue
        longitude: { type: Number, required: true }, // Longitude of the venue
    },
    recentEvent: { type: Date }, // Date of the most recent event
});

module.exports = mongoose.model('Venue', VenueSchema);
