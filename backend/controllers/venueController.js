// backend/controllers/venueController.js

const Venue = require('../models/VenueSchema');
const { generateDebugInfo } = require('../utils/debugUtils'); // Import the debug utility

/**
 * Retrieves all venues.
 * 
 * @function getAllVenues
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void} - Sends a JSON response with all venues or an error message
 */
const getAllVenues = async (req, res) => {
    try {
        const venues = await Venue.find();
        const transformedVenues = venues.map((venue) => ({
            venue_id: venue.venue_id,
            name: venue.name,
            latitude: venue.coordinates?.latitude,
            longitude: venue.coordinates?.longitude,
            programmes: venue.programmes || [],
        }));
        res.status(200).json({
            code: 'GET_ALL_VENUES_SUCCESS',
            message: 'Venues retrieved successfully',
            data: transformedVenues,
        });
    } catch (error) {
        console.error('Error fetching venues:', error.message);
        res.status(500).json({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An unexpected error occurred',
            debug: generateDebugInfo(error),
        });
    }
};

/**
 * Retrieves all venues that contain geolocation.
 * 
 * @function getMapVenues
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void} - Sends a JSON response with all venues or an error message
 */
const getMapVenues = async (req, res) => {
    try {
        const venues = await Venue.find({
            'coordinates.latitude': { $ne: null },
            'coordinates.longitude': { $ne: null }
        });
        const transformedVenues = venues.map((venue) => ({
            venue_id: venue.venue_id,
            name: venue.name,
            latitude: venue.coordinates?.latitude,
            longitude: venue.coordinates?.longitude,
            programmes: venue.programmes || [],
        }));
        res.status(200).json({
            code: 'GET_ALL_VENUES_SUCCESS',
            message: 'Venues retrieved successfully',
            data: transformedVenues,
        });
    } catch (error) {
        console.error('Error fetching venues:', error.message);
        res.status(500).json({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An unexpected error occurred',
            debug: generateDebugInfo(error),
        });
    }
};

/**
 * Retrieves a venue by its ID.
 * 
 * @function getVenueById
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void} - Sends a JSON response with the venue data or an error message
 */
const getVenueById = async (req, res) => {
    try {
        const venue = await Venue.findById(req.params.id);
        if (!venue) {
            return res.status(404).json({
                code: 'VENUE_NOT_FOUND',
                message: 'Venue not found',
                debug: generateDebugInfo(new Error('Venue not found')),
            });
        }
        const transformedVenue = {
            venue_id: venue.venue_id,
            name: venue.name,
            latitude: venue.coordinates?.latitude,
            longitude: venue.coordinates?.longitude,
            programmes: venue.programmes || [],
        };
        res.status(200).json({
            code: 'GET_VENUE_SUCCESS',
            message: 'Venue retrieved successfully',
            data: transformedVenue,
        });
    } catch (error) {
        console.error('Error fetching venue:', error.message);
        res.status(500).json({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An unexpected error occurred',
            debug: generateDebugInfo(error),
        });
    }
};

/**
 * Creates a new venue (Admin Only).
 * 
 * @function createVenue
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void} - Sends a JSON response with the created venue or an error message
 */
const createVenue = async (req, res) => {
    try {
        const { latitude, longitude, ...rest } = req.body;
        const venueData = {
            ...rest,
            coordinates: { latitude, longitude },
        };
        const venue = new Venue(venueData);
        const savedVenue = await venue.save();
        res.status(201).json({
            code: 'CREATE_VENUE_SUCCESS',
            message: 'Venue created successfully',
            data: savedVenue,
        });
    } catch (error) {
        console.error('Error creating venue:', error.message);
        res.status(400).json({
            code: 'CREATE_VENUE_ERROR',
            message: 'Error creating venue',
            debug: generateDebugInfo(error),
        });
    }
};

/**
 * Updates a venue by its ID (Admin Only).
 * 
 * @function updateVenueById
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void} - Sends a JSON response with the updated venue or an error message
 */
const updateVenueById = async (req, res) => {
    try {
        const { latitude, longitude, ...rest } = req.body;
        const venueData = {
            ...rest,
            coordinates: { latitude, longitude },
        };
        const updatedVenue = await Venue.findByIdAndUpdate(req.params.id, venueData, { new: true });
        if (!updatedVenue) {
            return res.status(404).json({
                code: 'VENUE_NOT_FOUND',
                message: 'Venue not found',
                debug: generateDebugInfo(new Error('Venue not found')),
            });
        }
        res.status(200).json({
            code: 'UPDATE_VENUE_SUCCESS',
            message: 'Venue updated successfully',
            data: updatedVenue,
        });
    } catch (error) {
        console.error('Error updating venue:', error.message);
        res.status(400).json({
            code: 'UPDATE_VENUE_ERROR',
            message: 'Error updating venue',
            debug: generateDebugInfo(error),
        });
    }
};

/**
 * Deletes a venue by ID.
 */
const deleteVenueById = async (req, res) => {
    try {
        const deletedVenue = await Venue.findByIdAndDelete(req.params.id);
        if (!deletedVenue) {
            const error = new Error('Venue not found');
            res.status(404).json({
                code: 'VENUE_NOT_FOUND',
                message: 'Venue not found',
                debug: generateDebugInfo(error),
            });
            return; // Explicitly terminate the function
        }
        res.status(200).json({
            code: 'DELETE_VENUE_SUCCESS',
            message: 'Venue deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting venue:', error.message);
        res.status(500).json({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An unexpected error occurred',
            debug: generateDebugInfo(error),
        });
    }
};

module.exports = {
    getAllVenues,
    getMapVenues,
    getVenueById,
    createVenue,
    updateVenueById,
    deleteVenueById,
};
