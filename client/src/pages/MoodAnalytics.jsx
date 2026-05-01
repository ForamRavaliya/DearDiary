import React, { useEffect, useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

export default function MoodAnalytics() {
  const [moodStats, setMoodStats] = useState([]);
  const navigate = useNavigate();

  const fetchStats = async () => {
    try {
      const res = await API.get("/diaries/stats");
      setMoodStats(res.data.stats.moodStats || []);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to load mood analytics");
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const totalMoodCount = moodStats.reduce(
    (sum, item) => sum + Number(item.count),
    0
  );

  return (
    <div className="page-container analytics-theme">
      <div className="mood-header">
        <button onClick={() => navigate("/dashboard")}>← Dashboard</button>
        <h1>📊 Mood Analytics</h1>
      </div>

      {moodStats.length === 0 ? (
        <div className="mood-empty">
          <h2>No mood data yet</h2>
          <p>Add mood while writing diary pages to see analytics.</p>
        </div>
      ) : (
        <div className="mood-grid">
          {moodStats.map((item) => {
            const percentage = Math.round(
              (Number(item.count) / totalMoodCount) * 100
            );

            return (
              <div className="mood-card" key={item.mood}>
                <div className="mood-card-top">
                  <h3>{item.mood}</h3>
                  <strong>{item.count}</strong>
                </div>

                <div className="mood-bar">
                  <div style={{ width: `${percentage}%` }}></div>
                </div>

                <p>{percentage}% of your diary pages</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}