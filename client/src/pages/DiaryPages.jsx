import React, { useEffect, useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

export default function DiaryPages() {
  const [diaries, setDiaries] = useState([]);
  const navigate = useNavigate();

  const fetchDiaries = async () => {
    try {
      const res = await API.get("/diaries");
      setDiaries(res.data.diaries);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to load diary pages");
    }
  };

  useEffect(() => {
    fetchDiaries();
  }, []);

  return (
    <div className="all-pages-screen">
      <div className="all-pages-header">
        <button onClick={() => navigate("/dashboard")}>← Dashboard</button>
        <h1>📄 All Diary Pages</h1>
      </div>

      {diaries.length === 0 ? (
        <div className="all-pages-empty">
          <h2>No diary pages yet</h2>
          <p>Your written diary pages will appear here.</p>
        </div>
      ) : (
        <div className="all-pages-grid">
          {diaries.map((d) => (
            <div
              className="all-page-card"
              key={d.id}
              onClick={() => navigate(`/diary/${d.id}`)}
            >
              <h3>{d.title}</h3>
              <p>😊 Mood: {d.mood || "Not added"}</p>
              <p>🏷 {d.tags || "No tags"}</p>
              <span>{d.is_locked ? "🔒 Locked" : "🔓 Open"}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}