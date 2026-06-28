const createTask = async (req, res) => {
  try{
    const { title, description, project_id, assigned_to,priority,due_date } = req.body;
    if (!title || !project_id || !assigned_to || !priority || !due_date) {
    return res.status(400).json({
        message: "Title, project, assigned developer, priority, and due date are required."
    });
}
const validPriorities = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

if (!validPriorities.includes(priority)) {
    return res.status(400).json({
        message: "Invalid priority."
    });
}

const project = await pool.query(
    "SELECT * FROM projects WHERE id = $1",
    [project_id]
);

if (project.rows.length === 0) {
    return res.status(404).json({
        message: "Project not found"
    });
}

const developer = await pool.query(
    "SELECT id FROM users WHERE id = $1 AND role = 'DEVELOPER'",
    [assigned_to]
);

if (developer.rows.length === 0) {
    return res.status(404).json({
        message: "Assigned developer not found"
    });
}

    const result = await pool.query(

        
        
      `INSERT INTO tasks
      (title, description, project_id, assigned_to, created_by, priority, due_date)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`,
      [title, description, project_id, assigned_to, req.user.id, priority, due_date]
    );
    res.status(201).json({
      message: 'Task created successfully',
      task: result.rows[0]
    });
    const notificationMessage = `A new task "${title}" has been assigned to you.`;
    await pool.query(
        `INSERT INTO notifications (user_id, message) VALUES ($1, $2)`,
        [assigned_to, notificationMessage]
    );
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
}

const getTasks=async (req, res) => {
    try {
    if (req.user.role === 'ADMIN') {
        const result = await pool.query(
            `SELECT tasks.*, users.name AS assigned_to_name, projects.name AS project_name
            FROM tasks
            JOIN users ON tasks.assigned_to = users.id
            JOIN projects ON tasks.project_id = projects.id`
        );
        res.status(200).json(result.rows);
    }
    else if(req.user.role === 'PM') {
        const result = await pool.query(
            `SELECT tasks.*, users.name AS assigned_to_name, projects.name AS project_name
            FROM tasks
            JOIN users ON tasks.assigned_to = users.id
            JOIN projects ON tasks.project_id = projects.id
            WHERE projects.created_by = $1`,
            [req.user.id]
        );
        res.status(200).json(result.rows);
    }
    else if (req.user.role === 'DEVELOPER') {
        const result = await pool.query(
            `SELECT tasks.*, users.name AS assigned_to_name, projects.name AS project_name
            FROM tasks
            JOIN users ON tasks.assigned_to = users.id
            JOIN projects ON tasks.project_id = projects.id
            WHERE tasks.assigned_to = $1`,
            [req.user.id]
        );
        res.status(200).json(result.rows);
    }
}
catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
}
 
}

const updateTaskStatus = async (req, res) => {
    try{
        const { id } = req.params;
        const { status } = req.body;
        if (!status) {
            return res.status(400).json({ message: 'Status is required' });
        }
        if (!['TODO', 'IN_PROGRESS', 'IN_REVIEW','DONE'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }
        if (req.user.role === 'DEVELOPER') {
           
            const task = await pool.query(
                'SELECT * FROM tasks WHERE id = $1 AND assigned_to = $2',
                [id, req.user.id]
            );
            if (!task.rows.length) {
                return res.status(404).json({ message: 'Task not found or not assigned to you' });
            }
             const oldStatus = task.rows[0].status;
            
                   const result = await pool.query(
    `UPDATE tasks
     SET status = $1
     WHERE id = $2
     RETURNING *`,
    [status, id]
);
const newStatus = result.rows[0].status;


await pool.query(
    `INSERT INTO activity_logs
    (task_id, user_id, action, old_status, new_status)
    VALUES ($1, $2, $3, $4, $5)`,
    [
        id,
        req.user.id,
        'STATUS_UPDATED',
        oldStatus,
        status
    ]
);
     res.status(200).json({
    message: "Task status updated successfully",
    task: result.rows[0]
});

        }
        if (req.user.role === 'PM') {
            
            const task = await pool.query(
                `SELECT tasks.* FROM tasks
                JOIN projects ON tasks.project_id = projects.id
                WHERE tasks.id = $1 AND projects.created_by = $2`,
                [id, req.user.id]
            );
            if (!task.rows.length) {
                return res.status(404).json({ message: 'Task not found or not created by you' });
            }
            const oldStatus = task.rows[0].status;
            
                   const result = await pool.query(
    `UPDATE tasks
     SET status = $1
     WHERE id = $2
     RETURNING *`,
    [status, id]
);
const newStatus = result.rows[0].status;
await pool.query(
    `INSERT INTO activity_logs
    (task_id, user_id, action, old_status, new_status)
    VALUES ($1, $2, $3, $4, $5)`,
    [
        id,
        req.user.id,
        'STATUS_UPDATED',
        oldStatus,
        newStatus
    ]
);
res.status(200).json({
    message: "Task status updated successfully",
    task: result.rows[0]
});
     

        }
        if (req.user.role === 'ADMIN') {
           
            const task = await pool.query(
                'SELECT * FROM tasks WHERE id = $1',
                [id]
            );
              if (!task.rows.length) {
                return res.status(404).json({ message: 'Task not found' });
            }
            const oldStatus = task.rows[0].status;
           
            const result = await pool.query(
    `UPDATE tasks
     SET status = $1
     WHERE id = $2
     RETURNING *`,
    [status, id]
);
 const newStatus = result.rows[0].status;
await pool.query(
    `INSERT INTO activity_logs
    (task_id, user_id, action, old_status, new_status)
    VALUES ($1, $2, $3, $4, $5)`,
    [
        id,
        req.user.id,
        'STATUS_UPDATED',
        oldStatus,
        newStatus
    ]
);
res.status(200).json({
    message: "Task status updated successfully",
    task: result.rows[0]
});
          

        }

    }
    catch (error) {
        console.error('Error updating task status:', error);
        res.status(500).json({ error: 'Failed to update task status' });
    }

}

   

module.exports = { createTask, getTasks, updateTaskStatus};
