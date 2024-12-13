// backend/middleware/errorHandler.js

/**
 * Express middleware for handling errors globally.
 * Logs the error stack to the console and sends a structured JSON response.
 * 
 * @function errorHandler
 * @param {Error} err - The error object, containing status code, code, and message
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void} - Sends a JSON response with error details
 */
const errorHandler = (err, req, res, next) => {
    console.error('Error Stack:', err.stack);

    const statusCode = err.statusCode || 500; // Default to 500 if not specified
    res.status(statusCode).json({
        code: err.code || 'INTERNAL_SERVER_ERROR',
        message: err.message || 'An unexpected error occurred',
        debug: {
            path: req.originalUrl, // API path where the error occurred
            method: req.method,   // HTTP method (GET, POST, etc.)
            stack: err.stack,     // Full error stack trace
        },
    });
};

module.exports = errorHandler;
