// backend/app.js
require('dotenv').config(); // Load environment variables

const express = require('express');
const configureCORS = require('./utils/corsConfig');
const { logRequest, logResponse } = require('./utils/logger');
const registerRoutes = require('./utils/registerRoutes');
const startServer = require('./utils/serverStartup');

const app = express();
const PORT = process.env.BACKEND_PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(configureCORS());
app.use(logRequest);
app.use(logResponse);

// Routes
registerRoutes(app);

// Start the server
startServer(app, PORT);

module.exports = app;
