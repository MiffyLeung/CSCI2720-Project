// backend/models/VenueSchema.js
const mongoose = require('mongoose');

/**
 * Comment Schema for managing individual comments with structured fields.
 */
const CommentSchema = new mongoose.Schema({
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },      // User name
    content: { type: String, required: true },     // Comment content
    timestamp: { type: Date, default: Date.now },  // Timestamp when the comment is created
});

/**
 * Venue Schema for managing venue information.
 * 
 * Fields:
 * - venue_id: Unique identifier for the venue (required, unique).
 * - name: Name of the venue (required).
 * - coordinates: Geographical coordinates of the venue (latitude and longitude, both required).
 * - programmes: Date of the most recent programme held at the venue.
 * - comment: List of comments for the venue.
 */
const VenueSchema = new mongoose.Schema({
    venue_id: { type: String, required: true, unique: true }, // Unique identifier for the venue
    name: { type: String, required: true },                  // Name of the venue
    coordinates: {
        latitude: { type: Number },                         // Latitude of the venue
        longitude: { type: Number },                        // Longitude of the venue
    },
    programmes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Programme' }], // Linked programmes
    comment: [CommentSchema],                               // Array of structured comments
});

///VenueSchema.index({ venue_id: 1 }); - Alikhan (me) commented this line because mongodb did not work with it on my setup

/**
 * Virtual property for full coordinates.
 */
VenueSchema.virtual('fullCoordinates').get(function () {
    return `${this.coordinates.latitude}, ${this.coordinates.longitude}`;
});

/**
 * Static method to find venue by venue_id.
 */
VenueSchema.statics.findByVenueId = function (venueId) {
    return this.findOne({ venue_id: venueId });
};

module.exports = mongoose.model('Venue', VenueSchema);
