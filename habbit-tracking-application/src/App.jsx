import { useState, useEffect } from "react";
import "./App.css";
import HabitTracker from "./components/HabitTracker";
import CalendarView from "./components/CalendarView";

function App() {
  const [habits, setHabits] = useState([]);
  const [activeView, setActiveView] = useState("habits"); // 'habits', 'calendar'
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // Load habits from localStorage on mount
  useEffect(() => {
    const savedHabits = localStorage.getItem("habits");
    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    }
  }, []);

  // Save habits to localStorage whenever habits change
  useEffect(() => {
    localStorage.setItem("habits", JSON.stringify(habits));
  }, [habits]);

  const addHabit = (habit) => {
    const newHabit = {
      id: Date.now().toString(),
      name: habit.name,
      color: habit.color || "#6366f1",
      icon: habit.icon || "✓",
      goal: habit.goal || 31, // Default goal of 31 days
      createdAt: new Date().toISOString(),
      completions: {},
      streak: 0,
      longestStreak: 0,
      totalCompletions: 0,
    };
    setHabits([...habits, newHabit]);
  };

  const updateHabitGoal = (id, goal) => {
    setHabits(
      habits.map((habit) =>
        habit.id === id ? { ...habit, goal: parseInt(goal) || 0 } : habit
      )
    );
  };

  const deleteHabit = (id) => {
    setHabits(habits.filter((habit) => habit.id !== id));
  };

  const toggleHabit = (habitId, date) => {
    setHabits(
      habits.map((habit) => {
        if (habit.id === habitId) {
          const completions = { ...habit.completions };
          const dateKey = date || selectedDate;

          if (completions[dateKey]) {
            delete completions[dateKey];
          } else {
            completions[dateKey] = true;
          }

          // Calculate streak
          const sortedDates = Object.keys(completions).sort().reverse();
          let streak = 0;
          let currentDate = new Date();
          currentDate.setHours(0, 0, 0, 0);

          for (let i = 0; i < sortedDates.length; i++) {
            const checkDate = new Date(sortedDates[i]);
            checkDate.setHours(0, 0, 0, 0);
            const diffTime = currentDate - checkDate;
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === i) {
              streak++;
            } else {
              break;
            }
          }

          // Calculate longest streak
          let longestStreak = 0;
          let currentStreak = 0;
          const allDates = Object.keys(completions).sort();

          for (let i = 0; i < allDates.length; i++) {
            if (i === 0) {
              currentStreak = 1;
            } else {
              const prevDate = new Date(allDates[i - 1]);
              const currDate = new Date(allDates[i]);
              const diffDays = Math.floor(
                (currDate - prevDate) / (1000 * 60 * 60 * 24)
              );

              if (diffDays === 1) {
                currentStreak++;
              } else {
                longestStreak = Math.max(longestStreak, currentStreak);
                currentStreak = 1;
              }
            }
          }
          longestStreak = Math.max(longestStreak, currentStreak);

          return {
            ...habit,
            completions,
            streak,
            longestStreak,
            totalCompletions: Object.keys(completions).length,
          };
        }
        return habit;
      })
    );
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="motivational-quote">Build Discipline, Not Excuses</h1>
      </header>

      <nav className="nav-tabs">
        <button
          className={activeView === "habits" ? "active" : ""}
          onClick={() => setActiveView("habits")}
        >
          📝 Habits
        </button>
        <button
          className={activeView === "calendar" ? "active" : ""}
          onClick={() => setActiveView("calendar")}
        >
          📅 Calendar
        </button>
      </nav>

      <main className="main-content">
        {activeView === "habits" && (
          <HabitTracker
            habits={habits}
            addHabit={addHabit}
            deleteHabit={deleteHabit}
            toggleHabit={toggleHabit}
            updateHabitGoal={updateHabitGoal}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
        )}
        {activeView === "calendar" && (
          <CalendarView
            habits={habits}
            toggleHabit={toggleHabit}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
        )}
      </main>
    </div>
  );
}

export default App;
