import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/api";

export default function EditDiary() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    content: "",
    mood: "",
    tags: "",
    is_locked: false,
    entry_password: "",
  });

  const fetchDiary = async () => {
    try {
      const res = await API.post(`/diaries/${id}/unlock`, {
        entry_password: "",
      });

      setForm({
        title: res.data.diary.title || "",
        content: res.data.diary.content || "",
        mood: res.data.diary.mood || "",
        tags: res.data.diary.tags || "",
        is_locked: res.data.diary.is_locked || false,
        entry_password: "",
      });
    } catch {
      try {
        const res = await API.get(`/diaries/${id}`);

        setForm({
          title: res.data.diary.title || "",
          content: res.data.diary.content || "",
          mood: res.data.diary.mood || "",
          tags: res.data.diary.tags || "",
          is_locked: res.data.diary.is_locked || false,
          entry_password: "",
        });
      } catch (err) {
        alert(err.response?.data?.message || "Diary not found");
        navigate("/dashboard");
      }
    }
  };

  useEffect(() => {
    fetchDiary();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await API.put(`/diaries/${id}`, form);
      alert("Diary updated successfully ✅");
      navigate(`/diary/${id}`);
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="edit-page-wrapper">
      <form className="edit-diary-card" onSubmit={handleUpdate}>
        <h1>✏️ Edit Diary Page</h1>

        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
        />

        <div className="edit-row">
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
            placeholder="Tags"
            value={form.tags}
            onChange={handleChange}
          />
        </div>

        <textarea
          name="content"
          placeholder="Diary content"
          value={form.content}
          onChange={handleChange}
        />

        <label className="edit-lock">
          <input
            type="checkbox"
            name="is_locked"
            checked={form.is_locked}
            onChange={handleChange}
          />
          Lock this diary
        </label>

        {form.is_locked && (
          <input
            type="password"
            name="entry_password"
            placeholder="New password optional"
            value={form.entry_password}
            onChange={handleChange}
          />
        )}

        <div className="edit-actions">
          <button type="button" onClick={() => navigate(`/diary/${id}`)}>
            Cancel
          </button>
          <button type="submit">Update Diary</button>
        </div>
      </form>
    </div>
  );
}