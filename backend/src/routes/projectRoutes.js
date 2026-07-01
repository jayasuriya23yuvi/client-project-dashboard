const {createProject} = require('../controllers/projectController');
const {getProjects} = require('../controllers/projectController');
const {updateProject} = require('../controllers/projectController');
const {deleteProject} = require('../controllers/projectController');    
const express = require('express');
const { verifyToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const router = express.Router();
router.get(
    "/",
    verifyToken,
    getProjects
);

router.post('/', verifyToken,authorizeRoles('ADMIN','PM'), createProject );


router.patch(
    "/:id",
    verifyToken,
    authorizeRoles("ADMIN", "PM"),
    updateProject
);

router.delete(
    "/:id",
    verifyToken,
    authorizeRoles("ADMIN"),
    deleteProject
);

module.exports = router;