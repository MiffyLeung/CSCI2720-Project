// backend/utils/checkAccounts.js

const Account = require('../models/AccountSchema'); // Import the Account model

/**
 * Checks if there are any accounts in the database.
 * 
 * If no accounts are found, logs a warning message to the console,
 * prompting the user to create primary accounts using a specific script.
 * 
 * @function checkAccounts
 * @returns {Promise<void>} - Resolves when the check is complete
 */
const checkAccounts = async () => {
    try {
        const accountCount = await Account.countDocuments();
        if (accountCount === 0) {
            console.warn(
                '\nWARNING: No accounts found in the database.\n' +
                'Please run "npm run create-accounts" to create the primary accounts.\n'
            );
        } else {
            console.log(`\nINFO: ${accountCount} account(s) found in the database.\n`);
        }
    } catch (error) {
        console.error('Error checking accounts:', error.message);
    }
};

module.exports = checkAccounts;
