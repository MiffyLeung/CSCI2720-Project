// backend/middleware/corsMiddleware.js

const cors = require('cors');

/**
 * Configures Cross-Origin Resource Sharing (CORS) settings.
 * 
 * The configuration allows requests from the frontend URL specified in the environment variables.
 * If no URL is provided, it defaults to allowing requests from all origins (`*`).
 * 
 * Allowed HTTP methods: GET, POST, PUT, DELETE, 'PATCH', OPTIONS.
 * Allowed headers: Content-Type, Authorization.
 * 
 * @function configureCORS
 * @returns {Function} - CORS middleware configured with the specified options
 */
const configureCORS = () => {
    const allowedOrigins = process.env.FRONTEND_URL || '*';

    return cors({
        origin: allowedOrigins, // Specify allowed origin(s)
        credentials: true,      // Allow cookies and credentials
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Allowed HTTP methods
        allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
    });
};

module.exports = configureCORS;
