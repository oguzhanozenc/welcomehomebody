import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { signUpCustomer } from "../actions/authActions";
import { toast } from "react-toastify";
import "../styles/Auth.css";

const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const authError = useSelector((state) => state.auth.error);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const from = location.state?.from?.pathname || "/account";

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(signUpCustomer(firstName, lastName, email, password))
      .then(() => {
        toast.success("Account created and logged in!");
        navigate(from, { replace: true });
      })
      .catch((error) => {
        toast.error(error.message || "Failed to create account.");
      });
  };

  return (
    <div className="auth-container">
      <h2>Create an Account</h2>
      {authError && <p className="error-message">{authError}</p>}
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
          autoComplete="given-name"
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
          autoComplete="family-name"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <input
          type="password"
          placeholder="Password (min. 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
          minLength="6"
        />
        <button type="submit" className="btn auth-btn">
          Sign Up
        </button>
      </form>
      <p>
        Already have an account?{" "}
        <Link to="/login" state={{ from: location }}>
          Login Here
        </Link>
      </p>
    </div>
  );
};

export default SignUp;
