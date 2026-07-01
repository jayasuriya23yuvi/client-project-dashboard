/*const pool =require("../config/db");
const getNotifications = async (req, res) => {
    try {

        const result = await pool.query(
            `SELECT *
             FROM notifications
             WHERE user_id = $1
             ORDER BY created_at DESC`,
            [req.user.id]
        );

        res.status(200).json({
            notifications: result.rows
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server Error"
        });

    }
};

const markNotificationAsRead = async (req, res) => {
    try {

        const { id } = req.params;

        const result = await pool.query(
            `UPDATE notifications
             SET is_read = TRUE
             WHERE id = $1
             AND user_id = $2
             RETURNING *`,
            [id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Notification not found"
            });
        }

        res.status(200).json({
            message: "Notification marked as read",
            notification: result.rows[0]
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server Error"
        });

    }
};

module.exports = {
    getNotifications,
    markNotificationAsRead
};*/
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import socket from "../socket";
import axios from "axios";

function Notifications() {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
const token = localStorage.getItem("token");
    const fetchNotifications = async () => {
    try {

        const response = await axios.get(
            "http://localhost:5000/api/notifications",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        console.log(response.data);

        setNotifications(response.data.notifications);

    } catch (error) {
        console.log("Error fetching notifications:", error);
    }
};

useEffect(() => {
    fetchNotifications();
}, []);

useEffect(() => {

    socket.on("new_notification", (data) => {

        console.log("New Notification:", data);

        fetchNotifications();

    });

    return () => {
        socket.off("new_notification");
    };

}, []);

const markAsRead = async (id) => {
    try {

        await axios.patch(
            `http://localhost:5000/api/notifications/${id}/read`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        fetchNotifications();

    } catch (error) {
        console.log("Error updating notification:", error);
    }
};

    return (
        <div>
            <h1>Notifications</h1>
        

{notifications.length===0?(<p>No Notifications</p>):(notifications.map((notification)=>(
    <div key={notification.id}>
        <p>{notification.message}</p>
        
        <p>
            status:{notification.is_read ? "Read":"Unread"}
        </p>

            {!notification.is_read && (
    <button onClick={() => markAsRead(notification.id)}>
        Mark as Read
    </button>
)}
    </div>
)))}



</div>
    );
}

export default Notifications;

