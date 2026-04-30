import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/auth/register", form);

      alert("Registration Successful");

      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };
useEffect(() => {
  const token = localStorage.getItem("diaryToken");

  if (token) {
    navigate("/dashboard");
  }
}, []);

  return (
    <div className="auth-container">
      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="auth-left">
          <div className="logo-text">Dear Diary</div>
          <h2>Create Account</h2>

          <form onSubmit={handleSubmit}>
            <input type="text" name="username" placeholder="Username" onChange={handleChange} />
            <input type="email" name="email" placeholder="Email" onChange={handleChange} />
            <input type="password" name="password" placeholder="Password" onChange={handleChange} />

            <button type="submit">Register</button>
          </form>

          <p onClick={() => navigate("/")}>
            Already have an account? Login
          </p>
        </div>

        <div className="auth-right">
          <span className="auth-bubble bubble-1"></span>
          <span className="auth-bubble bubble-2"></span>
          <div className="illustration">✍️📖</div>
        </div>
      </motion.div>
    </div>
  );
}