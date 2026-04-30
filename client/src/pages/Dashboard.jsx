import React, { useEffect, useState } from "react";
import API from "../api/api";
import DiaryForm from "../components/DiaryForm";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [diaries, setDiaries] = useState([]);
  const [stats, setStats] = useState({
    totalDiaries: 0,
    lockedDiaries: 0,
    favoriteDiaries: 0,
    trashDiaries: 0,
  });
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [filterMood, setFilterMood] = useState("");

  const navigate = useNavigate();

  const fetchDiaries = async () => {
    try {
      const res = await API.get("/diaries");
      setDiaries(res.data.diaries);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await API.get("/diaries/stats");
      setStats(res.data.stats);
    } catch (err) {
      console.error(err);
    }
  };

  const refreshAll = () => {
    fetchDiaries();
    fetchStats();
  };

  const logout = () => {
    localStorage.removeItem("diaryToken");
    localStorage.removeItem("diaryUser");
    navigate("/");
  };

  const toggleFavorite = async (id, e) => {
    e.stopPropagation();

    try {
      await API.patch(`/diaries/${id}/favorite`);
      refreshAll();
    } catch (err) {
      alert(err.response?.data?.message || "Favorite update failed");
    }
  };

  const deleteDiary = async (id, e) => {
    e.stopPropagation();

    const confirmDelete = window.confirm("Move this diary to trash?");
    if (!confirmDelete) return;

    try {
      await API.delete(`/diaries/${id}`);
      refreshAll();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  const formatDate = (dateValue) => {
    const date = new Date(dateValue);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDay = (dateValue) => {
    const date = new Date(dateValue);
    return date.toLocaleDateString("en-IN", {
      weekday: "long",
    });
  };
const searchDiaries = async () => {
  try {
    let query = `/diaries/search?`;

    if (search) query += `keyword=${search}&`;
    if (filterMood) query += `mood=${filterMood}&`;

    const res = await API.get(query);
    setDiaries(res.data.diaries);
  } catch (err) {
    alert(err.response?.data?.message || "Search failed");
  }
};
const user = JSON.parse(localStorage.getItem("diaryUser"));

  useEffect(() => {
    if (search || filterMood) {
      searchDiaries();
    } else {
      refreshAll();
    }
  }, [search, filterMood]);

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">📔</div>
          <div>
            <h2>Dear Diary</h2>
            <h2>Hello, {user?.username || "User"}</h2>
            <p>Your private diary pages</p>
          </div>
        </div>

        <nav className="side-menu">
          <button className="active">🏠 Dashboard</button>
          <button onClick={() => navigate("/calendar")}>📅 Calendar</button>
          <button onClick={() => navigate("/moods")}>📊 Mood Analytics</button>
          <button onClick={() => navigate("/pages")}>📄 Diary Pages</button>
         <button onClick={() => navigate("/favorites")}>⭐ Favorites</button>
          <button onClick={() => navigate("/locked")}>🔐 Locked Pages</button>
          <button onClick={() => navigate("/trash")}>🗑 Trash</button>

        </nav>

        <div className="side-counts">
          <div>
            <span>Total Pages</span>
            <strong>{stats.totalDiaries}</strong>
          </div>
          <div>
            <span>Locked</span>
            <strong>{stats.lockedDiaries}</strong>
          </div>
        </div>

        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </aside>

      <main className="dashboard-main">
        <section className="hero-card">
          <div>
            <p className="small-title">Welcome back ✨</p>
            <h1>Start writing your beautiful memories.</h1>
            <p>
              Your diary is private, password-protected, and designed like real
              journal pages.
            </p>

            <button onClick={() => setShowForm(true)}>✍️ Start Now</button>
          </div>

          <div className="hero-doodle">📖</div>
        </section>

        <section className="stats-grid">
          <div className="stat-card">
            <span>📄</span>
            <h3>{stats.totalDiaries}</h3>
            <p>Total Pages</p>
          </div>

          <div className="stat-card">
            <span>🔐</span>
            <h3>{stats.lockedDiaries}</h3>
            <p>Locked Pages</p>
          </div>

          <div className="stat-card">
            <span>⭐</span>
            <h3>{stats.favoriteDiaries}</h3>
            <p>Favorites</p>
          </div>

          <div className="stat-card">
            <span>🗑</span>
            <h3>{stats.trashDiaries}</h3>
            <p>Trash</p>
          </div>
        </section>

        <div className="section-header">
          <h2>My Diary Pages</h2>
          <button onClick={() => setShowForm(true)}>+ New Page</button>
        </div>

        {showForm && (
          <DiaryForm onClose={() => setShowForm(false)} refresh={refreshAll} />
        )}
<div className="search-filter-box">
  <input
    type="text"
    placeholder="Search title, content or tags..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />

  <select
    value={filterMood}
    onChange={(e) => setFilterMood(e.target.value)}
  >
    <option value="">All Moods</option>
    <option value="Happy">Happy</option>
    <option value="Sad">Sad</option>
    <option value="Calm">Calm</option>
    <option value="Angry">Angry</option>
    <option value="Excited">Excited</option>
  </select>

  <button
    onClick={() => {
      setSearch("");
      setFilterMood("");
      refreshAll();
    }}
  >
    Clear
  </button>
</div>
        {diaries.length === 0 ? (
          <div className="empty-diary">
            <h2>🌸 You haven’t started your diary yet</h2>
            <p>Write your first page and save today’s memory forever.</p>
            <button onClick={() => setShowForm(true)}>
              Start Your First Page
            </button>
          </div>
        ) : (
          <section className="diary-page-grid">
            {diaries.map((d) => (
              <div
                className="diary-page-card"
                key={d.id}
                onClick={() => navigate(`/diary/${d.id}`)}
              >
                <div className="page-date">
                  <span>{formatDay(d.created_at)}</span>
                  <strong>{formatDate(d.created_at)}</strong>
                </div>

                <div className="page-paper">
                  <h3>{d.title}</h3>

                  <p className="page-mood">Mood: {d.mood || "Not added"}</p>

                  <div className="page-lines">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>

                  <div className="page-footer">
                    {d.is_locked ? <span>🔒 Locked</span> : <span>🔓 Open</span>}

                    <div className="card-actions">
                      <button onClick={(e) => toggleFavorite(d.id, e)}>
                        {d.is_favorite ? "⭐" : "☆"}
                      </button>

                      <button onClick={(e) => deleteDiary(d.id, e)}>🗑</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}