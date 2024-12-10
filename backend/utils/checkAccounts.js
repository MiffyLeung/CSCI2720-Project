// backend/utils/checkAccounts.js
const User = require('../models/UserSchema'); // Import the User model

const checkAccounts = async () => {
    try {
        const userCount = await User.countDocuments();
        if (userCount === 0) {
            console.warn(
                '\nWARNING: No accounts found in the database.\n' +
                'Please run "npm run create-users" to create the primary accounts.\n'
            );
        }
    } catch (error) {
        console.error('Error checking accounts:', error.message);
    }
};

module.exports = checkAccounts;
