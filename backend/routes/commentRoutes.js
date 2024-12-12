// backend/routes/commentRoutes.js

const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

// Add a comment
router.post('/', commentController.addComment);

// Get comments for a programme or venue
router.get('/', commentController.getComments);

// Delete a comment by ID
router.delete('/:id', commentController.deleteComment);

module.exports = router;
