// backend/controllers/venueController.js

const Venue = require('../models/VenueSchema');
const Account = require('../models/AccountSchema');
const { generateDebugInfo } = require('../utils/debugUtils');

/**
 * Retrieves all venues and indicates whether each venue is a favourite of the current user.
 * 
 * @function getAllVenues
 * @param {Object} req - Express request object
 * @param {Object} req.account - Authenticated user's account data
 * @param {Object} res - Express response object
 * @returns {void} - Sends a JSON response containing all venues with isFavourite field
 */
const getAllVenues = async (req, res) => {
    try {
        const userId = req.account._id; // Retrieved from authenticated user's data in middleware
        const user = await Account.findById(userId).populate('favourites'); // Fetch user's favourites
        const favouriteVenueIds = user.favourites.map(fav => fav._id.toString());

        const venues = await Venue.find();
        const transformedVenues = venues.map(venue => ({
            venue_id: venue.venue_id,
            name: venue.name,
            latitude: venue.coordinates?.latitude,
            longitude: venue.coordinates?.longitude,
            programmes: venue.programmes || [],
            isFavourite: favouriteVenueIds.includes(venue._id.toString()), // Mark as favourite
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
 * Retrieves venues for map view and indicates whether each venue is a favourite of the current user.
 * 
 * @function getMapVenues
 * @param {Object} req - Express request object
 * @param {Object} req.account - Authenticated user's account data
 * @param {Object} res - Express response object
 * @returns {void} - Sends a JSON response containing venues with isFavourite field for map view
 */
const getMapVenues = async (req, res) => {
    try {
        const userId = req.account._id; // Retrieved from authenticated user's data in middleware
        const user = await Account.findById(userId).populate('favourites'); // Fetch user's favourites
        const favouriteVenueIds = user.favourites.map(fav => fav._id.toString());

        const venues = await Venue.find({
            'coordinates.latitude': { $ne: null },
            'coordinates.longitude': { $ne: null },
        });

        const transformedVenues = venues.map(venue => ({
            venue_id: venue.venue_id,
            name: venue.name,
            latitude: venue.coordinates?.latitude,
            longitude: venue.coordinates?.longitude,
            programmes: venue.programmes || [],
            isFavourite: favouriteVenueIds.includes(venue._id.toString()), // Mark as favourite
        }));

        res.status(200).json({
            code: 'GET_MAP_VENUES_SUCCESS',
            message: 'Venues with geolocation retrieved successfully',
            data: transformedVenues,
        });
    } catch (error) {
        console.error('Error fetching map venues:', error.message);
        res.status(500).json({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An unexpected error occurred',
            debug: generateDebugInfo(error),
        });
    }
};

/**
 * Retrieves a venue by its venue_id.
 *
 * @function getVenueById
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void} - Sends a JSON response with the venue data or an error message
 */
const getVenueById = async (req, res) => {
    try {
        const venue = await Venue.findOne({ venue_id: req.params.id });
        if (!venue) {
            return res.status(404).json({
                code: 'VENUE_NOT_FOUND',
                message: 'Venue not found',
                data: null,
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
 * Updates a venue by its venue_id (Admin Only).
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
        const updatedVenue = await Venue.findOneAndUpdate(
            { venue_id: req.params.id },
            venueData,
            { new: true }
        );
        if (!updatedVenue) {
            return res.status(404).json({
                code: 'VENUE_NOT_FOUND',
                message: 'Venue not found',
                data: null,
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
 * Deletes a venue by its venue_id (Admin Only).
 *
 * @function deleteVenueById
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void} - Sends a JSON response indicating success or an error message
 */
const deleteVenueById = async (req, res) => {
    try {
        const deletedVenue = await Venue.findOneAndDelete({ venue_id: req.params.id });
        if (!deletedVenue) {
            return res.status(404).json({
                code: 'VENUE_NOT_FOUND',
                message: 'Venue not found',
                data: null,
            });
        }
        res.status(200).json({
            code: 'DELETE_VENUE_SUCCESS',
            message: 'Venue deleted successfully',
            data: null,
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
