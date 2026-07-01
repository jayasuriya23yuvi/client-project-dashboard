function Dashboard() {

    const user = JSON.parse(localStorage.getItem("user"));

    return (
        <>
            <h1>Dashboard</h1>

            <h2>Welcome {user.name}</h2>

            <p>Role : {user.role}</p>
        </>
    );
}

export default Dashboard;