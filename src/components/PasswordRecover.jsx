import { useState } from "react";
import { gql } from "graphql-request";
import client from "../client";
import { toast } from "react-toastify";
import "../styles/Auth.css";

const PasswordRecover = () => {
  const [email, setEmail] = useState("");

  const handlePasswordRecover = async (e) => {
    e.preventDefault();

    const mutation = gql`
      mutation customerRecover($email: String!) {
        customerRecover(email: $email) {
          customerUserErrors {
            code
            field
            message
          }
        }
      }
    `;

    try {
      const response = await client.request(mutation, { email });
      const errors = response.customerRecover.customerUserErrors;

      if (errors.length > 0) {
        toast.error(errors[0].message);
      } else {
        toast.success(
          "If an account with that email exists, a password reset email has been sent."
        );
      }
    } catch (error) {
      console.error("Password recovery failed:", error);
      toast.error("Failed to send password reset email.");
    }
  };

  return (
    <div className="auth-container">
      <h2>Reset Your Password</h2>
      <p>
        Enter your email address below, and we'll send you a link to reset your
        password. After resetting your password, return here to log in.
      </p>
      <form onSubmit={handlePasswordRecover} className="auth-form">
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit" className="btn auth-btn">
          Send Reset Link
        </button>
      </form>
    </div>
  );
};

export default PasswordRecover;
