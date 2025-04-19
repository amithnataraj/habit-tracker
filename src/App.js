import React, { useState } from "react";

// Theme color palettes
const themes = {
  dark: {
    background: "linear-gradient(120deg, #232526 0%, #1c1c1e 100%)",
    card: "#181c20",
    cardBorder: "2px solid #0a84ff",
    cardShadow: "0 4px 24px #0a84ff22, 0 1.5px 4px #0008 inset",
    text: "#f5f5f7",
    textSecondary: "#a1a1aa",
    streak: "#ffb300",
    button: {
      primary: {
        background: "linear-gradient(90deg, #0a84ff 60%, #64b5f6 100%)",
        color: "#fff",
        border: "none",
      },
      edit: {
        background: "#444",
        color: "#fff",
        border: "none",
      },
      delete: {
        background: "#222",
        color: "#bbb",
        border: "none",
      },
      calendar: {
        background: "#181c20",
        color: "#fff",
        border: "1.5px solid #0a84ff",
      },
      disabled: {
        background: "#333",
        color: "#bbb",
        border: "none",
      },
    },
    graphDone: "#0a84ff",
    graphMissed: "#333",
    inputBg: "#23272e",
    inputBorder: "1.5px solid #333",
  },
  light: {
    background: "linear-gradient(120deg, #f5f6fa 0%, #e3e6ee 100%)",
    card: "#fff",
    cardBorder: "2px solid #0a84ff",
    cardShadow: "0 4px 24px #0a84ff11, 0 1.5px 4px #0001 inset",
    text: "#222",
    textSecondary: "#555",
    streak: "#ff9500",
    button: {
      primary: {
        background: "linear-gradient(90deg, #0a84ff 60%, #64b5f6 100%)",
        color: "#fff",
        border: "none",
      },
      edit: {
        background: "#bbb",
        color: "#fff",
        border: "none",
      },
      delete: {
        background: "#f5f6fa",
        color: "#bbb",
        border: "none",
      },
      calendar: {
        background: "#f5f6fa",
        color: "#222",
        border: "1.5px solid #0a84ff",
      },
      disabled: {
        background: "#eee",
        color: "#bbb",
        border: "none",
      },
    },
    graphDone: "#0a84ff",
    graphMissed: "#e0e0e0",
    inputBg: "#f5f6fa",
    inputBorder: "1.5px solid #bbb",
  },
};

function ShuffleToggle({ checked, onChange }) {
  // iPod Shuffle-inspired toggle
  return (
    <div
      onClick={() => onChange(!checked)}
      style={{
        width: 54,
        height: 28,
        borderRadius: 18,
        background: checked
          ? "linear-gradient(90deg, #0a84ff 60%, #64b5f6 100%)"
          : "linear-gradient(90deg, #bbb 60%, #eee 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: checked ? "flex-end" : "flex-start",
        padding: 3,
        cursor: "pointer",
        boxShadow: checked
          ? "0 2px 8px #0a84ff44"
          : "0 2px 8px #bbb4",
        position: "relative",
        transition: "background 0.3s, box-shadow 0.3s",
        border: checked ? "2px solid #0a84ff" : "2px solid #bbb",
      }}
      title={checked ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      <div
        style={{
          width: 22,
          height: 22,
          borderRadius: "50%",
          background: "#fff",
          boxShadow: checked
            ? "0 0 0 2px #0a84ff"
            : "0 0 0 2px #bbb",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 16,
          color: checked ? "#0a84ff" : "#bbb",
          transition: "box-shadow 0.3s, color 0.3s",
        }}
      >
        {checked ? "🌙" : "☀️"}
      </div>
    </div>
  );
}

// Mini calendar graph for last 7 days with day labels
function MiniCalendarGraph({ datesDone, theme }) {
  // Get last 7 days and their labels
  const days = [];
  const dayLabels = [];
  const dayNames = ["S", "M", "T", "W", "T", "F", "S"];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    days.push(d.toDateString());
    dayLabels.push(dayNames[d.getDay()]);
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginLeft: 12 }}>
      <div style={{ display: "flex", gap: 3 }}>
        {days.map((day, idx) => (
          <div
            key={idx}
            title={day}
            style={{
              width: 16,
              height: 16,
              borderRadius: 4,
              background: datesDone.includes(day)
                ? themes[theme].graphDone
                : themes[theme].graphMissed,
              border: "1px solid #ccc",
              opacity: datesDone.includes(day) ? 1 : 0.5,
              transition: "background 0.3s",
            }}
          />
        ))}
      </div>
      <div style={{ display: "flex", gap: 3, marginTop: 2 }}>
        {dayLabels.map((label, idx) => (
          <span
            key={idx}
            style={{
              fontSize: 11,
              color: themes[theme].textSecondary,
              width: 16,
              textAlign: "center",
              fontFamily: "Inter, sans-serif",
              userSelect: "none",
            }}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

function App() {
  const [theme, setTheme] = useState("light");
  const t = themes[theme];

  // Each habit: { name, streak, lastDone, datesDone: [dateString, ...] }
  const [habits, setHabits] = useState([
    { name: "Drink Water", streak: 0, lastDone: null, datesDone: [] },
  ]);
  const [newHabit, setNewHabit] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editValue, setEditValue] = useState("");

  // Add new habit
  const addHabit = () => {
    if (newHabit.trim() === "") return;
    setHabits([
      ...habits,
      { name: newHabit, streak: 0, lastDone: null, datesDone: [] },
    ]);
    setNewHabit("");
  };

  // Mark habit as done for today
  const markDone = (idx) => {
    const today = new Date().toDateString();
    setHabits((prev) =>
      prev.map((h, i) => {
        if (i !== idx) return h;
        if (h.lastDone === today) return h;
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        const newStreak = h.lastDone === yesterday ? h.streak + 1 : 1;
        const newDatesDone = [...h.datesDone, today];
        return {
          ...h,
          streak: newStreak,
          lastDone: today,
          datesDone: newDatesDone,
        };
      })
    );
  };

  // Edit habit
  const startEdit = (idx) => {
    setEditingIndex(idx);
    setEditValue(habits[idx].name);
  };
  const saveEdit = (idx) => {
    setHabits((prev) =>
      prev.map((h, i) => (i === idx ? { ...h, name: editValue } : h))
    );
    setEditingIndex(null);
    setEditValue("");
  };

  // Delete habit
  const deleteHabit = (idx) => {
    setHabits((prev) => prev.filter((_, i) => i !== idx));
  };

  // Google Calendar link (opens event creation page)
  const googleCalendarLink = (habit) => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const start = `${yyyy}${mm}${dd}T080000`;
    const end = `${yyyy}${mm}${dd}T083000`;
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      habit.name
    )}&dates=${start}/${end}&details=Habit+reminder`;
  };

  // Styles
  const appStyle = {
    minHeight: "100vh",
    background: t.background,
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "40px 10px",
    transition: "background 0.4s",
  };

  const cardStyle = {
    background: t.card,
    borderRadius: "20px",
    boxShadow: t.cardShadow,
    border: t.cardBorder,
    padding: "32px 28px",
    margin: "24px 0",
    minWidth: "340px",
    maxWidth: "95vw",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    transition: "box-shadow 0.2s, background 0.4s, border 0.4s",
  };

  const inputStyle = {
    background: t.inputBg,
    color: t.text,
    border: t.inputBorder,
    borderRadius: "10px",
    padding: "10px",
    margin: "8px 0",
    width: "100%",
    fontSize: "1rem",
    outline: "none",
    transition: "background 0.4s, color 0.4s, border 0.4s",
  };

  const buttonBase = {
    borderRadius: "8px",
    padding: "10px 24px",
    margin: "8px 8px 0 0",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "1rem",
    boxShadow: "0 2px 8px #0001",
    transition: "background 0.2s, color 0.2s",
    outline: "none",
    border: "none",
  };

  // Top right toggle
  const toggleContainerStyle = {
    position: "fixed",
    top: 24,
    right: 32,
    zIndex: 10,
    display: "flex",
    alignItems: "center",
    gap: 12,
  };

  return (
    <div style={appStyle}>
      <div style={toggleContainerStyle}>
        <ShuffleToggle
          checked={theme === "dark"}
          onChange={() => setTheme(theme === "dark" ? "light" : "dark")}
        />
      </div>
      <h1
        style={{
          fontWeight: 700,
          letterSpacing: 1,
          marginBottom: 8,
          fontSize: "2.2rem",
          color: t.text,
        }}
      >
        Habit Tracker
      </h1>
      <div style={{ ...cardStyle, alignItems: "center" }}>
        <input
          style={inputStyle}
          placeholder="Add a new habit…"
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addHabit()}
        />
        <button
          style={{
            ...buttonBase,
            ...t.button.primary,
          }}
          onClick={addHabit}
        >
          Add Habit
        </button>
      </div>
      {habits.map((habit, idx) => (
        <div key={idx} style={cardStyle}>
          <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
            <div style={{ flex: 1 }}>
              {editingIndex === idx ? (
                <>
                  <input
                    style={inputStyle}
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && saveEdit(idx)}
                  />
                  <button
                    style={{
                      ...buttonBase,
                      ...t.button.primary,
                    }}
                    onClick={() => saveEdit(idx)}
                  >
                    Save
                  </button>
                  <button
                    style={{
                      ...buttonBase,
                      ...t.button.edit,
                    }}
                    onClick={() => setEditingIndex(null)}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <h2
                    style={{
                      marginBottom: 4,
                      fontWeight: 600,
                      fontSize: "1.3rem",
                      color: t.text,
                    }}
                  >
                    {habit.name}
                  </h2>
                  <div style={{ marginBottom: 8, color: t.textSecondary }}>
                    <span role="img" aria-label="fire" style={{ color: t.streak }}>
                      🔥
                    </span>{" "}
                    Streak: <b>{habit.streak}</b>
                  </div>
                  <div style={{ fontSize: "0.98em", color: t.textSecondary }}>
                    {habit.lastDone === new Date().toDateString()
                      ? "Done for today!"
                      : "Not done today"}
                  </div>
                  <div style={{ marginTop: 14, display: "flex", alignItems: "center" }}>
                    <button
                      style={{
                        ...buttonBase,
                        ...(habit.lastDone === new Date().toDateString()
                          ? t.button.disabled
                          : t.button.primary),
                      }}
                      onClick={() => markDone(idx)}
                      disabled={habit.lastDone === new Date().toDateString()}
                    >
                      {habit.lastDone === new Date().toDateString()
                        ? "Completed"
                        : "Mark as Done"}
                    </button>
                    <button
                      style={{
                        ...buttonBase,
                        ...t.button.edit,
                        color: t.button.edit.color,
                      }}
                      onClick={() => startEdit(idx)}
                    >
                      Edit
                    </button>
                    <button
                      style={{
                        ...buttonBase,
                        ...t.button.delete,
                        color: t.button.delete.color,
                      }}
                      onClick={() => deleteHabit(idx)}
                    >
                      Delete
                    </button>
                    <a
                      href={googleCalendarLink(habit)}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        ...buttonBase,
                        ...t.button.calendar,
                        textDecoration: "none",
                        marginLeft: 0,
                        fontWeight: 500,
                      }}
                    >
                      Add to Google Calendar
                    </a>
                  </div>
                </>
              )}
            </div>
            {/* Mini calendar graph */}
            <MiniCalendarGraph datesDone={habit.datesDone || []} theme={theme} />
          </div>
        </div>
      ))}
      <div style={{ marginTop: 40, color: t.textSecondary, fontSize: "0.95em" }}>
        <span>
          Minimal Habit Tracker &mdash; Apple-inspired UI.<br />
          <span style={{ fontSize: "0.8em" }}>
            (Data is not saved after refresh)
          </span>
        </span>
      </div>
    </div>
  );
}

export default App;
