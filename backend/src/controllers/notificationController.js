const pool = require('../config/db');
const getNotifications = async (req, res) => {
    const userId = req.user.id;
    try {
        const result = await pool.query(
            `SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC`,
            [userId]
        );
        console.log("Logged in user:", req.user.id);
   res.status(200).json({
    notifications: result.rows
});
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
}
const markNotificationAsRead = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            `UPDATE notifications SET is_read = true WHERE id = $1 AND user_id = $2 RETURNING *`,
            [id, req.user.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Notification not found' });
        }
       res.status(200).json({
    message: "Notification marked as read",
    notification: result.rows[0]
});
    } catch (error) {
        console.error('Error updating notification status:', error);
        res.status(500).json({ error: 'Failed to update notification status' });
    }
}
const markAllNotificationsAsRead = async (req, res) => {
    try {
        const result = await pool.query(
            `UPDATE notifications SET is_read = true WHERE user_id = $1 RETURNING *`,
            [req.user.id]
        );
  res.status(200).json({
    message: "All notifications marked as read",
    notifications: result.rows
});
    } catch (error) {
        console.error('Error marking notifications as read:', error);
        res.status(500).json({ error: 'Failed to mark notifications as read' });
    }
}
module.exports = { getNotifications, markNotificationAsRead, markAllNotificationsAsRead };