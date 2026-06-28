const pool = require('../config/db');
const createProject = async (req, res) => {
    try {

        const { name, description } = req.body;

        const result = await pool.query(
            `INSERT INTO projects
            (name, description, created_by)
            VALUES ($1, $2, $3)
            RETURNING *`,
            [name, description, req.user.id]
        );

        res.status(201).json({
            message: 'Project created successfully',
            project: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Server error'
        });
    }
};

module.exports = { createProject };