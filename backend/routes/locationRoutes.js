// backend/routes/locationRoutes.js
const express = require('express');
const {
    getAllLocations,
    getLocationById,
    createLocation,
    updateLocationById,
    deleteLocationById,
} = require('../controllers/locationController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Protected routes (require authentication)
router.use(authenticate); // Apply authentication middleware to all routes below

// Public routes
router.get('/', getAllLocations);
router.get('/:id', getLocationById);

// Admin-only routes
router.post('/', authorize('admin'), createLocation);
router.put('/:id', authorize('admin'), updateLocationById);
router.delete('/:id', authorize('admin'), deleteLocationById);

module.exports = router;
