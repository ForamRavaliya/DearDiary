import React, { useEffect, useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

export default function LockedPages() {
  const [lockedPages, setLockedPages] = useState([]);
  const navigate = useNavigate();

  const fetchLockedPages = async () => {
    try {
      const res = await API.get("/diaries");
      const lockedOnly = res.data.diaries.filter((d) => d.is_locked);
      setLockedPages(lockedOnly);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to load locked pages");
    }
  };

  useEffect(() => {
    fetchLockedPages();
  }, []);

  return (
    <div className="locked-pages-screen">
      <div className="locked-pages-header">
        <button onClick={() => navigate("/dashboard")}>← Dashboard</button>
        <h1>🔐 Locked Diary Pages</h1>
      </div>

      {lockedPages.length === 0 ? (
        <div className="locked-empty">
          <h2>No locked pages yet</h2>
          <p>Lock private diary pages and see them here.</p>
        </div>
      ) : (
        <div className="locked-grid">
          {lockedPages.map((d) => (
            <div
              className="locked-page-card"
              key={d.id}
              onClick={() => navigate(`/diary/${d.id}`)}
            >
              <div className="locked-icon">🔐</div>
              <h3>{d.title}</h3>
              <p>😊 Mood: {d.mood || "Not added"}</p>
              <span>Click to unlock</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}