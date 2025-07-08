const Board = require('../models/boardmodel');
const Column = require("../models/columnmodel");
const Task = require("../models/taskmodel");


// Get a board by ID
exports.getBoardById = async (req, res) => {
  try {
    const board = await Board.findByPk(req.params.id);

    if (!board) {
      return res.status(404).json({ error: 'Board not found' });
    }

    res.json(board);
  } catch (error) {
    console.error('Error fetching board:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// controllers/boardController.js

exports.getBoardWithColumnsAndTasks = async (req, res) => {
  const { id } = req.params

  try {
    const board = await Board.findByPk(id, {
      include: [
        {
          model: Column,
          include: [Task],
        },
      ],
    })

    if (!board) {
      return res.status(404).json({ message: 'Board not found' })
    }

    res.json(board)
  } catch (error) {
    console.error('Error fetching board:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

