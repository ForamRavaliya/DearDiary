
import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function Login() {
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", form);

      localStorage.setItem("diaryToken", res.data.token);
      localStorage.setItem("diaryUser", JSON.stringify(res.data.user));

      alert("Login Successful");

      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

useEffect(() => {
  const token = localStorage.getItem("diaryToken");

  if (token) {
    navigate("/dashboard");
  }
}, []);
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

        <h1>Welcome Back</h1>
        <p className="auth-subtitle">
          Open your private diary and continue writing your secret memories.
        </p>

        <form onSubmit={handleSubmit}>
          <label>Username</label>
          <input
            type="text"
            name="username"
            placeholder="Enter your username"
            onChange={handleChange}
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            onChange={handleChange}
          />

          <button type="submit" className="auth-main-btn">
            Unlock Diary
          </button>
        </form>

        <p className="auth-switch" onClick={() => navigate("/register")}>
          New here? Create your diary account
        </p>
      </div>

      <div className="auth-doodle-side">
        <div className="doodle-card">
          <span className="doodle-main">🔐📖</span>
          <h2>Keep it secret</h2>
          <p>Your thoughts, moods, and memories stay safe with you.</p>
        </div>

        <span className="floating-doodle d1">✨</span>
        <span className="floating-doodle d2">🖊️</span>
        <span className="floating-doodle d3">🌙</span>
        <span className="floating-doodle d4">🎀</span>
      </div>
    </motion.div>
  </div>
);
}