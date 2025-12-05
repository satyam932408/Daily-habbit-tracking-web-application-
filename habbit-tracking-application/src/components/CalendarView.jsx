import { useState } from 'react'
import './CalendarView.css'

function CalendarView({ habits, toggleHabit, selectedDate, setSelectedDate }) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      days.push({
        day,
        date: dateStr,
        isToday: dateStr === new Date().toISOString().split('T')[0],
        isSelected: dateStr === selectedDate
      })
    }

    return days
  }

  const getHabitCompletionsForDate = (date) => {
    return habits.filter(habit => habit.completions[date]).length
  }

  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() + direction)
      return newDate
    })
  }

  const days = getDaysInMonth(currentMonth)
  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button className="nav-btn" onClick={() => navigateMonth(-1)}>‹</button>
        <h2>{monthName}</h2>
        <button className="nav-btn" onClick={() => navigateMonth(1)}>›</button>
      </div>

      <div className="calendar-grid">
        <div className="calendar-weekday">Sun</div>
        <div className="calendar-weekday">Mon</div>
        <div className="calendar-weekday">Tue</div>
        <div className="calendar-weekday">Wed</div>
        <div className="calendar-weekday">Thu</div>
        <div className="calendar-weekday">Fri</div>
        <div className="calendar-weekday">Sat</div>

        {days.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="calendar-day empty" />
          }

          const completions = getHabitCompletionsForDate(day.date)
          const completionRate = habits.length > 0 ? (completions / habits.length) * 100 : 0

          return (
            <div
              key={day.date}
              className={`calendar-day ${day.isToday ? 'today' : ''} ${day.isSelected ? 'selected' : ''}`}
              onClick={() => setSelectedDate(day.date)}
            >
              <div className="day-number">{day.day}</div>
              <div className="day-completions">
                {completions > 0 && (
                  <div
                    className="completion-indicator"
                    style={{
                      backgroundColor: `hsl(${(completionRate / 100) * 120}, 70%, 50%)`,
                      opacity: completionRate / 100
                    }}
                  >
                    {completions}/{habits.length}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="calendar-legend">
        <div className="legend-item">
          <div className="legend-color today-indicator" />
          <span>Today</span>
        </div>
        <div className="legend-item">
          <div className="legend-color selected-indicator" />
          <span>Selected</span>
        </div>
        <div className="legend-item">
          <div className="legend-color completion-indicator" />
          <span>Completions</span>
        </div>
      </div>

      {selectedDate && (
        <div className="selected-date-habits">
          <h3>Habits for {new Date(selectedDate).toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</h3>
          <div className="habits-list">
            {habits.length === 0 ? (
              <p>No habits yet. Add some habits to track!</p>
            ) : (
              habits.map(habit => {
                const isCompleted = habit.completions[selectedDate]
                return (
                  <div
                    key={habit.id}
                    className={`calendar-habit-item ${isCompleted ? 'completed' : ''}`}
                    onClick={() => toggleHabit(habit.id, selectedDate)}
                    style={{ borderLeftColor: habit.color }}
                  >
                    <span className="habit-icon">{habit.icon}</span>
                    <span className="habit-name">{habit.name}</span>
                    <span className="habit-status">
                      {isCompleted ? '✓' : '○'}
                    </span>
                  </div>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default CalendarView

