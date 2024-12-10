// backend/app.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./utils/connectDB'); // Import the connectDB function
const routesConfig = require('./config/routesConfig');
const checkAccounts = require('./utils/checkAccounts');

dotenv.config(); // Load environment variables

const app = express();

// Middleware for parsing request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount routes dynamically based on routesConfig
routesConfig.forEach(({ basePath, router }) => {
    app.use(basePath, router);
});

// Start the server
const PORT = process.env.BACKEND_PORT || 5000;

const startServer = async () => {
    try {
        // Connect to MongoDB
        await connectDB();

        // Start Express server
        app.listen(PORT, async () => {
            console.log(`Server running at http://localhost:${PORT}\n`);

            // Check for accounts
            await checkAccounts();

            // Display routes
            console.log('Available routes:');
            routesConfig.forEach(({ name, routes }) => {
                console.log(`  - ${name}:`);
                routes.forEach(({ method, path, requiresAuth, adminOnly }) => {
                    const authNote = requiresAuth
                        ? adminOnly
                            ? ' (Admin Only)'
                            : ' (Authenticated)'
                        : '';
                    console.log(`    - ${method} ${path}${authNote}`);
                });
            });
        });
    } catch (error) {
        console.error('Error starting the server:', error.message);
    }
};

startServer();

module.exports = app;
