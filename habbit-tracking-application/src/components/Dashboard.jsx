import { useMemo } from 'react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import './Dashboard.css'

function Dashboard({ habits }) {
  const stats = useMemo(() => {
    const last7Days = []
    const today = new Date()
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      
      let completions = 0
      habits.forEach(habit => {
        if (habit.completions[dateStr]) completions++
      })
      
      last7Days.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        fullDate: dateStr,
        completions
      })
    }

    const habitStats = habits.map(habit => ({
      name: habit.name,
      completions: habit.totalCompletions,
      streak: habit.streak,
      longestStreak: habit.longestStreak,
      color: habit.color
    }))

    const totalCompletions = habits.reduce((sum, h) => sum + h.totalCompletions, 0)
    const totalStreak = habits.reduce((sum, h) => sum + h.streak, 0)
    const avgCompletionRate = habits.length > 0
      ? Math.round(habits.reduce((sum, h) => {
          const days = Math.max(1, Math.ceil((new Date() - new Date(h.createdAt)) / (1000 * 60 * 60 * 24)))
          return sum + (h.totalCompletions / days) * 100
        }, 0) / habits.length)
      : 0

    return {
      last7Days,
      habitStats,
      totalCompletions,
      totalStreak,
      avgCompletionRate,
      totalHabits: habits.length
    }
  }, [habits])

  const COLORS = habits.map(h => h.color)

  return (
    <div className="dashboard-container">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>{stats.totalHabits}</h3>
            <p>Total Habits</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{stats.totalCompletions}</h3>
            <p>Total Completions</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-content">
            <h3>{stats.totalStreak}</h3>
            <p>Total Streak Days</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <h3>{stats.avgCompletionRate}%</h3>
            <p>Avg Completion Rate</p>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h2>Last 7 Days Activity</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.last7Days}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="completions"
                stroke="#6366f1"
                strokeWidth={3}
                name="Completions"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h2>Habit Completions</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.habitStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="completions" fill="#6366f1" radius={[8, 8, 0, 0]}>
                {stats.habitStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h2>Habit Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.habitStats}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="completions"
              >
                {stats.habitStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h2>Current Streaks</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.habitStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="streak" fill="#f59e0b" radius={[8, 8, 0, 0]}>
                {stats.habitStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {habits.length === 0 && (
        <div className="empty-dashboard">
          <p>No habits to display. Add some habits to see your statistics! 📊</p>
        </div>
      )}
    </div>
  )
}

export default Dashboard

