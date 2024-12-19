// backend/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const updateData = require('../scripts/updateData');
const MetaData = require('../models/MetaDataSchema');

/**
 * Updates the database with the latest data by invoking the updateData script.
 * 
 * @route GET /admin/updateData
 * @returns {Object} - JSON object with a success or error message
 */
router.get('/updateData', async (req, res) => {
    try {
        // Call the updateData function to update data
        await updateData();
        res.status(200).json({ data:{message: 'Data updated successfully.' }});
    } catch (error) {
        console.error('Error updating data:', error);
        res.status(500).json({
            message: 'Failed to update data.',
            error: error.message,
        });
    }
});

/**
 * Fetches the last update timestamp from the MetaData collection.
 * 
 * @route GET /api/dataLastUpdateAt
 * @returns {Object} - JSON object with the last update timestamp
 */
router.get('/dataLastUpdateAt', async (req, res) => {
    try {
        const metaData = await MetaData.findOne({ key: 'lastUpdateTime' });

        if (!metaData) {
            return res.status(404).json({
                data: {
                    updatedAt: null,
                },
                message: 'No last update time found.',
            });
        }

        res.status(200).json({
            data: {
                updatedAt: metaData.value,
            },
        });
    } catch (error) {
        console.error('Error fetching last update time:', error);
        res.status(500).json({
            data: {
                updatedAt: null,
            },
            message: 'Failed to fetch last update time.',
            error: error.message,
        });
    }
});

module.exports = router;
