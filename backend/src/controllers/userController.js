const pool = require("../config/db");

const getDevelopers = async (req, res) => {
    try {

        const result = await pool.query(
            `SELECT id, name,email
             FROM users
             WHERE role = 'DEVELOPER'
             ORDER BY name`
        );

        res.status(200).json({
            developers: result.rows
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = { getDevelopers };