// backend/models/UserSchema.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true },
});

// Hash the password before saving the user
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Compare passwords for authentication
UserSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Static method to create or update users
UserSchema.statics.createOrUpdate = async function ({ username, password, role }, forceUpdate = false) {
    try {
        const existingUser = await this.findOne({ username });

        if (existingUser) {
            if (forceUpdate) {
                existingUser.password = password; // Password will be hashed by the pre-save hook
                existingUser.role = role;
                await existingUser.save();
                return { status: 'updated', user: existingUser };
            } else {
                return { status: 'exists', user: existingUser };
            }
        }

        const newUser = new this({ username, password, role });
        await newUser.save();
        return { status: 'created', user: newUser };
    } catch (error) {
        throw new Error(`Error creating or updating user ${username}: ${error.message}`);
    }
};

module.exports = mongoose.model('User', UserSchema);
