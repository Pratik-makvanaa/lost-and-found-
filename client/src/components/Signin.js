import React, { useState } from "react";
import "./Signin.css";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import axios from "axios";
import config from "./config";
import { useDispatch } from "react-redux";
import { login } from "../utils/userSlice";
import Spinner from "./Spinner"; // Assuming you have a Spinner component
import { validateEmail } from "../utils/validation";

const Base_URL = config.baseURL;

function Signin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // State for loading indicator
  const [formError, setFormError] = useState("");

  const handleNavigateToSignUp = () => {
    navigate("/sign-up");
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setFormError("");

    const emailError = validateEmail(email);
    if (emailError) {
      setFormError(emailError);
      return;
    }
    if (!password) {
      setFormError("Password is required.");
      return;
    }

    setLoading(true); // Set loading state to true when starting sign-in

    const data = {
      email: email,
      password: password,
    };

    try {
      const res = await axios.post(`${Base_URL}/login`, data, {
        withCredentials: true,
      });

      const token = res.data.token;

      localStorage.setItem("authToken", token);
      dispatch(
        login({
          email: email,
          password: password,
        })
      );
      alert("Successfully signed in, you can now raise your concerns!");
      navigate("/home");
    } catch (error) {
      console.error("Error during login:", error);
      setFormError(
        error.response?.status === 401
          ? "Email or password is incorrect."
          : error.response?.data?.errors?.map(({ msg }) => msg).join(" ") ||
              "Could not sign in. Please try again."
      );
    } finally {
      setLoading(false); // Set loading state to false after login attempt completes
    }
  };

  return (
    <>
      <Navbar />
      <div className="signin-container">
        <h2>Sign In</h2>
        <form onSubmit={handleSignIn} noValidate>
          {formError && (
            <p role="alert" className="form-error">
              {formError}
            </p>
          )}
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Enter your email"
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
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </div>
          <div>
            <button className="btn-signin" type="submit" disabled={loading}>
              {loading ? <Spinner /> : "Sign In"}
            </button>
            <p className="btn-spread">Not a member?</p>
          </div>
        </form>
        <button className="btn-signin" onClick={handleNavigateToSignUp}>
          Sign Up
        </button>
      </div>
    </>
  );
}

export default Signin;
