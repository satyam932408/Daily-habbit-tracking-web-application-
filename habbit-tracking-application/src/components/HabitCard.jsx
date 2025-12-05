import './HabitCard.css'

function HabitCard({ habit, deleteHabit, toggleHabit, selectedDate }) {
  const isCompleted = habit.completions[selectedDate] || false
  const completionRate = habit.totalCompletions > 0 
    ? Math.round((habit.totalCompletions / getDaysSinceCreation(habit.createdAt)) * 100)
    : 0

  function getDaysSinceCreation(createdAt) {
    const created = new Date(createdAt)
    const now = new Date()
    const diffTime = now - created
    return Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)))
  }

  return (
    <div className="habit-card" style={{ borderLeftColor: habit.color }}>
      <div className="habit-card-header">
        <div className="habit-info">
          <span className="habit-icon" style={{ color: habit.color }}>
            {habit.icon}
          </span>
          <h3 className="habit-name">{habit.name}</h3>
        </div>
        <button
          className="delete-btn"
          onClick={() => deleteHabit(habit.id)}
          aria-label="Delete habit"
        >
          ×
        </button>
      </div>

      <div className="habit-stats">
        <div className="stat-item">
          <span className="stat-label">Streak</span>
          <span className="stat-value fire">🔥 {habit.streak}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Best</span>
          <span className="stat-value">⭐ {habit.longestStreak}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Rate</span>
          <span className="stat-value">{completionRate}%</span>
        </div>
      </div>

      <div className="habit-progress">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${completionRate}%`,
              backgroundColor: habit.color
            }}
          />
        </div>
      </div>

      <button
        className={`complete-btn ${isCompleted ? 'completed' : ''}`}
        style={{
          backgroundColor: isCompleted ? habit.color : 'transparent',
          borderColor: habit.color,
          color: isCompleted ? 'white' : habit.color
        }}
        onClick={() => toggleHabit(habit.id, selectedDate)}
      >
        {isCompleted ? '✓ Completed' : 'Mark Complete'}
      </button>
    </div>
  )
}

export default HabitCard

