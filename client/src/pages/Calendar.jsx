import React, { useEffect, useState } from "react";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Calendar() {
  const [diaries, setDiaries] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
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

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const getDateKey = (day) => {
    const m = String(month + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    return `${year}-${m}-${d}`;
  };

  const getDiariesForDay = (day) => {
    const key = getDateKey(day);

    return diaries.filter((diary) => {
      const diaryDate = new Date(diary.created_at).toISOString().slice(0, 10);
      return diaryDate === key;
    });
  };

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const calendarCells = [];

  for (let i = 0; i < firstDay; i++) {
    calendarCells.push(null);
  }

  for (let day = 1; day <= totalDays; day++) {
    calendarCells.push(day);
  }

  return (
    <div className="page-container calendar-theme">
      <div className="calendar-header">
        <button onClick={() => navigate("/dashboard")}>← Dashboard</button>
        <h1>📅 Diary Calendar</h1>
      </div>

      <div className="real-calendar">
        <div className="calendar-top">
          <button onClick={prevMonth}>←</button>
          <h2>{monthName}</h2>
          <button onClick={nextMonth}>→</button>
        </div>

        <div className="calendar-weekdays">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        <div className="calendar-days">
          {calendarCells.map((day, index) => {
            const today = new Date();

            const isToday =
              day &&
              today.getDate() === day &&
              today.getMonth() === month &&
              today.getFullYear() === year;

            const dayDiaries = day ? getDiariesForDay(day) : [];

            return (
              <div
                className={`calendar-day ${isToday ? "today" : ""}`}
                key={index}
              >
                {day && (
                  <>
                    <strong>{day}</strong>

                    {dayDiaries.map((d) => (
                      <button
                        key={d.id}
                        className="calendar-entry"
                        onClick={() => navigate(`/diary/${d.id}`)}
                      >
                        {d.is_locked ? "🔒" : "📔"} {d.title}
                      </button>
                    ))}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}