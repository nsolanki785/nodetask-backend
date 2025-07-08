const express = require('express');
const router = express.Router();
const {getBoardWithColumnsAndTasks} = require("../controllers/boardcontroller")

router.get("/:id",getBoardWithColumnsAndTasks)

module.exports = router