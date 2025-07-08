const express = require('express');
const router = express.Router();

const boardroutes = require('./boardroute');
const columnroutes = require('./columnroute');
const taskroutes = require('./taskroute');

router.use('/board', boardroutes);
router.use('/column', columnroutes);
router.use('/task', taskroutes);

module.exports = router;
