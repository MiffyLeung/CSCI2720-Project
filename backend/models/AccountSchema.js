// backend/models/AccountSchema.js

const mongoose = require('mongoose');
const hashPassword = require('../middleware/hashPassword');

/**
 * Account Schema for managing user accounts.
 * 
 * Fields:
 * - username: Unique identifier for the account (required).
 * - password: Hashed password for authentication (required).
 * - role: Role of the account (e.g., 'admin', 'user') (required).
 * - favourites: Array of references to venue documents (optional).
 *   - Stores the list of venue bookmarked by the user.
 *   - References the Venue collection via ObjectId.
 */

const AccountSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
    favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Venue' }], // Array of venue references
});

/**
 * Pre-save hook to ensure uniqueness in the favourites array.
 * This ensures the user cannot add duplicate venue references.
 */
AccountSchema.pre('save', function (next) {
    if (this.isModified('favourites')) {
        // Ensure uniqueness in the favourites array
        const uniqueFavourites = [...new Set(this.favourites.map(fav => fav.toString()))];
        this.favourites = uniqueFavourites;
    }
    next();
});

/**
 * Pre-save hook to hash the password before saving the account.
 * Executes only if the password field is modified.
 */
AccountSchema.pre('save', hashPassword);

/**
 * Static method to create or update an account.
 * If the account exists and forceUpdate is true, the account is updated.
 * Otherwise, it creates a new account.
 */
AccountSchema.statics.createOrUpdate = async function ({ username, password, role }, forceUpdate = false) {
    const account = await this.findOne({ username });
    if (account) {
        if (forceUpdate) {
            account.password = password;
            account.role = role;
            await account.save();
            return { status: 'updated', account };
        }
        return { status: 'exists', account };
    }
    const newAccount = new this({ username, password, role });
    await newAccount.save();
    return { status: 'created', account: newAccount };
};

module.exports = mongoose.model('Account', AccountSchema);
