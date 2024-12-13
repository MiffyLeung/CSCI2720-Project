// backend/createPrimaryAccounts.js

const connectDB = require('../utils/connectDB'); // Correct relative path
const Account = require('../models/AccountSchema');
const mongoose = require('mongoose');

/**
 * Creates or updates primary accounts in the database.
 * 
 * Primary accounts include:
 * - Admin account: username 'admin', role 'admin'.
 * - User account: username 'user', role 'user'.
 * 
 * If the `--force-update` flag is provided, existing accounts will be updated.
 * Otherwise, existing accounts are skipped.
 * 
 * @function createPrimaryAccounts
 * @returns {Promise<void>} - Resolves when all accounts are processed
 */
const createPrimaryAccounts = async () => {
    try {
        await connectDB();

        const forceUpdate = process.argv.includes('--force-update'); // Check for force update flag

        const accounts = [
            { username: 'admin', password: 'password123', role: 'admin' },
            { username: 'user', password: 'password123', role: 'user' },
        ];

        let allSkipped = true; // Flag to check if all accounts are skipped

        const accountPromises = accounts.map(async (account) => {
            try {
                const { status, account: updatedAccount } = await Account.createOrUpdate(account, forceUpdate);
                if (status === 'created') {
                    allSkipped = false;
                    console.log(`Account created: ${updatedAccount.username} | Password: ${account.password} | Role: ${updatedAccount.role}`);
                } else if (status === 'updated') {
                    allSkipped = false;
                    console.log(`Account updated: ${updatedAccount.username} | Password: ${account.password} | Role: ${updatedAccount.role}`);
                } else {
                    console.log(`Account "${updatedAccount.username}" already exists. Skipping. | Role: ${updatedAccount.role}`);
                }
            } catch (error) {
                console.error(`Error creating or updating account ${account.username}:`, error.message);
            }
        });

        await Promise.all(accountPromises);

        if (allSkipped && !forceUpdate) {
            console.warn(
                '\nAll primary accounts already exist. If you want to force updates, use the following command:\n' +
                'npm run create-accounts-with-force\n'
            );
        }

        console.log('Finished processing accounts.');
    } catch (error) {
        console.error('Error during account creation:', error.message);
    } finally {
        mongoose.connection.close(); // Close the database connection
        console.log('Database connection closed');
    }
};

// Run the script
createPrimaryAccounts();
