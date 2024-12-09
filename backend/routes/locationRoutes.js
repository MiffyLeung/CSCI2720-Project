const express = require('express');
const Location = require('../models/Location');
const router = express.Router();

// 獲取所有地點
router.get('/', async (req, res) => {
    try {
        const locations = await Location.find();
        res.json(locations);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// 創建新地點
router.post('/', async (req, res) => {
    try {
        const { name, latitude, longitude, events } = req.body;
        const newLocation = new Location({ name, latitude, longitude, events });
        await newLocation.save();
        res.json(newLocation);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

module.exports = router;
