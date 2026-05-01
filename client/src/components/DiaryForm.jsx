
import React, { useState, useEffect } from "react";
import API from "../api/api";
import { useLocation } from "react-router-dom";
export default function DiaryForm({ onClose, refresh }) {
  const [form, setForm] = useState({
    title: "",
    content: "",
    mood: "",
    tags: "",
    template: "classic",
    is_locked: false,
    entry_password: "",
    signature: "",
  });

  const now = new Date();

  const day = now.toLocaleDateString("en-IN", { weekday: "long" });
  const date = now.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const time = now.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const templates = [
    { id: "classic", name: "Classic", emoji: "📜" },
    { id: "pink", name: "Pink Bow", emoji: "🎀" },
    { id: "night", name: "Secret Night", emoji: "🌙" },
    { id: "nature", name: "Nature Calm", emoji: "🍃" },
  ];

const moods = [
  { value: "Happy", label: "😊 Happy" },
  { value: "Sad", label: "😢 Sad" },
  { value: "Calm", label: "😌 Calm" },
  { value: "Angry", label: "😡 Angry" },
  { value: "Joy", label: "🥳 Joy" },
  { value: "Amazing", label: "🤩 Amazing" },
  { value: "Loved", label: "😍 Loved" },
  { value: "Tired", label: "😴 Tired" },
  { value: "Stressed", label: "😰 Stressed" },
  { value: "Neutral", label: "😐 Neutral" },
  { value: "Not Feeling Anything", label: "🫥 Not Feeling Anything" },
];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/diaries", form);
      alert("Diary Created ✅");
      refresh();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Error creating diary");
    }
  };
const location = useLocation();

useEffect(() => {
  const params = new URLSearchParams(location.search);
  const moodFromUrl = params.get("mood");

  if (moodFromUrl && moods.some(m => m.value === moodFromUrl)) {
    setForm((prev) => ({ ...prev, mood: moodFromUrl }));
  }
}, [location.search]);

  return (
    <div className="modal">
      <div className={`diary-editor upgraded-diary diary-template-${form.template}`}>
        <button type="button" className="close-btn" onClick={onClose}>
          ✕
        </button>

        <div className="diary-date-note">
          <span>{day}</span>
          <strong>{date}</strong>
          <small>{time}</small>
        </div>

        <div className="diary-heading">
          <p>My Secret Diary</p>
          <h2>Write Today&apos;s Memory</h2>
        </div>

        <div className="template-selector upgraded-template-selector">
          {templates.map((t) => (
            <button
              key={t.id}
              type="button"
              className={form.template === t.id ? "template active" : "template"}
              onClick={() => setForm({ ...form, template: t.id })}
            >
              <span>{t.emoji}</span>
              <p>{t.name}</p>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="diary-title-row">
            <span>Title:</span>
            <input
              name="title"
              placeholder="Give this page a title..."
              value={form.title}
              onChange={handleChange}
            />
          </div>

          <div className="mood-chip-box">
            {moods.map((m) => (
              <button
                type="button"
                key={m.value}
                className={form.mood === m.value ? "mood-chip selected" : "mood-chip"}
                onClick={() => setForm({ ...form, mood: m.value })}
              >
                {m.label}
              </button>
            ))}
          </div>

          <input
            className="tags-input"
            name="tags"
            placeholder="Tags: college, memory, family..."
            value={form.tags}
            onChange={handleChange}
          />

          <textarea
            className="diary-content-input upgraded-content"
            name="content"
            placeholder="Dear Diary..."
            value={form.content}
            onChange={handleChange}
          />

          <div className="signature-box">
            <span>Signature:</span>
            <input
              name="signature"
              placeholder="Your name or sign..."
              value={form.signature}
              onChange={handleChange}
            />
          </div>

          <div className="secret-lock-box">
            <label>
              <input
                type="checkbox"
                name="is_locked"
                checked={form.is_locked}
                onChange={handleChange}
              />
              <div>
                <strong>🔐 Keep this page secret</strong>
                <p>Lock this diary page with a password.</p>
              </div>
            </label>

            {form.is_locked && (
              <input
                type="password"
                name="entry_password"
                placeholder="Set secret password"
                value={form.entry_password}
                onChange={handleChange}
              />
            )}
          </div>

          <div className="diary-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>

            <button type="submit" className="save-btn">
              Save Page
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}