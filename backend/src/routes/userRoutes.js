const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const { getDevelopers } = require("../controllers/userController");

router.get(
    "/developers",
    verifyToken,
    authorizeRoles("ADMIN", "PM"),
    getDevelopers
);

module.exports = router;