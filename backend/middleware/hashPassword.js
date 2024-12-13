const bcrypt = require('bcrypt');

/**
 * Hashes the password before saving a document.
 * Can be used across multiple schemas.
 * 
 * @param {Function} next - Next middleware function
 * @returns {void}
 */
const hashPassword = async function (next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = hashPassword;
