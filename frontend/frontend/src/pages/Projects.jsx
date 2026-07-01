import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

function Projects() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [editId, setEditId] = useState(null);
const [isEditing, setIsEditing] = useState(false);


  const token = localStorage.getItem("token");
  const fetchProjects = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/projects",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProjects(response.data.projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      navigate("/");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const createProject = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/projects",
        { name, description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setName("");
      setDescription("");
      fetchProjects();
    } catch (err) {
      console.log("Error creating project:", err);
    }
  };

  const deleteProject = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/projects/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchProjects();
    } catch (err) {
      console.log("Error deleting project:", err);
    }
  };

  const startEdit = (project) => {
  setEditId(project.id);
  setName(project.name);
  setDescription(project.description);
  setIsEditing(true);
};

const updateProject = async () => {
  try {
    await axios.patch(
      `http://localhost:5000/api/projects/${editId}`,
      {
        name,
        description,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setName("");
    setDescription("");
    setEditId(null);
    setIsEditing(false);

    fetchProjects();
  } catch (err) {
    console.log("Error updating project:", err);
  }
};

  return (
    <div style={{ padding: "20px" }}>
      <h1>Projects</h1>

      <div style={{ marginBottom: "20px" }}>
        <input
          placeholder="Project name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <br /><br />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <br /><br />

        {isEditing ? (
  <button onClick={updateProject}>
    Update Project
  </button>
) : (
  <button onClick={createProject}>
    Create Project
  </button>
)}

{isEditing && (
  <button
    onClick={() => {
      setName("");
      setDescription("");
      setIsEditing(false);
      setEditId(null);
    }}
  >
    Cancel
  </button>
)}
      </div>

      <hr />

      {projects.length === 0 ? (
        <p>No projects found</p>
      ) : (
        projects.map((project) => (
          <div
            key={project.id}
            style={{
              border: "1px solid gray",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <h3>{project.name}</h3>
            <p>{project.description}</p>

            <button onClick={() => startEdit(project)}>
  Edit
</button>

            <button onClick={() => deleteProject(project.id)}>
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default Projects;