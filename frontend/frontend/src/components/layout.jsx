import { Link, Outlet, useNavigate } from "react-router-dom";

function Layout() {
  const navigate = useNavigate();

  const logout = () => {
    socket.disconnect();
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>

      {/* Sidebar */}
      <div
        style={{
          width: "220px",
          background: "#1f2937",
          color: "white",
          padding: "20px",
        }}
      >
        <h2>Task Manager</h2>

        <hr />

        <p>
          <Link to="/dashboard">Dashboard</Link>
        </p>

        <p>
          <Link to="/projects">Projects</Link>
        </p>

        <p>
          <Link to="/tasks">Tasks</Link>
        </p>

        <p>
          <Link to="/notifications">Notifications</Link>
        </p>

        <button onClick={logout}>
          Logout
        </button>
      </div>

     
      <div style={{ flex: 1, padding: "20px" }}>
        <Outlet />
      </div>

    </div>
  );
}

export default Layout;