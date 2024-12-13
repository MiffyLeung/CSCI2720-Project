// backend/utils/connectDB.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables

// MongoDB connection URI
const dbUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/csci2720-project';

/**
 * Tracks the connection status to prevent redundant connections.
 * 
 * @type {boolean}
 */
let isConnected = false;

/**
 * Connects to the MongoDB database.
 * 
 * If already connected, logs the status and resolves immediately.
 * Otherwise, establishes a new connection.
 * 
 * @function connectDB
 * @returns {Promise<void>} Resolves when the database connection is established.
 */
const connectDB = async () => {
    if (isConnected) {
        console.log('MongoDB connection is already established.');
        return; // Exit early if already connected
    }

    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(dbUri, {
            // Recommended MongoDB driver options
            maxPoolSize: 10, // Maximum number of concurrent connections
            serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds if server is not found
        });
        isConnected = true; // Update connection status
        console.log(`MongoDB connected successfully to: ${dbUri}`);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        throw new Error('Failed to connect to MongoDB'); // Provide a clear error message
    }
};

module.exports = connectDB;
