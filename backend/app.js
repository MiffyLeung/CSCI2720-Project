// backend/app.js

require('dotenv').config(); // Load environment variables

const express = require('express');
const configureCORS = require('./middleware/corsMiddleware.js');
const { logRequest, logResponse } = require('./middleware/requestLogger.js');
const errorHandler = require('./middleware/errorHandler'); // Import the error handler middleware
const registerRoutes = require('./utils/registerRoutes');
const startServer = require('./utils/serverStartup');

const app = express();
const PORT = process.env.BACKEND_PORT || 5000;

/**
 * Express application setup and server start script.
 * Configures middleware, registers routes, and handles errors globally.
 * 
 * @module app
 */

/**
 * Middleware: Core parsers and CORS configuration.
 */
app.use(express.json()); // Parse incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data
app.use(configureCORS()); // Apply CORS configuration

/**
 * Middleware: Request and response logging.
 */
app.use(logRequest); // Log incoming requests
app.use(logResponse); // Log outgoing responses

/**
 * Routes: Register all application routes.
 */
registerRoutes(app);

/**
 * Middleware: Handle unknown routes with a specific status code.
 * Sends an HTTP 451 status for "Unavailable For Legal Reasons".
 */
app.use((req, res, next) => {
    res.status(451).json({
        code: 'ROUTE_NOT_FOUND',
        message: 'API route not found',
    });
});

/**
 * Middleware: Global error handler.
 * Captures and processes errors to ensure a structured JSON response.
 */
app.use(errorHandler);

/**
 * Start the Express server.
 * The server listens on the port specified in the environment variables or defaults to 5000.
 */
startServer(app, PORT);

module.exports = app;
