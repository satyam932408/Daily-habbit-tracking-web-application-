import { useState } from 'react'
import HabitCard from './HabitCard'
import './HabitList.css'

const COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#f59e0b',
  '#10b981', '#3b82f6', '#ef4444', '#14b8a6'
]

const ICONS = ['✓', '💪', '📚', '🏃', '🧘', '💧', '🍎', '📱', '🎯', '⭐']

function HabitList({ habits, addHabit, deleteHabit, toggleHabit, selectedDate, setSelectedDate }) {
  const [isAdding, setIsAdding] = useState(false)
  const [newHabitName, setNewHabitName] = useState('')
  const [selectedColor, setSelectedColor] = useState(COLORS[0])
  const [selectedIcon, setSelectedIcon] = useState(ICONS[0])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (newHabitName.trim()) {
      addHabit({
        name: newHabitName.trim(),
        color: selectedColor,
        icon: selectedIcon
      })
      setNewHabitName('')
      setIsAdding(false)
    }
  }

  return (
    <div className="habit-list-container">
      <div className="date-selector">
        <label htmlFor="date-picker">Select Date: </label>
        <input
          id="date-picker"
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="date-input"
        />
      </div>

      {!isAdding ? (
        <button className="add-habit-btn" onClick={() => setIsAdding(true)}>
          + Add New Habit
        </button>
      ) : (
        <form className="add-habit-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter habit name..."
            value={newHabitName}
            onChange={(e) => setNewHabitName(e.target.value)}
            className="habit-name-input"
            autoFocus
          />
          
          <div className="habit-options">
            <div className="icon-selector">
              <label>Icon:</label>
              <div className="icon-grid">
                {ICONS.map(icon => (
                  <button
                    key={icon}
                    type="button"
                    className={`icon-btn ${selectedIcon === icon ? 'selected' : ''}`}
                    onClick={() => setSelectedIcon(icon)}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            <div className="color-selector">
              <label>Color:</label>
              <div className="color-grid">
                {COLORS.map(color => (
                  <button
                    key={color}
                    type="button"
                    className={`color-btn ${selectedColor === color ? 'selected' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedColor(color)}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn">Add Habit</button>
            <button type="button" className="cancel-btn" onClick={() => setIsAdding(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="habits-grid">
        {habits.length === 0 ? (
          <div className="empty-state">
            <p>No habits yet. Add your first habit to get started! 🚀</p>
          </div>
        ) : (
          habits.map(habit => (
            <HabitCard
              key={habit.id}
              habit={habit}
              deleteHabit={deleteHabit}
              toggleHabit={toggleHabit}
              selectedDate={selectedDate}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default HabitList

