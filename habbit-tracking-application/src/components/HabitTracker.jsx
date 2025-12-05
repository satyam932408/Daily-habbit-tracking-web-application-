import { useState, useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import "./HabitTracker.css";

const COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
  "#f59e0b",
  "#10b981",
  "#3b82f6",
  "#ef4444",
  "#14b8a6",
];

const ICONS = ["✓", "💪", "📚", "🏃", "🧘", "💧", "🍎", "📱", "🎯", "⭐"];

function HabitTracker({
  habits,
  addHabit,
  deleteHabit,
  toggleHabit,
  updateHabitGoal,
  selectedDate,
  setSelectedDate,
}) {
  const [isAdding, setIsAdding] = useState(false);
  const [newHabitName, setNewHabitName] = useState("");
  const [newHabitGoal, setNewHabitGoal] = useState(31);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [selectedIcon, setSelectedIcon] = useState(ICONS[0]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Get current week dates
  const getWeekDates = () => {
    const today = new Date(selectedDate);
    const dayOfWeek = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek);

    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      weekDates.push(date.toISOString().split("T")[0]);
    }
    return weekDates;
  };

  const weekDates = getWeekDates();
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Calculate daily progress
  const dailyProgress = useMemo(() => {
    const today = selectedDate;
    const completed = habits.filter((h) => h.completions[today]).length;
    const total = habits.length;
    const percentage = total > 0 ? (completed / total) * 100 : 0;
    return { completed, total, percentage };
  }, [habits, selectedDate]);

  // Get top habits by completion rate
  const topHabits = useMemo(() => {
    return habits
      .map((habit) => {
        const daysSinceCreation = Math.max(
          1,
          Math.ceil(
            (new Date() - new Date(habit.createdAt)) / (1000 * 60 * 60 * 24)
          )
        );
        const completionRate =
          (habit.totalCompletions / daysSinceCreation) * 100;
        return {
          ...habit,
          completionRate: Math.min(100, Math.round(completionRate)),
        };
      })
      .sort((a, b) => b.completionRate - a.completionRate)
      .slice(0, 10);
  }, [habits]);

  // Weekly progress data
  const weeklyProgress = useMemo(() => {
    return weekDates.map((date) => {
      const completed = habits.filter((h) => h.completions[date]).length;
      return {
        date,
        completed,
        total: habits.length,
        percentage: habits.length > 0 ? (completed / habits.length) * 100 : 0,
      };
    });
  }, [habits, weekDates]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newHabitName.trim()) {
      addHabit({
        name: newHabitName.trim(),
        color: selectedColor,
        icon: selectedIcon,
        goal: newHabitGoal,
      });
      setNewHabitName("");
      setNewHabitGoal(31);
      setIsAdding(false);
    }
  };

  const pieData = [
    { name: "Completed", value: dailyProgress.percentage },
    { name: "Left", value: 100 - dailyProgress.percentage },
  ];

  const COLORS_PIE = ["#10b981", "#fbbf24"];

  return (
    <div className="habit-tracker-container">
      <div className="tracker-grid">
        {/* Left Side - Habit List and Weekly Grid */}
        <div className="left-section">
          {/* Calendar Settings */}
          <div className="section-box calendar-settings">
            <h3>CALENDAR SETTINGS</h3>
            <div className="settings-row">
              <div>
                <label>Date:</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="date-picker-input"
                />
              </div>
            </div>
          </div>

          {/* Habit Tracker Table */}
          <div className="section-box habit-table-section">
            <div className="table-header">
              <div className="header-cell habits-header">DAILY HABITS</div>
              <div className="header-cell goals-header">GOALS</div>
              <div className="header-cell week-header">
                <div className="week-header-title">WEEK 1</div>
                <div className="week-header-days">
                  {weekDates.map((date, idx) => (
                    <div key={date} className="day-header-cell">
                      <div className="day-label">{weekDays[idx]}</div>
                      <div className="day-date">{new Date(date).getDate()}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="table-content">
              {habits.length === 0 ? (
                <div className="empty-habits">
                  <p>No habits yet. Add your first habit!</p>
                </div>
              ) : (
                habits.map((habit, index) => (
                  <div key={habit.id} className="table-row">
                    <div className="cell habit-cell">
                      <span className="habit-number">{index + 1}</span>
                      <span className="habit-icon">{habit.icon}</span>
                      <span className="habit-name">{habit.name}</span>
                      <button
                        className="delete-habit-btn"
                        onClick={() => deleteHabit(habit.id)}
                        title="Delete habit"
                      >
                        ×
                      </button>
                    </div>
                    <div className="cell goal-cell">
                      <input
                        type="number"
                        value={habit.goal || 31}
                        onChange={(e) =>
                          updateHabitGoal(habit.id, e.target.value)
                        }
                        className="goal-input"
                        min="1"
                      />
                    </div>
                    <div className="cell week-cell">
                      {weekDates.map((date, idx) => {
                        const isCompleted = habit.completions[date];
                        return (
                          <div
                            key={date}
                            className={`checkbox-cell ${isCompleted ? "checked" : ""}`}
                            onClick={() => toggleHabit(habit.id, date)}
                            title={`${weekDays[idx]} ${date}`}
                          >
                            {isCompleted ? "✓" : ""}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>

            {!isAdding ? (
              <button
                className="add-habit-table-btn"
                onClick={() => setIsAdding(true)}
              >
                + Add New Habit
              </button>
            ) : (
              <form className="add-habit-form-table" onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Habit name..."
                  value={newHabitName}
                  onChange={(e) => setNewHabitName(e.target.value)}
                  className="habit-name-input-table"
                  autoFocus
                />
                <input
                  type="number"
                  placeholder="Goal (days)"
                  value={newHabitGoal}
                  onChange={(e) => setNewHabitGoal(parseInt(e.target.value) || 31)}
                  className="goal-input-table"
                  min="1"
                />
                <div className="quick-options">
                  <div className="icon-selector-small">
                    {ICONS.slice(0, 5).map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        className={`icon-btn-small ${selectedIcon === icon ? "selected" : ""}`}
                        onClick={() => setSelectedIcon(icon)}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                  <div className="color-selector-small">
                    {COLORS.slice(0, 4).map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={`color-btn-small ${selectedColor === color ? "selected" : ""}`}
                        style={{ backgroundColor: color }}
                        onClick={() => setSelectedColor(color)}
                      />
                    ))}
                  </div>
                </div>
                <div className="form-actions-table">
                  <button type="submit" className="submit-btn-table">
                    Add
                  </button>
                  <button
                    type="button"
                    className="cancel-btn-table"
                    onClick={() => setIsAdding(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Right Side - Overview and Charts */}
        <div className="right-section">
          {/* Overview Daily Progress */}
          <div className="section-box overview-section">
            <h3>OVERVIEW DAILY PROGRESS</h3>
            <div className="donut-chart-container">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS_PIE[index % COLORS_PIE.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="donut-chart-labels">
                <div className="label-item">
                  <span
                    className="label-color"
                    style={{ backgroundColor: COLORS_PIE[0] }}
                  />
                  <span>COMPLETED {dailyProgress.percentage.toFixed(1)}%</span>
                </div>
                <div className="label-item">
                  <span
                    className="label-color"
                    style={{ backgroundColor: COLORS_PIE[1] }}
                  />
                  <span>
                    LEFT {(100 - dailyProgress.percentage).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Top 10 Daily Habits */}
          <div className="section-box top-habits-section">
            <h3>TOP 10 DAILY HABITS</h3>
            <div className="top-habits-list">
              {topHabits.length === 0 ? (
                <p className="no-habits-text">No habits to display</p>
              ) : (
                topHabits.map((habit, index) => (
                  <div key={habit.id} className="top-habit-item">
                    <span className="top-habit-rank">{index + 1}.</span>
                    <span className="top-habit-name">{habit.name}</span>
                    <div className="top-habit-progress-bar">
                      <div
                        className="top-habit-progress-fill"
                        style={{
                          width: `${habit.completionRate}%`,
                          backgroundColor: habit.color,
                        }}
                      />
                    </div>
                    <span className="top-habit-percentage">
                      {habit.completionRate}%
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Weekly Progress */}
          <div className="section-box weekly-progress-section">
            <h3>WEEKLY PROGRESS</h3>
            <div className="weekly-bars">
              {weeklyProgress.map((day, index) => (
                <div key={day.date} className="weekly-bar-item">
                  <div className="weekly-bar-header">
                    <span className="weekly-day">{weekDays[index]}</span>
                    <span className="weekly-date">
                      {new Date(day.date).getDate()}
                    </span>
                  </div>
                  <div className="weekly-bar-container">
                    <div
                      className="weekly-bar-fill"
                      style={{
                        width: `${day.percentage}%`,
                        backgroundColor: "#6366f1",
                      }}
                    />
                  </div>
                  <div className="weekly-bar-stats">
                    <span>{day.completed}/{day.total}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HabitTracker;

