// backend/middleware/authMiddleware.js

const { verifyToken } = require('../utils/tokenUtils');
const { generateDebugInfo } = require('../utils/debugUtils'); // Import the helper function
const Account = require('../models/AccountSchema');
const dotenv = require('dotenv');
dotenv.config();

const whitelist = ['/api/login','/api/register'];

/**
 * Middleware to authenticate users by verifying their JWT token.
 * Attaches the authenticated user's account to req.account.
 *
 * @function authenticate
 * @param {Object} req - Express request object
 * @param {Object} req.headers - Headers containing the Authorization token
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void} - Sends a JSON response on failure or proceeds to next middleware
 */
const authenticate = async (req, res, next) => {
    if (whitelist.includes(req.originalUrl)) {
        return next(); // Skip authentication for whitelisted routes
    }
    
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(400).json({
            code: 'NO_TOKEN_PROVIDED',
            message: 'Unauthorized: No token provided',
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = verifyToken(token);
        const account = await Account.findById(decoded.id);

        if (!account) {
            return res.status(410).json({
                code: 'USER_NOT_FOUND',
                message: 'Unauthorized: Account not found',
            });
        }

        if (account.role === 'banned') {
            return res.status(423).json({
                code: 'ACCOUNT_BANNED',
                message: 'Your account has been banned',
            });
        }

        req.account = account; // Attach account to the request
        next();
    } catch (error) {
        return res.status(401).json({
            code: 'INVALID_TOKEN',
            message: 'Unauthorized: Invalid or expired token',
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
