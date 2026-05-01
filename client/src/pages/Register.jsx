import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import { motion } from "framer-motion";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("diaryToken");
    if (token) navigate("/dashboard");
  }, []);

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

  return (
    <div className="auth-page premium-auth">
      <motion.div
        className="premium-auth-card"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="auth-form-side">
          <div className="auth-logo">📔 Dear Diary</div>

          <h1>Create Your Diary</h1>
          <p className="auth-subtitle">
            Start your private journal and save your beautiful memories securely.
          </p>

          <form onSubmit={handleSubmit}>
            <label>Username</label>
            <input
              type="text"
              name="username"
              placeholder="Choose username"
              onChange={handleChange}
            />

            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              onChange={handleChange}
            />

            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Create password"
              onChange={handleChange}
            />

            <button type="submit" className="auth-main-btn">
              Create Diary
            </button>
          </form>

          <p className="auth-switch" onClick={() => navigate("/")}>
            Already have a diary? Login
          </p>
        </div>

        <div className="auth-doodle-side">
          <div className="doodle-card">
            <span className="doodle-main">✍️📒</span>
            <h2>Your secret space</h2>
            <p>Write freely. Lock pages. Keep every memory close to your heart.</p>
          </div>

          <span className="floating-doodle d1">💌</span>
          <span className="floating-doodle d2">🌸</span>
          <span className="floating-doodle d3">⭐</span>
          <span className="floating-doodle d4">🔑</span>
        </div>
      </motion.div>
    </div>
  );
}