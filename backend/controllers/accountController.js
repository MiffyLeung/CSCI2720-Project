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
 * Updates account information (Admin only).
 * 
 * @function updateAccount
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing accountId and updates
 * @param {Object} res - Express response object
 * @returns {void} - Sends a JSON response with the updated account or an error message
 */
const updateAccount = async (req, res) => {
    const { accountId, updates } = req.body;

    try {
        // Ensure "banned" is handled as a special case
        if (updates.role && updates.role === 'banned') {
            console.log(`Banning account with ID: ${accountId}`);
        }

        // Update the account with the provided data
        const account = await Account.findByIdAndUpdate(accountId, updates, { new: true });
        if (!account) {
            const error = new Error('Account not found');
            return res.status(410).json({
                code: 'USER_NOT_FOUND',
                message: 'Account not found',
                debug: generateDebugInfo(error),
            });
        }

        res.status(200).json({
            code: 'UPDATE_USER_SUCCESS',
            message: 'Account updated successfully',
            data: account,
        });
    } catch (error) {
        console.error('Error updating account:', error.message);
        res.status(500).json({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An unexpected error occurred',
            debug: generateDebugInfo(error),
        });
    }
};

/**
 * Changes the password for an account.
 * 
 * @function changePassword
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing accountId, oldPassword, and newPassword
 * @param {Object} res - Express response object
 * @returns {void} - Sends a JSON response indicating success or an error message
 */
const changePassword = async (req, res) => {
    const { accountId, oldPassword, newPassword } = req.body;

    try {
        const account = await Account.findById(accountId);
        if (!account) {
            const error = new Error('Account not found');
            return res.status(410).json({
                code: 'USER_NOT_FOUND',
                message: 'Account not found',
                debug: generateDebugInfo(error),
            });
        }

        const isMatch = await bcrypt.compare(oldPassword, account.password);
        if (!isMatch) {
            const error = new Error('Invalid old password');
            return res.status(410).json({
                code: 'INVALID_OLD_PASSWORD',
                message: 'Old password is incorrect',
                debug: generateDebugInfo(error),
            });
        }

        account.password = await bcrypt.hash(newPassword, 10); // Hash the new password
        await account.save();

        res.status(200).json({
            code: 'CHANGE_PASSWORD_SUCCESS',
            message: 'Password changed successfully',
        });
    } catch (error) {
        console.error('Error changing password:', error.message);
        res.status(500).json({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An unexpected error occurred',
            debug: generateDebugInfo(error),
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
 * Retrieves a list of the user's bookmarked programmes.
 * 
 * @function getFavourites
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {void} - Sends a JSON response with the user's favourites
 */
const getFavourites = async (req, res) => {
    try {
        // Assuming there's a field "favourites" in the Account schema
        const account = await Account.findById(req.account.id).populate('favourites'); // Populate favourites if it's a reference
        if (!account || !account.favourites) {
            return res.status(404).json({
                code: 'FAVOURITES_NOT_FOUND',
                message: 'No favourites found',
            });
        }

        res.status(200).json({
            code: 'GET_FAVOURITES_SUCCESS',
            message: 'Favourites retrieved successfully',
            data: account.favourites,
        });
    } catch (error) {
        console.error('Error fetching favourites:', error.message);
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
        const hashedPassword = await bcrypt.hash(password, 10);
        const newAccount = new Account({ username, password: hashedPassword, role });
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

module.exports = {
    login,
    listAccounts,
    updateAccount,
    changePassword,
    getAccountDetails,
    getFavourites,
    getAccountDetailsById,
    createAccount,
};
