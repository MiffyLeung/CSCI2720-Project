// backend/routes/accountRoutes.js

const express = require('express');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const accountController = require('../controllers/accountController');

const router = express.Router();

/**
 * Public route for user login.
 */
router.post(
    '/login', // Matches basePath '/api/login'
    accountController.login
);

// Apply authentication middleware to all routes below
router.use(authenticate);

/**
 * Route for users to change their own password.
 */
router.put(
    '/password', // Matches basePath '/api/password'
    accountController.changePassword
);

/**
 * Route for users to get their account details.
 */
router.get(
    '/myAccount', // Matches basePath '/api/myAccount'
    accountController.getAccountDetails // Add this to accountController if missing
);

/**
 * Route for users to get their bookmarked programmes.
 */
router.get(
    '/myFavourite', // Matches basePath '/api/myFavourite'
    accountController.getFavourites // Add this to accountController if missing
);

/**
 * Admin-only routes for managing accounts.
 */
router.get(
    '/accounts', // Matches basePath '/api/accounts'
    authorize('admin'),
    accountController.listAccounts
);

router.get(
    '/account/:id', // Matches basePath '/api/account/:id'
    authorize('admin'),
    accountController.getAccountDetailsById // Add this to accountController if missing
);

router.put(
    '/account', // Matches basePath '/api/account'
    authorize('admin'),
    accountController.createAccount // Add this to accountController if missing
);

router.put(
    '/account/:id', // Matches basePath '/api/account/:id'
    authorize('admin'),
    accountController.updateAccount
);


module.exports = router;
