
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const {createTask} = require('../controllers/taskController');
const {getTasks} = require('../controllers/taskController');
const {updateTaskStatus} = require('../controllers/taskController');

router.get('/', verifyToken,getTasks);
router.post('/', verifyToken, authorizeRoles('ADMIN','PM'), createTask);
router.patch('/:id', verifyToken, updateTaskStatus);
module.exports = router;