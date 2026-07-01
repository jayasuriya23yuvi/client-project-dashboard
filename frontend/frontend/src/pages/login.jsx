import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleLogin = async () => {
  try {
    const response = await axios.post(
      "http://localhost:5000/api/auth/login",
      {
        email,
        password,
      }
    );

    localStorage.setItem("token", response.data.token);
localStorage.setItem("user", JSON.stringify(response.data.user));
navigate("/dashboard");
console.log("Token saved");

  } catch (error) {
    console.log("Backend says:", error.response.data);
}
};

  return (
    <div>

      <h1>Login</h1>

      <input
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <br /><br />

      <input
        type="password"
        placeholder="Enter Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br /><br />

    <button onClick={handleLogin}>
    Login
</button>

    </div>
  );
}



export default Login;