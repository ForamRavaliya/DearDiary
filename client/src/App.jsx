import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ViewDiary from "./pages/ViewDiary.jsx";
import Trash from "./pages/Trash.jsx";
import EditDiary from "./pages/EditDiary.jsx";
import Calendar from "./pages/Calendar.jsx";
import Favorites from "./pages/Favorites.jsx";
import LockedPages from "./pages/LockedPages.jsx";
import DiaryPages from "./pages/DiaryPages.jsx";
import MoodAnalytics from "./pages/MoodAnalytics.jsx";
import MoodExplore from "./pages/MoodExplore.jsx";

import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/diary/:id"
          element={
            <ProtectedRoute>
              <ViewDiary />
            </ProtectedRoute>
          }
        />

        <Route
          path="/diary/:id/edit"
          element={
            <ProtectedRoute>
              <EditDiary />
            </ProtectedRoute>
          }
        />

        <Route
          path="/trash"
          element={
            <ProtectedRoute>
              <Trash />
            </ProtectedRoute>
          }
        />

        <Route
          path="/calendar"
          element={
            <ProtectedRoute>
              <Calendar />
            </ProtectedRoute>
          }
        />

        <Route
          path="/favorites"
          element={
            <ProtectedRoute>
              <Favorites />
            </ProtectedRoute>
          }
        />

        <Route
          path="/locked"
          element={
            <ProtectedRoute>
              <LockedPages />
            </ProtectedRoute>
          }
        />

        <Route
          path="/pages"
          element={
            <ProtectedRoute>
              <DiaryPages />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mood-explore"
          element={
            <ProtectedRoute>
              <MoodExplore />
            </ProtectedRoute>
          }
        />

        <Route
          path="/moods"
          element={
            <ProtectedRoute>
              <MoodAnalytics />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;