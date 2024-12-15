// backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const populateDB = require('../scripts/populateDB'); // Import the populateDB function

/**
 * Updates the database with the latest data by invoking the populateDB script.
 * 
 * @route GET /admin/updateData
 * @returns {Object} - JSON object with a success or error message
 */
router.get('/updateData', async (req, res) => {
    try {
        // Call the populateDB function to update data
        await populateDB();
        res.status(200).json({ message: 'Data updated successfully.' });
    } catch (error) {
        console.error('Error updating data:', error);
        res.status(500).json({
            message: 'Failed to update data.',
            error: error.message,
        });
    }
});

module.exports = router;
