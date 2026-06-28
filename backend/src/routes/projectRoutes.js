const {createProject} = require('../controllers/projectController');
const express = require('express');
const { verifyToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const router = express.Router();
router.get('/', (req, res) => {
    res.send('Project routes are working!');
});
router.post('/', verifyToken,authorizeRoles('ADMIN','PM'), createProject );

module.exports = router;