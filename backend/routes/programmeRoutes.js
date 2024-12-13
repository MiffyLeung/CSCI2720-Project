// backend/routes/programmeRoutes.js

const { authenticate, authorize } = require('../middleware/authMiddleware');
const express = require('express');
const {
    getAllProgrammes,
    getProgrammeById,
    createProgramme,
    updateProgrammeById,
    deleteProgrammeById,
    likeProgramme,
    commentOnProgramme,
} = require('../controllers/programmeController');

const router = express.Router();

/**
 * Protected routes: Require authentication for all routes below.
 */
router.use(authenticate);

/**
 * List all programmes with parameters (e.g., recent, hottest).
 * Matches route: GET /api/programmes
 */
router.get(
    's',
    getAllProgrammes
);

/**
 * View details of a specific programme.
 * Matches route: GET /api/programme/:id
 */
router.get(
    '/:id',
    getProgrammeById
);

/**
 * User actions on programmes.
 */

/**
 * Like a specific programme by ID.
 * Matches route: PUT /api/programme/:id/like
 */
router.put(
    '/:id/like',
    likeProgramme // Todo: Add this to programmeController if missing
);

/**
 * Leave a comment on a specific programme by ID.
 * Matches route: PUT /api/programme/:id/comment
 */
router.put(
    '/:id/comment',
    commentOnProgramme // Todo: Add this to programmeController if missing
);

/**
 * Admin-only routes for programme management.
 * Protected by 'admin' authorization middleware.
 */

/**
 * Create a new programme.
 * Matches route: PUT /api/programme
 */
router.put(
    '',
    authorize('admin'),
    createProgramme
);

/**
 * Update a specific programme by ID.
 * Matches route: PUT /api/programme/:id
 */
router.put(
    '/:id',
    authorize('admin'),
    updateProgrammeById
);

/**
 * Delete a specific programme by ID.
 * Matches route: DELETE /api/programme/:id
 */
router.delete(
    '/:id',
    authorize('admin'),
    deleteProgrammeById
);

module.exports = router;
