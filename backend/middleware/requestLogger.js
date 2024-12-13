// backend/middleware/requestLogger.js

const onHeaders = require('on-headers');

/**
 * Logs details of incoming HTTP requests.
 * Logs method, path, headers, and body to the console.
 * 
 * @function logRequest
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void} - Passes control to the next middleware function
 */
const logRequest = (req, res, next) => {
    console.log('\nIncoming Request:');
    console.log(`Method: ${req.method}`);
    console.log(`Path: ${req.path}`);
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    next();
};

/**
 * Logs details of outgoing HTTP responses.
 * Logs status code, headers, and response body to the console.
 * 
 * @function logResponse
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void} - Passes control to the next middleware function
 */
const logResponse = (req, res, next) => {
    // Log response headers after they are set
    onHeaders(res, () => {
        console.log('Response Status:', res.statusCode);
        console.log('Response Headers:', res.getHeaders());
    });

    // Capture and log the response body
    const originalSend = res.send;
    res.send = function (body) {
        console.log('\nResponse Body:', body);
        originalSend.call(this, body);
    };

    next();
};

module.exports = {
    logRequest,
    logResponse,
};
