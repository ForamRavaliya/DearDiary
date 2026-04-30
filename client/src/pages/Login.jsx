
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
  <div className="auth-container">
    <motion.div
      className="auth-card"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="auth-left">
        <div className="logo-text">Dear Diary</div>
        <h2>Log In</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
          />

          <button type="submit">Login</button>
        </form>

        <p onClick={() => navigate("/register")}>
          Don&apos;t have an account? Register
        </p>
      </div>

      <div className="auth-right">
        <span className="auth-bubble bubble-1"></span>
        <span className="auth-bubble bubble-2"></span>
        <div className="illustration">📔🌵</div>
      </div>
    </motion.div>
  </div>
);
}