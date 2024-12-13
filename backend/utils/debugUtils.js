// utils/debugUtils.js

/**
 * Generates debug info from an error object.
 * Includes file path and line number.
 * 
 * @function generateDebugInfo
 * @param {Error} error - The error object to extract debug information from
 * @returns {string} - The file path and line number in the format `path:line`
 */
const generateDebugInfo = (error) => {
    const stack = error.stack.split('\n')[1]?.trim() || ''; // Get first stack trace
    const match = stack.match(/\(([^)]+)\)/); // Extract file path and line number
    return match ? match[1] : 'No debug info available';
};

module.exports = { generateDebugInfo };
