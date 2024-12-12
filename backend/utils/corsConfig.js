// backend/utils/corsConfig.js
const cors = require('cors');

const configureCORS = () => {
    const allowedOrigins = process.env.FRONTEND_URL || 'http://localhost:3000';
    return cors({
        origin: allowedOrigins, // Allow requests from frontend
        credentials: true,      // Allow cookies and credentials
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    });
};

module.exports = configureCORS;
