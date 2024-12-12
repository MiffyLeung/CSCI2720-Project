// routes/programmeRoutes.js
const express = require('express');
const Programme = require('../models/Programme');

const router = express.Router();

// Get All Programmes with Pagination and Filters
router.get('/', async (req, res) => {
  try {
    const { type, language, page = 1, limit = 10 } = req.query;

    const query = {};
    if (type) query.type = type;
    if (language) query.language = language;

    const programmes = await Programme.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    const total = await Programme.countDocuments(query);

    res.status(200).json({ programmes, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add Programme
router.post('/', async (req, res) => {
    try {
        const programme = new Programme(req.body);
        await programme.save();
        res.status(201).json(programme);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;

