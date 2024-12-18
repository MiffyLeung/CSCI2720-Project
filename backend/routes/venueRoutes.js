// backend/routes/venueRoutes.js

const { authenticate, authorize } = require('../middleware/authMiddleware');
const express = require('express');
const {
    getAllVenues,
    getVenueById,
    createVenue,
    updateVenueById,
    deleteVenueById,
    getMapVenues,
    addVenueBookmark,
    removeVenueBookmark,
    addVenueComment,
    removeVenueComment,
} = require('../controllers/venueController');

const router = express.Router();

/**
 * Protected routes: Require authentication for all routes below.
 */
router.use(authenticate);

/**
 * Get a list of all venues for Admin Panel.
 * Matches route: GET /api/venues
 */
router.get(
    '/venues',
    getAllVenues
);

/**
 * Get a list all venues with getLocation (for map view).
 * Matches route: GET /api/venues/forMap
 */
router.get(
    '/venues/forMap',
    getMapVenues
);

/**
 * Get details of a specific venue along with its programmes.
 * Matches route: GET /api/venue/:id
 */
router.get(
    '/venue/:id',
    getVenueById
);

/**
 * Add a venue to the user's bookmarks.
 * Matches route: POST /api/venue/:id/bookmark
 */
router.post('/venue/:id/bookmark', addVenueBookmark);

/**
 * Remove a venue from the user's bookmarks.
 * Matches route: DELETE /api/venue/:id/bookmark
 */
router.delete('/venue/:id/bookmark', removeVenueBookmark);

/**
 * Add a user comment to a venue.
 * Matches route: POST /api/venue/:id/comment
 */
router.post('/venue/:id/comment', addVenueComment);


/**
 * Admin-only routes for venue management.
 * Protected by 'admin' authorization middleware.
 */
/**
 * Remove a user comment from a venue.
 * Matches route: DELETE /api/venue/:id/comment
 */
router.delete('/venue/:id/comment', removeVenueComment);

/**
 * Create a new venue.
 * Matches route: PUT /api/venue
 */
router.post(
    '/venue',
    authorize('admin'),
    createVenue
);

/**
 * Update an existing venue by ID.
 * Matches route: PATCH /api/venue/:id
 */
router.patch(
    '/venue/:id',
    authorize('admin'),
    updateVenueById
);
router.put(
    '/venue/:id',
    authorize('admin'),
    updateVenueById
);

/**
 * Delete a venue by ID.
 * Matches route: DELETE /api/venue/:id
 */
router.delete(
    '/venue/:id',
    authorize('admin'),
    deleteVenueById
);


module.exports = router;
