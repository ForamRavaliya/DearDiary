import React, { useEffect, useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Trash() {
  const [trashDiaries, setTrashDiaries] = useState([]);
  const navigate = useNavigate();

  const fetchTrash = async () => {
    try {
      const res = await API.get("/diaries/trash");
      setTrashDiaries(res.data.diaries);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to fetch trash");
    }
  };

  const restoreDiary = async (id) => {
    try {
      await API.patch(`/diaries/${id}/restore`);
      fetchTrash();
    } catch (err) {
      alert(err.response?.data?.message || "Restore failed");
    }
  };

  const permanentDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure? This diary will be permanently deleted."
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/diaries/${id}/permanent`);
      fetchTrash();
    } catch (err) {
      alert(err.response?.data?.message || "Permanent delete failed");
    }
  };

  useEffect(() => {
    fetchTrash();
  }, []);

  return (
    <div className="page-container trash-theme">

      <div className="page-header">
        <button className="back-btn" onClick={() => navigate("/dashboard")}>
          ← Dashboard
        </button>
        <h1>🗑 Trash</h1>
      </div>

      {trashDiaries.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🗑✨</div>
          <h2>Trash is empty</h2>
          <p>Your deleted pages will appear here.</p>

          <button className="primary-btn">Go Back to Dashboard</button>
        </div>
      ) : (
        <div className="page-grid">
          {trashDiaries.map((d) => (
            <div className="card" key={d.id}>
              <h3>{d.title}</h3>
              <p>Mood: {d.mood || "Not added"}</p>

              <div className="card-actions-row">
                <button onClick={() => restoreDiary(d.id)}>Restore</button>
                <button onClick={() => permanentDelete(d.id)}>
                  Delete Forever
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}