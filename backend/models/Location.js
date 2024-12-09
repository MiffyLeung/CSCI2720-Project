const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    events: [
        {
            title: String,
            date: String,
            description: String,
            presenter: String,
        }
    ]
});

module.exports = mongoose.model('Location', LocationSchema);
