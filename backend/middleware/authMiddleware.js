// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/UserSchema'); // Import the User model

const dotenv = require('dotenv');
dotenv.config(); // Load environment variables from .env

// Middleware to authenticate the token
const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized: User not found' });
        }

        if (user.role === 'banned') {
            return res.status(403).json({ message: 'Your account has been banned' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Authentication error:', error.message);
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};

// Middleware to authorize based on user role
const authorize = (requiredRole) => {
    return (req, res, next) => {
        if (!req.user || req.user.role !== requiredRole) {
            return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
        }
        next(); // User is authorized, proceed
    };
};

module.exports = {
    authenticate,
    authorize,
};
