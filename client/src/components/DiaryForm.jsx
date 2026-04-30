import React, { useState } from "react";
import API from "../api/api";

export default function DiaryForm({ onClose, refresh }) {
  const [form, setForm] = useState({
    title: "",
    content: "",
    mood: "",
    tags: "",
    template: "classic",
    is_locked: false,
    entry_password: "",
  });

  const getCurrentDateTime = () => {
    const now = new Date();

    return {
      day: now.toLocaleDateString("en-IN", { weekday: "long" }),
      date: now.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
      time: now.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  const { day, date, time } = getCurrentDateTime();

  const templates = [
    { id: "classic", name: "Classic Paper", emoji: "📜" },
    { id: "pink", name: "Pink Dream", emoji: "🌸" },
    { id: "night", name: "Secret Night", emoji: "🌙" },
    { id: "nature", name: "Nature Calm", emoji: "🍃" },
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleTemplateSelect = (templateId) => {
    setForm({ ...form, template: templateId });
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

  return (
    <div className="modal">
      <div className={`diary-editor diary-template-${form.template}`}>


        <div className="diary-top">
          <div className="date-display">
            <span>{day}</span>
            <strong>{date}</strong>
            <small>{time}</small>
          </div>

          <p className="diary-label">My Secret Diary</p>
          <h2>Write Today&apos;s Memory</h2>
        </div>

        <div className="template-selector">
          {templates.map((t) => (
            <button
              key={t.id}
              type="button"
              className={form.template === t.id ? "template active" : "template"}
              onClick={() => handleTemplateSelect(t.id)}
            >
              <span>{t.emoji}</span>
              {t.name}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <input
            className="diary-title-input"
            name="title"
            placeholder="Give this page a title..."
            value={form.title}
            onChange={handleChange}
          />

          <div className="diary-small-row">
            <select name="mood" value={form.mood} onChange={handleChange}>
              <option value="">Select Mood</option>
              <option value="Happy">😊 Happy</option>
              <option value="Sad">😢 Sad</option>
              <option value="Calm">😌 Calm</option>
              <option value="Angry">😡 Angry</option>
              <option value="Excited">🤩 Excited</option>
              <option value="Tired">😴 Tired</option>
              <option value="Loved">😍 Loved</option>
              <option value="Stressed">😰 Stressed</option>
            </select>

            <input
              name="tags"
              placeholder="Tags: college, memory..."
              value={form.tags}
              onChange={handleChange}
            />
          </div>

          <textarea
            className="diary-content-input"
            name="content"
            placeholder="Dear Diary..."
            value={form.content}
            onChange={handleChange}
          />

          <div className="diary-lock-area">
            <label>
              <input
                type="checkbox"
                name="is_locked"
                checked={form.is_locked}
                onChange={handleChange}
              />
              Lock this page with password 🔐
            </label>

            {form.is_locked && (
              <input
                type="password"
                name="entry_password"
                placeholder="Set diary page password"
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