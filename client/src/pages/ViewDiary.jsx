import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/api";

export default function ViewDiary() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [diary, setDiary] = useState(null);
  const [password, setPassword] = useState("");
  const [locked, setLocked] = useState(false);

  const fetchDiary = async () => {
    try {
      const res = await API.get(`/diaries/${id}`);
      setDiary(res.data.diary);

      if (res.data.message === "Diary is locked") {
        setLocked(true);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Diary not found");
      navigate("/dashboard");
    }
  };

  const unlockDiary = async () => {
    try {
      const res = await API.post(`/diaries/${id}/unlock`, {
        entry_password: password,
      });

      setDiary(res.data.diary);
      setLocked(false);
      setPassword("");
    } catch (err) {
      alert(err.response?.data?.message || "Wrong password");
    }
  };

  const formatDate = (dateValue) => {
    const date = new Date(dateValue);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatDay = (dateValue) => {
    const date = new Date(dateValue);
    return date.toLocaleDateString("en-IN", {
      weekday: "long",
    });
  };

  const formatTime = (dateValue) => {
    const date = new Date(dateValue);
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    fetchDiary();
  }, []);

  if (!diary) {
    return <p className="loading-text">Loading diary...</p>;
  }

  return (
    <div className="view-page-wrapper">
      <button className="back-btn" onClick={() => navigate("/dashboard")}>
        ← Back to Dashboard
      </button>

      {locked ? (
        <div className="locked-box">
          <div className="lock-icon">🔐</div>
          <h2>This page is locked</h2>
          <p>Enter the page password to open this memory.</p>

          <input
            type="password"
            placeholder="Enter diary password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button onClick={unlockDiary}>Unlock Page</button>
        </div>
      ) : (
        <div className="diary-book-frame">
          <div className="full-diary-page">
           <div className="diary-date-box-new">
             <span>{formatDay(diary.created_at)}</span>
             <strong>{formatDate(diary.created_at)}</strong>
             <small>{formatTime(diary.created_at)}</small>
           </div>
            <div className="page-sticker sticker-one">🌸</div>
            <div className="page-sticker sticker-two">✨</div>

            <h1>{diary.title}</h1>

            <div className="diary-meta">
              <span>😊 Mood: {diary.mood || "Not added"}</span>
              <span>🏷 {diary.tags || "No tags"}</span>
            </div>

            <div className="diary-written-content">
              {diary.content}
            </div>

            <div className="signature-area">
              <p>Signature</p>
              <h3>________________</h3>
            </div>
            <div className="view-actions">
              <button onClick={() => navigate(`/diary/${id}/edit`)}>
                ✏️ Edit Page
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}