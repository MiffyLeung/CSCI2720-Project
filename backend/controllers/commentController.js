// backend/controllers/commentController.js

const Comment = require('../models/CommentSchema');

// Add a new comment
const addComment = async (req, res) => {
  try {
    const { content, userId, username, relatedId, type } = req.body;

    if (!content || !userId || !username || !relatedId || !type) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newComment = new Comment({ content, userId, username, relatedId, type });
    const savedComment = await newComment.save();

    res.status(201).json(savedComment);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get comments for a related entity (programme or venue)
const getComments = async (req, res) => {
  try {
    const { relatedId, type } = req.query;

    if (!relatedId || !type) {
      return res.status(400).json({ message: 'relatedId and type are required' });
    }

    const comments = await Comment.find({ relatedId, type }).sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a comment
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedComment = await Comment.findByIdAndDelete(id);

    if (!deletedComment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  addComment,
  getComments,
  deleteComment,
};
