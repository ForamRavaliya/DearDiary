import React, { useEffect, useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();

  const fetchFavorites = async () => {
    try {
      const res = await API.get("/diaries/search?favorite=true");
      setFavorites(res.data.diaries);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to load favorites");
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  return (
   <div className="page-container favorites-theme">
      <div className="favorites-header">
        <button onClick={() => navigate("/dashboard")}>← Dashboard</button>
        <h1>⭐ Favorite Diary Pages</h1>
      </div>

      {favorites.length === 0 ? (
        <div className="favorites-empty">
          <h2>No favorite pages yet</h2>
          <p>Mark diary pages as favorite to see them here.</p>
        </div>
      ) : (
        <div className="favorites-grid">
          {favorites.map((d) => (
            <div
              className="favorite-card"
              key={d.id}
              onClick={() => navigate(`/diary/${d.id}`)}
            >
              <h3>{d.title}</h3>
              <p>😊 Mood: {d.mood || "Not added"}</p>
              <span>{d.is_locked ? "🔒 Locked" : "🔓 Open"}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}