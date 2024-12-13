// backend/utils/connectDB.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables

let isConnected = false; // Track connection status

// MongoDB connection URI
const dbUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/csci2720-project';

/**
 * Connects to the MongoDB database.
 * 
 * If the database is already connected, logs a message and resolves immediately.
 * Otherwise, establishes a new connection.
 * 
 * @function connectDB
 * @returns {Promise<void>} - Resolves when the database connection is established
 * @throws {Error} - Throws an error if the connection fails
 */
const connectDB = async () => {
    if (isConnected) {
        console.log('MongoDB connection is already established.');
        return Promise.resolve(); // Return a resolved promise if already connected
    }

    try {
        await mongoose.connect(dbUri);
        isConnected = true; // Update connection status
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        throw error; // Re-throw the error for the caller to handle
    }
};

module.exports = connectDB;
