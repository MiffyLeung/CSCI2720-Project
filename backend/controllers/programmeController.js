// backend\controllers\programmeController.js

const getProgrammes = async (req, res) => {
    try {
      const searchQuery = req.query.search || '';
      const sortField = req.query.sortField || 'title'; // Default sort field
      const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1; // Default to ascending
      const regex = new RegExp(searchQuery, 'i'); // Case-insensitive regex
  
      const programmes = await Programme.find({ title: { $regex: regex } })
        .sort({ [sortField]: sortOrder }); // Apply dynamic sorting
  
      res.json(programmes);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching programmes' });
    }
  };
  