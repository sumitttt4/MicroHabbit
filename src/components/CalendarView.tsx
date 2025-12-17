import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, TrendingUp } from 'lucide-react';
import { Habit, HabitProgress } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { cn } from '../lib/utils';
import { Badge } from './ui/badge'; // TODO: Implement Badge
import { ScrollArea } from './ui/scroll-area'; // TODO: Implement ScrollArea

interface CalendarViewProps {
  habits: Habit[];
  habitProgress: Record<string, HabitProgress>;
  theme?: any;
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
  onDateClick
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const days: CalendarDay[] = [];
    const today = new Date().toDateString();

    const prevMonth = new Date(year, month - 1, 0);
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonth.getDate() - i);
      const dateStr = date.toDateString();
      days.push(createDayObject(dateStr, false, today, habits, habitProgress));
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr = date.toDateString();
      days.push(createDayObject(dateStr, true, today, habits, habitProgress));
    }

    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day);
      const dateStr = date.toDateString();
      days.push(createDayObject(dateStr, false, today, habits, habitProgress));
    }

    return days;
  }, [currentDate, habits, habitProgress]);

  function createDayObject(dateStr: string, isCurrentMonth: boolean, today: string, habits: Habit[], habitProgress: Record<string, HabitProgress>): CalendarDay {
    const habitDetails = habits.map(habit => ({
      habit,
      completed: habitProgress[habit.id]?.completedDates.includes(dateStr) || false
    }));
    const completedCount = habitDetails.filter(h => h.completed).length;
    return {
      date: dateStr,
      isCurrentMonth,
      isToday: dateStr === today,
      completedHabits: completedCount,
      totalHabits: habits.length,
      habitDetails
    };
  }

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

  const getDayColor = (completed: number, total: number, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) return 'opacity-30';
    if (total === 0) return 'bg-muted';
    const percentage = (completed / total) * 100;

    if (percentage === 100) return 'bg-primary text-primary-foreground font-bold';
    if (percentage >= 75) return 'bg-primary/80 text-primary-foreground';
    if (percentage >= 50) return 'bg-primary/60 text-primary-foreground';
    if (percentage > 0) return 'bg-primary/40';
    return 'bg-muted hover:bg-muted/80';
  };

  const handleDateClick = (day: CalendarDay) => {
    setSelectedDate(day.date);
    onDateClick?.(day.date);
  };

  const selectedDay = selectedDate ? calendarDays.find(day => day.date === selectedDate) : null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

      <div className="flex flex-col md:flex-row gap-6">
        {/* Calendar Card */}
        <Card className="flex-1 border-none shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <h3 className="font-serif text-xl font-bold">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h3>
            <div className="flex gap-1">
              <Button variant="outline" size="icon" onClick={() => navigateMonth('prev')}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => navigateMonth('next')}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Days Header */}
            <div className="grid grid-cols-7 mb-2">
              {dayNames.map(day => (
                <div key={day} className="text-center text-xs text-muted-foreground font-medium py-1">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1.5">
              {calendarDays.map((day, index) => (
                <button
                  key={index}
                  onClick={() => handleDateClick(day)}
                  className={cn(
                    "aspect-square rounded-full flex flex-col items-center justify-center text-sm transition-all relative group",
                    getDayColor(day.completedHabits, day.totalHabits, day.isCurrentMonth),
                    day.isToday && "ring-2 ring-foreground ring-offset-2",
                    selectedDate === day.date && "scale-110 shadow-md ring-2 ring-primary/50"
                  )}
                >
                  <span>{new Date(day.date).getDate()}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Selected Day / Details Side */}
        <div className="flex-1 space-y-6">
          <Card className="h-full border-none bg-muted/30">
            <CardHeader>
              <CardTitle className="font-serif">
                {selectedDay ? new Date(selectedDay.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }) : 'Select a date'}
              </CardTitle>
              <CardDescription>
                {selectedDay ? `${selectedDay.completedHabits} / ${selectedDay.totalHabits} habits completed` : 'Tap on a date to see details'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {selectedDay ? (
                  selectedDay.habitDetails.map(({ habit, completed }) => (
                    <div key={habit.id} className="flex items-center gap-3 bg-card p-3 rounded-lg border shadow-sm">
                      <span className="text-xl">{habit.emoji}</span>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{habit.name}</p>
                      </div>
                      {completed ? (
                        <Badge className="bg-green-500 hover:bg-green-600">Done</Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground">Pending</Badge>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                    <CalendarIcon className="w-10 h-10 mb-2 opacity-20" />
                    <p className="text-sm">No date selected</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
