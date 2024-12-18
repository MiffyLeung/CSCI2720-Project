// backend/controllers/venueController.js

const Venue = require('../models/VenueSchema');
const Programme = require('../models/ProgrammeSchema');
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
        const userId = req.account._id;
        const user = await Account.findById(userId).populate('favourites');
        const favouriteVenueIds = user.favourites.map(fav => fav._id.toString());

        // Retrieve all venues and populate programmes with only titles
        const venues = await Venue.find().populate({
            path: 'programmes',
            select: 'title -_id',
        });

        const transformedVenues = venues.map(venue => ({
            venue_id: venue.venue_id,
            name: venue.name,
            latitude: venue.coordinates?.latitude,
            longitude: venue.coordinates?.longitude,
            programmes: venue.programmes.map(prog => prog.title),
            isFavourite: favouriteVenueIds.includes(venue._id.toString()),
            comments: venue.comment.map(c => ({
                _id: c._id, // Include comment ID for deletion
                author: c.author,
                content: c.content,
                timestamp: c.timestamp,
            })),
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

        // Retrieve venues with valid coordinates and populate programmes with titles
        const venues = await Venue.find({
            'coordinates.latitude': { $ne: null },
            'coordinates.longitude': { $ne: null },
        }).populate({
            path: 'programmes',
            select: 'title -_id', // Only select the 'title' field
        });

        const transformedVenues = venues.map(venue => ({
            venue_id: venue.venue_id,
            name: venue.name,
            latitude: venue.coordinates?.latitude,
            longitude: venue.coordinates?.longitude,
            programmes: venue.programmes.map(prog => prog.title), // Map titles only
            isFavourite: favouriteVenueIds.includes(venue._id.toString()),
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
        const venue = await Venue.findOne({ venue_id: req.params.id })
            .populate('programmes') // Populate programmes
            .populate({
                path: 'comment.author', // Populate author in comments
                select: 'username', // Select only the username field
            });
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
            comments: venue.comment.map(c => ({
                _id: c._id, // Include comment ID for deletion
                author: c.author?.username || 'Anonymous',
                content: c.content,
                timestamp: c.timestamp,
            })),
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

/**
 * Adds a venue to the user's bookmarks.
 *
 * @function addVenueBookmark
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters containing venue_id
 * @param {Object} req.account - Authenticated user's account data
 * @param {Object} res - Express response object
 * @returns {void} - Sends a JSON response with the updated favourites list
 */
const addVenueBookmark = async (req, res) => {
    const { id } = req.params; // venue_id from URL
    const userId = req.account._id; // Authenticated user ID

    console.log('[DEBUG] Incoming Request:', {
        userId: userId.toString(),
        venueId: id,
    });

    try {
        const user = await Account.findById(userId).populate('favourites');
        if (!user) {
            console.error('[DEBUG] User Not Found:', userId);
            return res.status(404).json({
                code: 'USER_NOT_FOUND',
                message: 'User not found',
            });
        }

        console.log('[DEBUG] User Data:', {
            userId: userId.toString(),
            favourites: user.favourites.map(fav => fav.toString()),
        });

        // Use venue_id to query
        const venue = await Venue.findOne({ venue_id: id });
        if (!venue) {
            console.error('[DEBUG] Venue Not Found:', id);
            return res.status(404).json({
                code: 'VENUE_NOT_FOUND',
                message: 'Venue not found',
            });
        }

        console.log('[DEBUG] Venue Found:', venue);

        // Add to favourites if not already in the list
        if (!user.favourites.some(fav => fav.toString() === venue._id.toString())) {
            user.favourites.push(venue._id);
            await user.save();
            console.log('[DEBUG] Updated Favourites:', user.favourites);
        } else {
            console.log('[DEBUG] Venue Already in Favourites:', id);
        }

        res.status(200).json({
            code: 'ADD_BOOKMARK_SUCCESS',
            message: 'Venue added to bookmarks successfully',
        });
    } catch (error) {
        console.error('[DEBUG] Error Adding Bookmark:', error.message, error.stack);
        res.status(500).json({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An unexpected error occurred',
            debug: error.message,
        });
    }
};


/**
 * Removes a venue from the user's bookmarks.
 *
 * @function removeVenueBookmark
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters containing venue_id
 * @param {Object} req.account - Authenticated user's account data
 * @param {Object} res - Express response object
 * @returns {void} - Sends a JSON response with the updated favourites list
 */
const removeVenueBookmark = async (req, res) => {
    const { id } = req.params; // venue_id from URL
    const userId = req.account._id; // Authenticated user ID

    console.log('[DEBUG] Incoming Request:', {
        userId: userId.toString(),
        venueId: id,
    });

    try {
        const user = await Account.findById(userId).populate('favourites');
        if (!user) {
            console.error('[DEBUG] User Not Found:', userId);
            return res.status(404).json({
                code: 'USER_NOT_FOUND',
                message: 'User not found',
            });
        }

        console.log('[DEBUG] User Favourites Before:', user.favourites);

        // Find the venue by venue_id
        const venue = await Venue.findOne({ venue_id: id });
        if (!venue) {
            console.error('[DEBUG] Venue Not Found:', id);
            return res.status(404).json({
                code: 'VENUE_NOT_FOUND',
                message: 'Venue not found',
            });
        }

        // Compare by venue_id instead of ObjectId
        const initialLength = user.favourites.length;
        user.favourites = user.favourites.filter(fav => fav.venue_id !== id);

        if (user.favourites.length === initialLength) {
            console.log('[DEBUG] Venue Not in Favourites:', id);
            return res.status(400).json({
                code: 'VENUE_NOT_IN_FAVOURITES',
                message: 'Venue is not in favourites',
            });
        }

        await user.save();

        console.log('[DEBUG] Updated Favourites After:', user.favourites);

        res.status(200).json({
            code: 'REMOVE_BOOKMARK_SUCCESS',
            message: 'Venue removed from bookmarks successfully',
            favourites: user.favourites,
        });
    } catch (error) {
        console.error('[DEBUG] Error Removing Bookmark:', error.message, error.stack);
        res.status(500).json({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An unexpected error occurred',
            debug: error.message,
        });
    }
};



/**
 * Adds a new comment to a venue by its venue_id.
 */
const addVenueComment = async (req, res) => {
    const { id } = req.params; // venue_id
    const { content } = req.body; // Expect content from request body

    // Use authenticated account as author
    const authorId = req.account._id; // Extract user ID from req.account
    const authorName = req.account.username; // Extract username (if needed)

    if (!content) {
        return res.status(400).json({
            code: 'BAD_REQUEST',
            message: 'Content is required to add a comment.',
        });
    }

    try {
        const venue = await Venue.findOne({ venue_id: id });
        if (!venue) {
            return res.status(404).json({
                code: 'VENUE_NOT_FOUND',
                message: 'Venue not found.',
            });
        }

        // Create new comment
        const newComment = {
            author: authorId,   // Use user ID
            content,
            timestamp: new Date(), // Current timestamp
        };

        // Add comment to the venue
        venue.comment.push(newComment);
        await venue.save();

        res.status(201).json({
            code: 'ADD_COMMENT_SUCCESS',
            message: 'Comment added successfully.',
            data: {
                author: authorName,  // Optionally return username
                content: newComment.content,
                timestamp: newComment.timestamp,
            },
        });
    } catch (error) {
        console.error('Error adding comment:', error.message);
        res.status(500).json({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An unexpected error occurred.',
            debug: generateDebugInfo(error),
        });
    }
};


/**
 * Removes a specific comment from a venue.
 */
const removeVenueComment = async (req, res) => {
    const { id, commentId } = req.params; // Venue ID and comment ID

    try {
        const venue = await Venue.findOne({ venue_id: id });
        if (!venue) {
            return res.status(404).json({
                code: 'VENUE_NOT_FOUND',
                message: 'Venue not found.',
            });
        }

        // Filter out the comment to be removed
        const initialCommentCount = venue.comment.length;
        venue.comment = venue.comment.filter(c => c._id.toString() !== commentId);

        // Check if a comment was actually removed
        if (venue.comment.length === initialCommentCount) {
            return res.status(404).json({
                code: 'COMMENT_NOT_FOUND',
                message: 'Comment not found.',
            });
        }

        await venue.save();

        res.status(200).json({
            code: 'REMOVE_COMMENT_SUCCESS',
            message: 'Comment removed successfully.',
            data: { removedCommentId: commentId },
        });
    } catch (error) {
        console.error('Error removing comment:', error.message);
        res.status(500).json({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An unexpected error occurred.',
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
    addVenueBookmark,
    removeVenueBookmark,
    addVenueComment,
    removeVenueComment
};
