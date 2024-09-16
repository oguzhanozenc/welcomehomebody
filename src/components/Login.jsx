// Login.jsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginCustomer } from "../actions/authActions";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/Auth.css";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const authError = useSelector((state) => state.auth.error);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const from = location.state?.from?.pathname || "/account";

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginCustomer(email, password))
      .then(() => {
        toast.success("Logged in successfully!");
        navigate(from, { replace: true });
      })
      .catch((error) => {
        toast.error(error.message || "Failed to login.");
      });
  };

  return (
    <div className="auth-container">
      <h2>Login to Your Account</h2>
      {authError && <p className="error-message">{authError}</p>}
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="username"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
        <button type="submit" className="btn auth-btn">
          Login
        </button>
      </form>
      <p>
        Don't have an account?{" "}
        <Link to="/signup" state={{ from: location }}>
          Sign Up Here
        </Link>
      </p>
    </div>
  );
};

export default Login;
