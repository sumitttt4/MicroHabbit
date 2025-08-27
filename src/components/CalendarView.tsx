import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, TrendingUp, Award, Target } from 'lucide-react';
import { Habit, HabitProgress } from '../types';

interface CalendarViewProps {
  habits: Habit[];
  habitProgress: Record<string, HabitProgress>;
  theme: any;
  onDateClick?: (date: string) => void;
}

interface CalendarDay {
  date: string;
  isCurrentMonth: boolean;
  isToday: boolean;
  completedHabits: number;
  totalHabits: number;
  habitDetails: Array<{ habit: Habit; completed: boolean }>;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  habits,
  habitProgress,
  theme,
  onDateClick
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Generate calendar days for the current month
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    
    const days: CalendarDay[] = [];
    const today = new Date().toDateString();

    // Previous month's trailing days
    const prevMonth = new Date(year, month - 1, 0);
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonth.getDate() - i);
      const dateStr = date.toDateString();
      
      days.push({
        date: dateStr,
        isCurrentMonth: false,
        isToday: dateStr === today,
        completedHabits: 0,
        totalHabits: habits.length,
        habitDetails: habits.map(habit => ({
          habit,
          completed: habitProgress[habit.id]?.completedDates.includes(dateStr) || false
        }))
      });
    }

    // Current month's days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr = date.toDateString();
      
      const habitDetails = habits.map(habit => ({
        habit,
        completed: habitProgress[habit.id]?.completedDates.includes(dateStr) || false
      }));
      
      const completedCount = habitDetails.filter(h => h.completed).length;

      days.push({
        date: dateStr,
        isCurrentMonth: true,
        isToday: dateStr === today,
        completedHabits: completedCount,
        totalHabits: habits.length,
        habitDetails
      });
    }

    // Next month's leading days
    const remainingDays = 42 - days.length; // 6 weeks * 7 days
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      const dateStr = date.toDateString();
      
      days.push({
        date: dateStr,
        isCurrentMonth: false,
        isToday: dateStr === today,
        completedHabits: 0,
        totalHabits: habits.length,
        habitDetails: habits.map(habit => ({
          habit,
          completed: habitProgress[habit.id]?.completedDates.includes(dateStr) || false
        }))
      });
    }

    return days;
  }, [currentDate, habits, habitProgress]);

  // Calculate month statistics
  const monthStats = useMemo(() => {
    const currentMonthDays = calendarDays.filter(day => day.isCurrentMonth);
    const totalPossibleCompletions = currentMonthDays.length * habits.length;
    const totalCompletions = currentMonthDays.reduce((sum, day) => sum + day.completedHabits, 0);
    const completionRate = totalPossibleCompletions > 0 ? (totalCompletions / totalPossibleCompletions) * 100 : 0;
    
    const perfectDays = currentMonthDays.filter(day => day.completedHabits === habits.length && habits.length > 0).length;
    const streakDays = currentMonthDays.filter(day => day.completedHabits > 0).length;

    return {
      completionRate: Math.round(completionRate),
      perfectDays,
      streakDays,
      totalDays: currentMonthDays.length
    };
  }, [calendarDays, habits.length]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
    setSelectedDate(null);
  };

  const getCompletionColor = (completed: number, total: number) => {
    if (total === 0) return 'bg-gray-100';
    const percentage = (completed / total) * 100;
    
    if (percentage === 100) return 'bg-green-500';
    if (percentage >= 75) return 'bg-green-400';
    if (percentage >= 50) return 'bg-yellow-400';
    if (percentage >= 25) return 'bg-orange-400';
    if (percentage > 0) return 'bg-red-400';
    return 'bg-gray-200';
  };

  const handleDateClick = (day: CalendarDay) => {
    setSelectedDate(day.date);
    onDateClick?.(day.date);
  };

  const selectedDay = selectedDate ? calendarDays.find(day => day.date === selectedDate) : null;

  return (
    <div className="space-y-6">
      {/* Month Statistics */}
      <div className={`${theme.cardBg || theme.card} p-6 rounded-2xl shadow-lg`}>
        <div className="flex items-center gap-3 mb-4">
          <CalendarIcon className="text-blue-500" size={24} />
          <h2 className={`text-xl font-bold ${theme.textPrimary || theme.text}`}>
            Monthly Overview
          </h2>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">{monthStats.completionRate}%</div>
            <div className={`text-sm ${theme.textSecondary}`}>Completion Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500">{monthStats.perfectDays}</div>
            <div className={`text-sm ${theme.textSecondary}`}>Perfect Days</div>
          </div>
        </div>
      </div>

      {/* Calendar Header */}
      <div className={`${theme.cardBg || theme.card} p-6 rounded-2xl shadow-lg`}>
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigateMonth('prev')}
            className={`p-2 rounded-lg ${theme.buttonSecondary || 'hover:bg-gray-100'} transition-colors`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <h3 className={`text-xl font-bold ${theme.textPrimary || theme.text}`}>
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          
          <button
            onClick={() => navigateMonth('next')}
            className={`p-2 rounded-lg ${theme.buttonSecondary || 'hover:bg-gray-100'} transition-colors`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map(day => (
            <div key={day} className={`text-center text-sm font-medium ${theme.textSecondary} py-2`}>
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => (
            <button
              key={index}
              onClick={() => handleDateClick(day)}
              className={`
                relative aspect-square p-1 rounded-lg transition-all duration-200 hover:scale-105
                ${day.isCurrentMonth ? 'opacity-100' : 'opacity-40'}
                ${day.isToday ? 'ring-2 ring-blue-500' : ''}
                ${selectedDate === day.date ? 'ring-2 ring-green-500' : ''}
                ${getCompletionColor(day.completedHabits, day.totalHabits)}
              `}
            >
              <div className="text-xs font-medium text-gray-800">
                {new Date(day.date).getDate()}
              </div>
              
              {/* Completion indicator */}
              {day.completedHabits > 0 && (
                <div className="absolute bottom-0.5 right-0.5">
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-gray-200 rounded"></div>
            <span className={theme.textSecondary}>No habits</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-400 rounded"></div>
            <span className={theme.textSecondary}>Some habits</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className={theme.textSecondary}>All habits</span>
          </div>
        </div>
      </div>

      {/* Selected Date Details */}
      {selectedDay && (
        <div className={`${theme.cardBg || theme.card} p-6 rounded-2xl shadow-lg`}>
          <h3 className={`text-lg font-bold ${theme.textPrimary || theme.text} mb-4`}>
            {new Date(selectedDay.date).toLocaleDateString('en-US', { 
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </h3>
          
          <div className="space-y-3">
            {selectedDay.habitDetails.map(({ habit, completed }) => (
              <div
                key={habit.id}
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  completed ? 'bg-green-50 dark:bg-green-900/20' : 'bg-gray-50 dark:bg-gray-800'
                }`}
              >
                <span className="text-2xl">{habit.emoji}</span>
                <div className="flex-1">
                  <div className={`font-medium ${theme.textPrimary || theme.text}`}>
                    {habit.name}
                  </div>
                  {habit.description && (
                    <div className={`text-sm ${theme.textSecondary}`}>
                      {habit.description}
                    </div>
                  )}
                </div>
                <div className={`text-sm font-medium ${
                  completed ? 'text-green-600' : 'text-gray-400'
                }`}>
                  {completed ? '✓ Done' : '○ Pending'}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">
                {selectedDay.completedHabits}/{selectedDay.totalHabits}
              </div>
              <div className={`text-sm ${theme.textSecondary}`}>
                Habits completed on this day
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Habit Streaks Summary */}
      <div className={`${theme.cardBg || theme.card} p-6 rounded-2xl shadow-lg`}>
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="text-green-500" size={24} />
          <h3 className={`text-lg font-bold ${theme.textPrimary || theme.text}`}>
            Current Streaks
          </h3>
        </div>
        
        <div className="space-y-3">
          {habits.map(habit => {
            const progress = habitProgress[habit.id];
            const currentStreak = progress?.currentStreak || 0;
            const longestStreak = progress?.longestStreak || 0;
            
            return (
              <div key={habit.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{habit.emoji}</span>
                  <div>
                    <div className={`font-medium ${theme.textPrimary || theme.text}`}>
                      {habit.name}
                    </div>
                    <div className={`text-sm ${theme.textSecondary}`}>
                      Best: {longestStreak} days
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`text-lg font-bold ${
                    currentStreak > 0 ? 'text-green-500' : 'text-gray-400'
                  }`}>
                    {currentStreak}
                  </div>
                  <div className={`text-sm ${theme.textSecondary}`}>days</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
