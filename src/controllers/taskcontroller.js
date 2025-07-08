const Task = require('../models/taskmodel');
const sequelize = require('../database/index');
const { Op } = require('sequelize'); // ✅ Fix: Import Op from sequelize

// Create a new task
exports.createTask = async (req, res) => {
  try {
    const { title, description, column_id, position } = req.body;
    if (!title || !column_id) {
      return res.status(400).json({ error: 'Title and column_id are required' });
    }

    const newTask = await Task.create({
      title,
      description,
      column_id,
      position: position || 0,
    });

    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    await task.destroy();
    res.json({ message: 'Task deleted' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update a task
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    const { title, description, column_id, position } = req.body;
    if (title) task.title = title;
    if (description) task.description = description;
    if (column_id) task.column_id = column_id;
    if (position !== undefined) task.position = position;

    await task.save();
    res.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update task position (drag/drop)
exports.updateTaskPosition = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { position, column_id } = req.body;
    const taskId = req.params.id;

    const task = await Task.findByPk(taskId, { transaction: t });
    if (!task) {
      await t.rollback();
      return res.status(404).json({ error: 'Task not found' });
    }

    const originalColumnId = task.column_id;
    const originalPosition = task.position;

    if (column_id !== originalColumnId) {
      // Decrement tasks after the original position in original column
      await Task.update(
        { position: sequelize.literal('position - 1') },
        {
          where: {
            column_id: originalColumnId,
            position: { [Op.gt]: originalPosition },
          },
          transaction: t,
        }
      );

      // Increment tasks in the new column after the new position
      await Task.update(
        { position: sequelize.literal('position + 1') },
        {
          where: {
            column_id: column_id,
            position: { [Op.gte]: position },
          },
          transaction: t,
        }
      );
    } else {
      // Moving within same column → shift between old and new position
      if (position > originalPosition) {
        await Task.update(
          { position: sequelize.literal('position - 1') },
          {
            where: {
              column_id,
              position: {
                [Op.gt]: originalPosition,
                [Op.lte]: position,
              },
            },
            transaction: t,
          }
        );
      } else if (position < originalPosition) {
        await Task.update(
          { position: sequelize.literal('position + 1') },
          {
            where: {
              column_id,
              position: {
                [Op.gte]: position,
                [Op.lt]: originalPosition,
              },
            },
            transaction: t,
          }
        );
      }
    }

    task.column_id = column_id;
    task.position = position;
    await task.save({ transaction: t });

    await t.commit();
    res.json({ message: 'Task moved successfully', task });
  } catch (error) {
    await t.rollback();
    console.error('Error moving task with transaction:', error);
    res.status(500).json({ error: 'Transaction failed' });
  }
};
