import React, { useEffect, useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Calendar() {
  const [diaries, setDiaries] = useState([]);
  const navigate = useNavigate();

  const fetchDiaries = async () => {
    try {
      const res = await API.get("/diaries");
      setDiaries(res.data.diaries);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to load calendar");
    }
  };

  useEffect(() => {
    fetchDiaries();
  }, []);

  const getDateOnly = (dateValue) => {
    return new Date(dateValue).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="calendar-page">
      <div className="calendar-header">
        <button onClick={() => navigate("/dashboard")}>← Dashboard</button>
        <h1>📅 Diary Calendar</h1>
      </div>

      {diaries.length === 0 ? (
        <div className="calendar-empty">
          <h2>No diary pages yet</h2>
          <p>Write your first diary page to see it on calendar.</p>
        </div>
      ) : (
        <div className="calendar-list">
          {diaries.map((d) => (
            <div
              className="calendar-card"
              key={d.id}
              onClick={() => navigate(`/diary/${d.id}`)}
            >
              <div className="calendar-date-box">
                <strong>{getDateOnly(d.created_at)}</strong>
              </div>

              <div>
                <h3>{d.title}</h3>
                <p>😊 Mood: {d.mood || "Not added"}</p>
                <span>{d.is_locked ? "🔒 Locked" : "🔓 Open"}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}