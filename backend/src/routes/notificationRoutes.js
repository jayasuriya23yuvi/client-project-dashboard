const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const {
    getNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead
} = require('../controllers/notificationController');
router.get('/', verifyToken, getNotifications);
router.patch('/:id/read', verifyToken, markNotificationAsRead);
router.patch('/:id/read-all', verifyToken, markAllNotificationsAsRead);
module.exports = router;