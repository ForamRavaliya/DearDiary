import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const moodData = [
  {
    mood: "Happy",
    emoji: "😊",
    color: "#f0d79a",
    meaning: "You feel light, positive, and satisfied.",
    prompt: "What made you smile today?",
    tip: "Save this moment in detail so you can revisit it later.",
  },
  {
    mood: "Sad",
    emoji: "😢",
    color: "#9fb4c7",
    meaning: "You may feel low, hurt, or emotionally heavy.",
    prompt: "What do you wish someone understood about your day?",
    tip: "Write slowly. You do not need to fix everything today.",
  },
  {
    mood: "Calm",
    emoji: "😌",
    color: "#a9b77a",
    meaning: "Your mind feels peaceful and steady.",
    prompt: "What helped you feel calm today?",
    tip: "Protect this peaceful habit and repeat it tomorrow.",
  },
  {
    mood: "Angry",
    emoji: "😡",
    color: "#c96b5a",
    meaning: "Something may feel unfair, irritating, or unresolved.",
    prompt: "What boundary do you need to express?",
    tip: "Write first. React later.",
  },
  {
    mood: "Joy",
    emoji: "🥳",
    color: "#d6b97f",
    meaning: "You feel excited, playful, and full of energy.",
    prompt: "What moment felt worth celebrating?",
    tip: "Celebrate small wins. They become beautiful memories.",
  },
  {
    mood: "Amazing",
    emoji: "🤩",
    color: "#c6a96b",
    meaning: "You feel impressed, inspired, or proud.",
    prompt: "What made today feel special?",
    tip: "Write the exact details before they fade.",
  },
  {
    mood: "Loved",
    emoji: "😍",
    color: "#d98aa9",
    meaning: "You feel cared for, connected, or emotionally warm.",
    prompt: "Who made you feel loved today?",
    tip: "Send gratitude or save the memory here.",
  },
  {
    mood: "Tired",
    emoji: "😴",
    color: "#b8a99a",
    meaning: "Your body or mind may need rest.",
    prompt: "What drained your energy today?",
    tip: "Rest is productive too.",
  },
  {
    mood: "Stressed",
    emoji: "😰",
    color: "#8e5a6b",
    meaning: "You may feel overloaded, pressured, or tense.",
    prompt: "What is one thing that feels heavy right now?",
    tip: "List only the next small step. Not the whole problem.",
  },
  {
    mood: "Neutral",
    emoji: "😐",
    color: "#c9c0b5",
    meaning: "You may feel balanced, plain, or emotionally quiet.",
    prompt: "What happened today, even if it felt ordinary?",
    tip: "Ordinary days also become memories.",
  },
  {
    mood: "Not Feeling Anything",
    emoji: "🫥",
    color: "#7a6a63",
    meaning: "You may feel emotionally blank or disconnected.",
    prompt: "If your mind had a weather today, what would it be?",
    tip: "Write without pressure. Even one sentence is enough.",
  },
];

export default function MoodExplore() {
  const [selectedMood, setSelectedMood] = useState(null);
  const navigate = useNavigate();

  return (
    <div className="page-container mood-explore-theme">
      <div className="page-header">
        <button onClick={() => navigate("/dashboard")}>← Dashboard</button>
        <h1>💭 Mood Explore</h1>
      </div>

      <div className="mood-explore-hero">
        <h2>Understand your feelings before writing.</h2>
        <p>
          Choose a mood and get a small explanation, diary prompt, and self-care
          idea.
        </p>
      </div>

      <div className="mood-explore-grid">
        {moodData.map((item) => (
          <button
            key={item.mood}
            className="mood-explore-card"
            style={{ "--mood-color": item.color }}
            onClick={() => setSelectedMood(item)}
          >
            <span>{item.emoji}</span>
            <strong>{item.mood}</strong>
          </button>
        ))}
      </div>

      {selectedMood && (
        <div className="mood-popup-overlay">
          <div className="mood-popup">
            <button
              type="button"
              className="mood-popup-close"
              onClick={() => setSelectedMood(null)}
            >
              ✕
            </button>

            <div
              className="mood-popup-doodle"
              style={{ background: selectedMood.color }}
            >
              {selectedMood.emoji}
            </div>

            <h2>{selectedMood.mood}</h2>

            <div className="mood-popup-section">
              <h3>What it means</h3>
              <p>{selectedMood.meaning}</p>
            </div>

            <div className="mood-popup-section">
              <h3>Diary prompt</h3>
              <p>{selectedMood.prompt}</p>
            </div>

            <div className="mood-popup-section">
              <h3>Small tip</h3>
              <p>{selectedMood.tip}</p>
            </div>
            <button
              className="mood-write-btn"
              onClick={() => navigate(`/dashboard?mood=${selectedMood.mood}`)}
            >
              ✍️ Write with this mood
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
