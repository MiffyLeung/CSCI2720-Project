// backend/controllers/accountController.js

const Account = require('../models/AccountSchema');
const { generateToken } = require('../utils/tokenUtils');
const { generateDebugInfo } = require('../utils/debugUtils'); // Import the debug utility

const bcrypt = require('bcrypt');

/**
 * Handles user login.
 * Validates username and password, generates a JWT token on success.
 * 
 * @function login
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing username and password
 * @param {Object} res - Express response object
 * @returns {void} - Sends a JSON response with login status and token or an error message
 */
const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find the account by username
        const account = await Account.findOne({ username });
        if (!account) {
            const error = new Error('User not found');
            return res.status(410).json({
                code: 'USER_NOT_FOUND',
                message: 'Invalid username or password',
                debug: generateDebugInfo(error),
            });
        }

        // Validate the password
        const isMatch = await bcrypt.compare(password, account.password);
        if (!isMatch) {
            const error = new Error('Invalid password');
            return res.status(410).json({
                code: 'USER_NOT_FOUND',
                message: 'Invalid username or password',
                debug: generateDebugInfo(error),
            });
        }

        // Check if the account is banned
        if (account.role === 'banned') {
            const error = new Error('Account banned');
            return res.status(423).json({
                code: 'ACCOUNT_BANNED',
                message: 'Your account has been banned',
                debug: generateDebugInfo(error),
            });
        }

        // Generate a JWT token
        const token = generateToken({ id: account.id });

        // Send the response
        res.status(200).json({
            code: 'LOGIN_SUCCESS',
            message: 'Login successful',
            data: {
                token: token,
                username: account.username,
                role: account.role,
            }
        });
    } catch (error) {
        console.error('Login error:', error.message);
        res.status(500).json({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An unexpected error occurred',
            debug: generateDebugInfo(error),
        });
    }
};

/**
 * Retrieves a list of all accounts (Admin only).
 * 
 * @function listAccounts
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void} - Sends a JSON response with the list of accounts or an error message
 */
const listAccounts = async (req, res) => {
    try {
        const accounts = await Account.find({}, '-password'); // Exclude password field
        res.status(200).json({
            code: 'LIST_ACCOUNTS_SUCCESS',
            message: 'Accounts retrieved successfully',
            data: accounts,
        });
    } catch (error) {
        console.error('Error fetching accounts:', error.message);
        res.status(500).json({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An unexpected error occurred',
            debug: generateDebugInfo(error),
        });
    }
};

/**
 * Updates part of account information (Admin only).
 *
 * @function updateAccount
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing updates for username, role, or password.
 * @param {Object} req.params - Express route parameters containing accountId.
 * @param {Object} res - Express response object.
 * @returns {void} - Sends a JSON response with the updated account or an error message.
 */
const updateAccount = async (req, res) => {
    const { username, role, password } = req.body;
    const { accountId } = req.params;

    try {

        // Log special cases like banning
        if (role === 'banned') {
            console.log(`Banning account with ID: ${accountId}`);
        }
        
        // Update the account
        const account = await Account.findById(accountId);
        if (!account) {
            return res.status(410).json({
                code: 'USER_NOT_FOUND',
                message: 'Account not found',
            });
        }
        if (username) account.username = username;
        if (password) account.password = password; 
        if (role) account.role = role; 
        await account.save();
        
        res.status(200).json({
            code: 'UPDATE_USER_SUCCESS',
            message: 'Account updated successfully',
            data: account,
        });
    } catch (error) {
        console.error(`Error updating account with ID ${accountId}:`, error.message);
        res.status(500).json({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An unexpected error occurred',
            debug: generateDebugInfo(error),
        });
    }
};

/**
 * Deletes an account by its ID (Admin only).
 *
 * @function deleteAccount
 * @param {Object} req - Express request object
 * @param {Object} req.params - Express route parameters containing accountId.
 * @param {Object} res - Express response object.
 * @returns {void} - Sends a JSON response with the status of the deletion.
 */
const deleteAccount = async (req, res) => {
    const { accountId } = req.params;

    try {
        // Attempt to delete the account
        const account = await Account.findByIdAndDelete(accountId);

        if (!account) {
            return res.status(410).json({
                code: 'USER_NOT_FOUND',
                message: 'Account not found',
                debug: `Account ID ${accountId} does not exist`,
            });
        }

        res.status(200).json({
            code: 'DELETE_USER_SUCCESS',
            message: 'Account deleted successfully',
            data: { accountId },
        });
    } catch (error) {
        console.error(`Error deleting account with ID ${accountId}:`, error.message);
        res.status(500).json({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An unexpected error occurred',
            debug: error.message,
        });
    }
};

/**
 * Changes the name and password for an authenticated account.
 *
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing name and password
 * @param {Object} req.account - Authenticated user's account
 * @param {Object} res - Express response object
 */
const changeMyAccount = async (req, res) => {
    const { name, password } = req.body;

    try {
        // Check if the authenticated account exists
        if (!req.account) {
            return res.status(410).json({
                code: 'USER_NOT_FOUND',
                message: 'Authenticated account not found',
            });
        }

        const account = await Account.findById(req.account._id);
        if (!account) {
            return res.status(410).json({
                code: 'USER_NOT_FOUND',
                message: 'Account not found',
            });
        }
        if (name) account.username = name;
        if (password) account.password = password; 
        await account.save();
        
        res.status(200).json({
            code: 'CHANGE_ACCOUNT_SUCCESS',
            message: 'Account details updated successfully',
            data: account, // Optionally return the updated account details
        });
    } catch (error) {
        console.error('Error updating account:', error.message);
        res.status(500).json({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An unexpected error occurred',
            debug: error.message, // Optional for debugging
        });
    }
};


/**
 * Retrieves details of the authenticated user's account.
 * 
 * @function getAccountDetails
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void} - Sends a JSON response with account details
 */
const getAccountDetails = async (req, res) => {
    try {
        const account = await Account.findById(req.account.id, '-password'); // Exclude password field
        if (!account) {
            return res.status(404).json({
                code: 'ACCOUNT_NOT_FOUND',
                message: 'Account not found',
            });
        }

        res.status(200).json({
            code: 'GET_ACCOUNT_DETAILS_SUCCESS',
            message: 'Account details retrieved successfully',
            data: account,
        });
    } catch (error) {
        console.error('Error fetching account details:', error.message);
        res.status(500).json({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An unexpected error occurred',
        });
    }
};

/**
 * Retrieves a list of the user's bookmarked venues.
 * 
 * @function getFavourites
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void} - Sends a JSON response with the user's favourites
 */
const getFavourites = async (req, res) => {
    try {
        const userId = req.account._id; // Get authenticated user ID

        // Fetch account and populate favourites
        const account = await Account.findById(userId).populate('favourites');
        if (!account || !account.favourites || account.favourites.length === 0) {
            return res.status(404).json({
                code: 'FAVOURITES_NOT_FOUND',
                message: 'No favourites found',
            });
        }

        // Transform favourites into the required format
        const transformedFavourites = account.favourites.map(venue => ({
            venue_id: venue.venue_id,
            name: venue.name,
            latitude: venue.coordinates?.latitude || null,
            longitude: venue.coordinates?.longitude || null,
            programmes: venue.programmes || [],
            isFavourite: true, // Since these are favourites
            comments: venue.comment || [], // Include comments if available
        }));

        res.status(200).json({
            code: 'GET_FAVOURITES_SUCCESS',
            message: 'Favourites retrieved successfully',
            data: transformedFavourites,
        });
    } catch (error) {
        console.error('[DEBUG] Error fetching favourites:', error.message, error.stack);
        res.status(500).json({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An unexpected error occurred',
        });
    }
};



/**
 * Retrieves the account details by ID (Admin only).
 * 
 * @function getAccountDetailsById
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void} - Sends a JSON response with account details or an error message
 */
const getAccountDetailsById = async (req, res) => {
    try {
        const accountId = req.params.id;

        const account = await Account.findById(accountId, '-password'); // Exclude password field
        if (!account) {
            const error = new Error('Account not found');
            return res.status(404).json({
                code: 'ACCOUNT_NOT_FOUND',
                message: 'The requested account does not exist',
                debug: generateDebugInfo(error),
            });
        }

        res.status(200).json({
            code: 'GET_ACCOUNT_DETAILS_SUCCESS',
            message: 'Account details retrieved successfully',
            data: account,
        });
    } catch (error) {
        console.error('Error fetching account details:', error.message);
        res.status(500).json({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An unexpected error occurred',
            debug: generateDebugInfo(error),
        });
    }
};

/**
 * Creates a new account (Admin only).
 * 
 * @function createAccount
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing account details
 * @param {Object} res - Express response object
 * @returns {void} - Sends a JSON response indicating success or failure
 */
const createAccount = async (req, res) => {
    try {
        const { username, password, role } = req.body;

        // Validate required fields
        if (!username || !password || !role) {
            return res.status(400).json({
                code: 'MISSING_FIELDS',
                message: 'Username, password, and role are required fields',
            });
        }

        // Check if the username already exists
        const existingAccount = await Account.findOne({ username });
        if (existingAccount) {
            return res.status(409).json({
                code: 'ACCOUNT_EXISTS',
                message: 'An account with this username already exists',
            });
        }

        // Create and save the new account
        const newAccount = new Account({ username, password, role });
        await newAccount.save();

        res.status(201).json({
            code: 'ACCOUNT_CREATED_SUCCESS',
            message: 'Account created successfully',
            data: { id: newAccount._id, username: newAccount.username, role: newAccount.role },
        });
    } catch (error) {
        console.error('Error creating account:', error.message);
        res.status(500).json({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An unexpected error occurred',
            debug: generateDebugInfo(error),
        });
    }
};

/**
 * Handles user self-registration.
 * Validates username uniqueness and creates a new account with "user" role by default.
 * 
 * @function register
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing username and password
 * @param {Object} res - Express response object
 * @returns {void} - Sends a JSON response indicating success or failure
 */
const register = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate input fields
        if (!username || !password) {
            return res.status(400).json({
                code: 'MISSING_FIELDS',
                message: 'Username and password are required.',
            });
        }

        // Check if the username already exists
        const existingAccount = await Account.findOne({ username });
        if (existingAccount) {
            return res.status(409).json({
                code: 'ACCOUNT_EXISTS',
                message: 'Username already exists. Please choose another one.',
            });
        }

        // Create a new account with default role "user"
        const newAccount = new Account({ 
            username, 
            password, 
            role: 'user' // Default role for self-registered users
        });
        await newAccount.save();

        res.status(201).json({
            code: 'REGISTER_SUCCESS',
            message: 'Registration successful.',
            data: { id: newAccount._id, username: newAccount.username, role: newAccount.role },
        });
    } catch (error) {
        console.error('Error during registration:', error.message);
        res.status(500).json({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An unexpected error occurred during registration.',
            debug: generateDebugInfo(error),
        });
    }
};

module.exports = {
    login,
    register,
    listAccounts,
    updateAccount,
    deleteAccount,
    changeMyAccount,
    getAccountDetails,
    getFavourites,
    getAccountDetailsById,
    createAccount,
};
