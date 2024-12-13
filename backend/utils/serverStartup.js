// backend/utils/serverStartup.js

const connectDB = require('./connectDB');
const checkAccounts = require('./checkAccounts');

/**
 * Starts the server and performs initial setup tasks, such as connecting to the database
 * and checking for primary accounts.
 * 
 * @function startServer
 * @param {Object} app - The Express application instance
 * @param {number} port - The port on which the server should listen
 * @returns {Promise<void>} - Resolves when the server is successfully started
 */
const startServer = async (app, port) => {
    try {
        // Connect to the database
        await connectDB();

        // Start the server
        app.listen(port, async () => {
            console.log(`Server running at http://localhost:${port}\n`);

            // Perform initial account checks
            try {
                await checkAccounts();
            } catch (error) {
                console.error('Error during account check:', error.message);
            }
        });
    } catch (error) {
        console.error('Error starting the server:', error.message);
        process.exit(1); // Exit the process with a failure status
    }
};

module.exports = startServer;
