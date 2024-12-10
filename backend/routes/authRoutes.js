// backend/routes/authRoutes.js
const express = require('express');
const { 
    login, 
    updateUser, 
    banUser, 
    listAccounts, 
    changePassword 
} = require('../controllers/authController');
const { authenticate, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Public route
router.post('/login', login);

// Protected routes (require authentication)
router.use(authenticate); // Apply authentication middleware to all routes below

// Admin-only routes
router.get('/accounts', authorize('admin'), listAccounts);
router.put('/update', authorize('admin'), updateUser);
router.put('/ban', authorize('admin'), banUser);

// Route for users to change their own password
router.put('/change-password', changePassword);

module.exports = router;
