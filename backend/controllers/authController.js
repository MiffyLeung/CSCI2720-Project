// backend/controllers/authController.js
const User = require('../models/UserSchema');
const jwt = require('jsonwebtoken');

const dotenv = require('dotenv');
dotenv.config(); // Load environment variables from .env

// Validate that JWT_SECRET is defined
if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET is not defined in the environment variables');
}

// Helper to generate a JWT token
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, username: user.username, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
};

// Login a user
const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        if (user.role === 'banned') {
            return res.status(403).json({ message: 'Your account has been banned' });
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const token = generateToken(user);

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                role: user.role,
            },
        });
    } catch (error) {
        console.error('Error during login:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// List all accounts (admin-only)
const listAccounts = async (req, res) => {
    try {
        const users = await User.find({}, 'username role'); // Fetch only username and role fields
        res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching user accounts:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update a user's password or role (admin-only)
const updateUser = async (req, res) => {
    const { username, password, role } = req.body;

    try {
        const result = await User.updateUser(username, { password, role });
        res.status(200).json({
            message: 'User updated successfully',
            user: result.user,
        });
    } catch (error) {
        console.error(`Error updating user "${username}":`, error.message);
        res.status(400).json({ message: error.message });
    }
};

// Ban a user (admin-only)
const banUser = async (req, res) => {
    const { username } = req.body;

    try {
        // Use createOrUpdate to update the user's role to 'banned'
        const result = await User.createOrUpdate({ username, role: 'banned' }, true);

        if (result.status === 'updated') {
            res.status(200).json({
                message: 'User banned successfully',
                user: result.user,
            });
        } else if (result.status === 'created') {
            res.status(400).json({
                message: `User "${username}" does not exist and was created as banned. Verify this action.`,
                user: result.user,
            });
        } else {
            res.status(400).json({ message: 'Unexpected error while banning user' });
        }
    } catch (error) {
        console.error(`Error banning user "${username}":`, error.message);
        res.status(400).json({ message: error.message });
    }
};

// Change password (self-service)
const changePassword = async (req, res) => {
    try {
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({ message: 'Password is required' });
        }

        // Assuming req.user is set by authentication middleware
        req.user.password = password; // Password hashing handled by pre-save hook
        await req.user.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error updating password:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    login,
    listAccounts,
    updateUser,
    banUser,
    changePassword,
};
