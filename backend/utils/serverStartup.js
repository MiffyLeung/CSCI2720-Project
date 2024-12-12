// backend/utils/serverStartup.js
const connectDB = require('./connectDB');
const checkAccounts = require('./checkAccounts');

const startServer = async (app, port) => {
    try {
        // Connect to the database
        await connectDB();

        // Start the server
        app.listen(port, async () => {
            console.log(`Server running at http://localhost:${port}\n`);

            // Perform initial account checks
            await checkAccounts();
        });
    } catch (error) {
        console.error('Error starting the server:', error.message);
    }
};

module.exports = startServer;
