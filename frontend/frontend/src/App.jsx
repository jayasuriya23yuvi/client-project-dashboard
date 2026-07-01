import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import socket from "./socket";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Tasks from "./pages/Tasks";
import Notifications from "./pages/Notifications";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {

  useEffect(() => {

    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
        socket.emit("join_room", user.id);
    }

}, []);
  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Login />} />

        <Route element={<Layout />}>

         <Route
    path="/dashboard"
    element={
        <ProtectedRoute>
            <Dashboard />
        </ProtectedRoute>
    }
/>

          <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />

          <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />

          <Route
            path="/notifications"
            element={<Notifications />}
          />

        </Route>

      </Routes>

    </BrowserRouter>
  );
}

export default App;