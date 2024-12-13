// backend/routes/venueRoutes.js

const { authenticate, authorize } = require('../middleware/authMiddleware');
const express = require('express');
const {
    getAllVenues,
    getVenueById,
    createVenue,
    updateVenueById,
    deleteVenueById,
} = require('../controllers/venueController');

const router = express.Router();

/**
 * Protected routes: Require authentication for all routes below.
 */
router.use(authenticate);

/**
 * Get a list of all venues with recent programmes (for map view).
 * Matches route: GET /api/venues
 */
router.get(
    '/venues',
    getAllVenues
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
 * Admin-only routes for venue management.
 * Protected by 'admin' authorization middleware.
 */

/**
 * Create a new venue.
 * Matches route: PUT /api/venue
 */
router.put(
    '/venue',
    authorize('admin'),
    createVenue
);

/**
 * Update an existing venue by ID.
 * Matches route: PUT /api/venue/:id
 */
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
