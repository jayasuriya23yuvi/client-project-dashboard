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
const getProjects = async (req, res) => {
    try {
        let result;
        if (req.user.role === 'ADMIN') {
            result = await pool.query('SELECT * FROM projects ORDER BY created_at DESC');
        } else {
            result = await pool.query('SELECT * FROM projects WHERE created_by = $1 ORDER BY created_at DESC', [req.user.id]);
        }
        res.status(200).json({ projects: result.rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
const updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        let result;

        if (req.user.role === 'ADMIN') {
            result = await pool.query(
                `UPDATE projects
                SET name = $1, description = $2
                WHERE id = $3
                RETURNING *`,
                [name, description, id]
            );

        }
        else {
            result = await pool.query(
                `UPDATE projects
                SET name = $1, description = $2
                WHERE id = $3 AND created_by = $4
                RETURNING *`,
                [name, description, id, req.user.id]
            );
        }

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.status(200).json({
            message: 'Project updated successfully',
            project: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;

        let result;

        if (req.user.role === 'ADMIN') {
            result = await pool.query(
                `DELETE FROM projects
                WHERE id = $1
                RETURNING *`,
                [id]
            );
        } else {
            result = await pool.query(
                `DELETE FROM projects
                WHERE id = $1 AND created_by = $2
                RETURNING *`,
                [id, req.user.id]
            );
        }

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.status(200).json({
            message: 'Project deleted successfully',
            project: result.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
module.exports = { createProject, getProjects, updateProject, deleteProject };