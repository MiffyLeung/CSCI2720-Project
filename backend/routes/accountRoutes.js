// backend/routes/accountRoutes.js

const express = require('express');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const accountController = require('../controllers/accountController');

const router = express.Router();

// User registration route
router.post('/register', accountController.register);

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
 * Route for users to change their own password or username.
 */
router.patch(
    '/myAccount', // Matches basePath '/api/myAccount' with patch
    accountController.changeMyAccount
);

/**
 * Route for users to get their account details.
 */
router.get(
    '/myAccount', // Matches basePath '/api/myAccount'
    accountController.getAccountDetails
);

/**
 * Route for users to get their bookmarked programmes.
 */
router.get(
    '/myFavorites', // Matches basePath '/api/myFavorites'
    accountController.getFavourites
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
    accountController.getAccountDetailsById
);

router.post(
    '/account', // Matches basePath '/api/account'
    authorize('admin'),
    accountController.createAccount
);

router.patch(
    '/account/:accountId', // Matches basePath PATCH '/api/account/:accountId'
    authorize('admin'),
    accountController.updateAccount
);

router.delete(
    '/account/:accountId', // Matches basePath DELETE '/api/account/:accountId'
    authorize('admin'),
    accountController.deleteAccount
);

module.exports = router;
