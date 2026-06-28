const express = require('express');
const router = express.Router();
const{registerUser} = require('../controllers/authController');
const{loginUser} = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
router.get('/profile', verifyToken, (req, res) => {
    res.json({ message: 'This is a protected route', user: req.user });
});
router.get('/admin', verifyToken, (req, res) => {
    console.log(req.user);
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Access denied' });
    }
    res.json({ message: 'Access granted, welcome admin!', user: req.user });
});
router.post('/register', registerUser); 
router.post('/login',loginUser);
module.exports = router;