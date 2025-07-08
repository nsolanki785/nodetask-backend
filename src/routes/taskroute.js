const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskcontroller');

router.post('/', taskController.createTask);
router.delete('/:id', taskController.deleteTask);
router.put('/:id', taskController.updateTask);
router.patch('/:id/position', taskController.updateTaskPosition);

module.exports = router;
