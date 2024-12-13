// backend/middleware/authMiddleware.js

const { verifyToken } = require('../utils/tokenUtils');
const { generateDebugInfo } = require('../utils/debugUtils'); // Import the helper function
const Account = require('../models/AccountSchema');
const dotenv = require('dotenv');
dotenv.config();

const whitelist = ['/api/login'];
/**
 * Middleware to authenticate users by verifying their JWT token.
 * 
 * @function authenticate
 * @param {Object} req - Express request object
 * @param {Object} req.headers - Headers containing the Authorization token
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void} - Sends a JSON response on failure or proceeds to next middleware
 */
const authenticate = async (req, res, next) => {
    // console.debug(req);
    if (whitelist.includes(req.originalUrl)) {
        return next(); // Skip authentication for whitelisted routes
    }
    
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        const error = new Error('No token provided');
        return res.status(400).json({
            code: 'NO_TOKEN_PROVIDED',
            message: 'Unauthorized: No token provided',
            debug: generateDebugInfo(error), // Include file and line number
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = verifyToken(token); // Decode token using utility
        const account = await Account.findById(decoded.id);

        if (!account) {
            const error = new Error('Account not found');
            return res.status(410).json({
                code: 'USER_NOT_FOUND',
                message: 'Unauthorized: Account not found',
                debug: generateDebugInfo(error), // Include file and line number
            });
        }

        if (account.role === 'banned') {
            const error = new Error('Account banned');
            return res.status(423).json({
                code: 'ACCOUNT_BANNED',
                message: 'Your account has been banned',
                debug: generateDebugInfo(error), // Include file and line number
            });
        }

        req.account = account; // Attach the authenticated user to the request
        next();
    } catch (error) {
        console.error('Authentication error:', error.message);
        return res.status(401).json({
            code: 'INVALID_TOKEN',
            message: 'Unauthorized: Invalid or expired token',
            debug: generateDebugInfo(error), // Include file and line number
        });
    }
};

/**
 * Middleware to check if a user is authorized to access a resource.
 * 
 * @function authorize
 * @param {string} [requiredRole] - Role required to access the resource
 * @returns {Function} - Middleware function to check user authorization
 */
const authorize = (requiredRole) => {
    return (req, res, next) => {
        if (!req.account || (requiredRole && req.account.role !== requiredRole)) {
            const error = new Error('Insufficient permissions');
            return res.status(403).json({
                code: 'INSUFFICIENT_PERMISSIONS',
                message: 'Forbidden: Insufficient permissions',
                debug: generateDebugInfo(error), // Include file and line number
            });
        }
        next(); // User is authorized, proceed
    };
};

module.exports = { authenticate, authorize };
