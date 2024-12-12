// backend/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/UserSchema'); // Import the User model

const dotenv = require('dotenv');
dotenv.config(); // Load environment variables from .env

// Middleware to authenticate the token
const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(400).json({ code: 'NO_TOKEN_PROVIDED', message: 'Unauthorized: No token provided' }); // 400 Bad Request
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ code: 'USER_NOT_FOUND', message: 'Unauthorized: User not found' }); // 404 Not Found
        }

        if (user.role === 'banned') {
            return res.status(423).json({ code: 'ACCOUNT_BANNED', message: 'Your account has been banned' }); // 423 Locked
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Authentication error:', error.message);
        return res.status(403).json({ code: 'INVALID_TOKEN', message: 'Unauthorized: Invalid token' }); // 403 Forbidden
    }
};

// Middleware to authorize based on user role
const authorize = (requiredRole) => {
    return (req, res, next) => {
        if (!req.user || req.user.role !== requiredRole) {
            return res.status(401).json({ code: 'INSUFFICIENT_PERMISSIONS', message: 'Forbidden: Insufficient permissions' }); // 401 Unauthorized
        }
        next(); // User is authorized, proceed
    };
};

module.exports = {
    authenticate,
    authorize,
};
