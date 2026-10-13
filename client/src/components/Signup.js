import React, { useState } from "react";
import "./Signup.css";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import axios from "axios";
import config from "./config";
import Spinner from "./Spinner";
import { validateEmail } from "../utils/validation";

const Base_URL = config.baseURL;

function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [rollno, setRollNo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleRollNoChange = (e) => {
    setRollNo(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setFormError("");

    const emailError = validateEmail(email);
    if (name.trim().length < 3) {
      setFormError("Name must be at least 3 characters long.");
      return;
    }
    if (!rollno.trim()) {
      setFormError("Roll number is required.");
      return;
    }
    if (emailError) {
      setFormError(emailError);
      return;
    }
    if (password.length < 6) {
      setFormError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const data = {
      username: name,
      rollno: rollno,
      email: email,
      password: password,
    };

    try {
      await axios.post(`${Base_URL}/signup`, data);

      alert("Successfully registered, proceed to login!");
      navigate("/sign-in");
    } catch (error) {
      const validationErrors = error.response?.data?.errors;
      setFormError(
        error.response?.data?.message ||
          validationErrors?.map(({ msg }) => msg).join(" ") ||
          (error.response?.status === 409
            ? "That email or roll number is already registered."
            : "Could not create your account. Please try again.")
      );
    } finally {
      setLoading(false); // Set loading state to false after login attempt completes
    }
  };

  return (
    <>
      <Navbar />
      <div className="card signup-card">
        <h2>Sign Up</h2>
        <form onSubmit={handleSignUp} noValidate>
          {formError && <p role="alert" className="form-error">{formError}</p>}
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={handleNameChange}
              minLength={3}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="rollno">Roll No:</label>
            <input
              type="text"
              id="rollno"
              name="rollno"
              value={rollno}
              onChange={handleRollNoChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleEmailChange}
              autoComplete="email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handlePasswordChange}
              minLength={6}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              required
            />
          </div>
          <button
            className="submit-button"
            type="submit"
            disabled={loading}
          >
            {loading ? <Spinner /> : "Sign Up"}{" "}
            {/* Show Spinner component when loading */}
          </button>
        </form>
      </div>
    </>
  );
}

export default Signup;
