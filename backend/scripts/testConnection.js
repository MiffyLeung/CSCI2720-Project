console.log("Script is starting...");

const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log("Before connect"); // First log before connection
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/sci2720-project', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB connected: ${conn.connection.host}`); // Log when connected
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`); // Log on error
        process.exit(1); // Exit the process with failure
    }
};

connectDB(); // Call the function to test connection

module.exports = connectDB;