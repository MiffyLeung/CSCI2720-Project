// backend/utils/tokenUtils.js

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

/**
 * Generate a JWT token
 * @param {Object} payload - The payload to include in the token
 * @param {String} expiresIn - Token expiry time (e.g., '1h', '7d')
 * @returns {String} - The signed JWT token
 */
const generateToken = (payload, expiresIn = '1h') => {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

/**
 * Verify a JWT token
 * @param {String} token - The token to verify
 * @returns {Object} - The decoded token
 */
const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { generateToken, verifyToken };
