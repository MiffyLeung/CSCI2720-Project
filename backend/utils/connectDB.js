// backend/utils/connectDB.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config(); // Load environment variables

let isConnected = false; // Track connection status

// Define the MongoDB connection URI
const dbUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/csci2720-project';

// Function to connect to MongoDB
const connectDB = () => {
    if (isConnected) {
        console.log('MongoDB connection is already established.');
        return Promise.resolve(); // Return a resolved promise if already connected
    }

    /*
    mongoose.connect(dbUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    There are warnings about the useNewUrlParser and useUnifiedTopology options in the MongoDB driver
    These options have been deprecated since Node.js Driver version 4.0.0.
    */
    return mongoose
        .connect(dbUri)
        .then(() => {
            isConnected = true; // Update connection status
            console.log('Connected to MongoDB');
        })
        .catch((error) => {
            console.error('Error connecting to MongoDB:', error.message);
            throw error; // Re-throw the error for the caller to handle
        });
};

module.exports = connectDB;
