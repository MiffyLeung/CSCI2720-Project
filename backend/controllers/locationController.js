// backend/controllers/locationController.js
const Location = require('../models/LocationSchema');

// Get all locations
const getAllLocations = async (req, res) => {
    try {
        const locations = await Location.find();
        res.status(200).json(locations);
    } catch (error) {
        console.error('Error fetching locations:', error.message);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get a location by ID
const getLocationById = async (req, res) => {
    try {
        const location = await Location.findById(req.params.id);
        if (!location) {
            return res.status(404).json({ message: 'Location not found' });
        }
        res.status(200).json(location);
    } catch (error) {
        console.error('Error fetching location:', error.message);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Create a new location (Admin Only)
const createLocation = async (req, res) => {
    try {
        const location = new Location(req.body);
        const savedLocation = await location.save();
        res.status(201).json(savedLocation);
    } catch (error) {
        console.error('Error creating location:', error.message);
        res.status(400).json({ message: 'Error creating location', error });
    }
};

// Update a location by ID (Admin Only)
const updateLocationById = async (req, res) => {
    try {
        const updatedLocation = await Location.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedLocation) {
            return res.status(404).json({ message: 'Location not found' });
        }
        res.status(200).json(updatedLocation);
    } catch (error) {
        console.error('Error updating location:', error.message);
        res.status(400).json({ message: 'Error updating location', error });
    }
};

// Delete a location by ID (Admin Only)
const deleteLocationById = async (req, res) => {
    try {
        const deletedLocation = await Location.findByIdAndDelete(req.params.id);
        if (!deletedLocation) {
            return res.status(404).json({ message: 'Location not found' });
        }
        res.status(200).json({ message: 'Location deleted successfully' });
    } catch (error) {
        console.error('Error deleting location:', error.message);
        res.status(500).json({ message: 'Server error', error });
    }
};

module.exports = {
    getAllLocations,
    getLocationById,
    createLocation,
    updateLocationById,
    deleteLocationById,
};
