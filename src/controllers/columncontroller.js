const Column = require('../models/columnmodel');

// Get column by ID
exports.getColumnById = async (req, res) => {
  try {
    const column = await Column.find(req.params.id);
    if (!column) {
      return res.status(404).json({ error: 'Column not found' });
    }
    res.json(column);
  } catch (error) {
    console.error('Error fetching column:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.createColumn = async (req, res) => {
  try {
    const { title, board_id } = req.body;
    if (!title || !board_id) {
      return res.status(400).json({ error: 'Title and board_id are required' });
    }

    const newColumn = await Column.create({ title, board_id });
    res.status(201).json(newColumn);
  } catch (error) {
    console.error('Error creating column:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update a column
exports.updateColumn = async (req, res) => {
  try {
    const column = await Column.findByPk(req.params.id);
    if (!column) {
      return res.status(404).json({ error: 'Column not found' });
    }

    const { title } = req.body;
    if (title) column.title = title;

    await column.save();
    res.json(column);
  } catch (error) {
    console.error('Error updating column:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete a column
exports.deleteColumn = async (req, res) => {
  try {
    const column = await Column.findByPk(req.params.id);
    if (!column) {
      return res.status(404).json({ error: 'Column not found' });
    }

    await column.destroy();
    res.json({ message: 'Column deleted successfully' });
  } catch (error) {
    console.error('Error deleting column:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
