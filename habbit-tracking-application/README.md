# 🎯 Habit Tracker Application

A beautiful and modern habit tracking web application built with React.js, featuring advanced analytics, charts, and visual tracking.

## ✨ Features

- **📝 Habit Management**: Add, edit, and delete habits with custom colors and icons
- **📊 Dashboard**: Comprehensive statistics with multiple chart types:
  - Line chart showing last 7 days activity
  - Bar chart for habit completions
  - Pie chart for habit distribution
  - Streak tracking visualization
- **📅 Calendar View**: Visual calendar showing habit completions over time
- **🔥 Streak Tracking**: Automatic streak calculation and longest streak tracking
- **💾 Data Persistence**: All data saved locally using localStorage
- **🎨 Modern UI**: Beautiful gradient design with smooth animations

## 🚀 Getting Started

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173`)

## 📦 Technologies Used

- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **Recharts** - Charting library for data visualization
- **CSS3** - Modern styling with gradients and animations

## 🎯 How to Use

1. **Add Habits**: Click "Add New Habit" button, enter a name, choose an icon and color
2. **Track Habits**: Select a date and mark habits as complete
3. **View Statistics**: Navigate to the Dashboard tab to see charts and analytics
4. **Calendar View**: Use the Calendar tab to see your progress over time

## 📊 Features Breakdown

### Habit List View
- Add new habits with custom icons and colors
- View current streak, longest streak, and completion rate
- Mark habits as complete for any date
- Delete habits you no longer want to track

### Dashboard View
- Overview statistics cards
- Last 7 days activity line chart
- Habit completions bar chart
- Habit distribution pie chart
- Current streaks visualization

### Calendar View
- Monthly calendar with habit completion indicators
- Click any date to see and manage habits for that day
- Visual indicators show completion rates

## 🎨 Customization

The app uses a modern color scheme with gradients. You can customize colors in the component CSS files:
- `src/App.css` - Main app styling
- `src/components/*.css` - Component-specific styles

## 📝 License

This project is open source and available for personal use.
