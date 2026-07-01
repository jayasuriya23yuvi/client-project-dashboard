import { useEffect, useState } from "react";
import axios from "axios";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
const [description, setDescription] = useState("");
const [projectId, setProjectId] = useState("");
const [assignedTo, setAssignedTo] = useState("");
const [priority, setPriority] = useState("");
const [dueDate, setDueDate] = useState("");
const [projects, setProjects] = useState([]);
const [developers, setDevelopers] = useState([]);
  const token = localStorage.getItem("token");
  //console.log("Token:",token);

  // FETCH TASKS
  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTasks(res.data);
    } catch (err) {
      console.log("Error fetching tasks:", err);
    }
  };



  const fetchProjects = async () => {
    try {
        const response = await axios.get(
            "http://localhost:5000/api/projects",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        setProjects(response.data.projects);

    } catch (error) {
        console.log(error);
    }
};


const fetchDevelopers = async () => {
    try {
        const response = await axios.get(
            "http://localhost:5000/api/users/developers",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        setDevelopers(response.data.developers);

    } catch (error) {
        console.log(error);
    }
};


const createTask = async () => {
    try {

        await axios.post(
            "http://localhost:5000/api/tasks",
            {
                title,
                description,
                project_id: projectId,
                assigned_to: assignedTo,
                priority,
                due_date: dueDate
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        setTitle("");
        setDescription("");
        setProjectId("");
        setAssignedTo("");
        setPriority("");
        setDueDate("");

        fetchTasks();

    } catch (error) {
        console.log("Error creating task:", error);
    }
};


const deleteTask = async (id) => {};


  useEffect(() => {
    fetchTasks();
    fetchProjects();
    fetchDevelopers();
  }, []);

  const updateTaskStatus = async (id, status) => {
  try {
    await axios.patch(
      `http://localhost:5000/api/tasks/${id}`,
      {
        status,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    fetchTasks();

  } catch (error) {
    console.log("Error updating task:", error);
  }
};
  return (

    
    
    <div style={{ padding: "20px" }}>
      <h1>Tasks</h1>
                 <input
    type="text"
    placeholder="Task Title"
    value={title}
    onChange={(e) => setTitle(e.target.value)}
/>
<textarea
    placeholder="Description"
    value={description}
    onChange={(e) => setDescription(e.target.value)}
/>




<select
    value={projectId}
    onChange={(e) => setProjectId(e.target.value)}
>
    <option value="">Select Project</option>

    {projects.map((project) => (
        <option
            key={project.id}
            value={project.id}
        >
            {project.name}
        </option>
    ))}

</select>

<select
    value={assignedTo}
    onChange={(e) => setAssignedTo(e.target.value)}
>
    <option value="">Assign Developer</option>

    {developers.map((developer) => (
        <option
            key={developer.id}
            value={developer.id}
        >
            {developer.name}
        </option>
    ))}

</select>


<select
    value={priority}
    onChange={(e) => setPriority(e.target.value)}
>
    <option value="">Priority</option>

    <option value="LOW">LOW</option>
    <option value="MEDIUM">MEDIUM</option>
    <option value="HIGH">HIGH</option>
    <option value="CRITICAL">CRITICAL</option>

</select>
<input
    type="date"
    value={dueDate}
    onChange={(e) => setDueDate(e.target.value)}
/>


<button onClick={createTask}>
    Create Task
</button>


<br /><br />
<hr />
<br />

      {tasks.length === 0 ? (
        <p>No tasks found</p>
      ) : (
        tasks.map((task) => (
          <div
            key={task.id}
            style={{
              border: "1px solid gray",
              marginBottom: "10px",
              padding: "10px",
            }}
          >
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p>Project: {task.project_name}</p>
            <p>Assigned To: {task.assigned_to_name}</p>
            <p>Priority: {task.priority}</p>
            <p>Status: {task.status}</p>

<select
    value={task.status}
    onChange={(e) =>
        updateTaskStatus(task.id, e.target.value)
    }
>
    <option value="TODO">TODO</option>
    <option value="IN_PROGRESS">IN PROGRESS</option>
    <option value="IN_REVIEW">IN REVIEW</option>
    <option value="DONE">DONE</option>
</select>


            <p>Due Date: {new Date(task.due_date).toLocaleDateString()}</p>
            
 

<br /><br />



<br /><br />






          </div>
        ))
      )}
    </div>
  );
}

export default Tasks;