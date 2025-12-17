import React, { useMemo } from 'react';
import { BarChart3, TrendingUp, Target, Award, Star, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Habit, HabitProgress } from '../types';
import { cn } from '../lib/utils';
import { Separator } from './ui/separator';

interface AnalyticsDashboardProps {
  habits: Habit[];
  habitProgress: Record<string, HabitProgress>;
  theme?: any;
}

interface WeeklyData {
  day: string;
  completed: number;
  total: number;
  percentage: number;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  habits,
  habitProgress,
}) => {
  // Calculate weekly progress data
  const weeklyData = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const data: WeeklyData[] = [];

    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toDateString();

      let completed = 0;
      habits.forEach(habit => {
        const progress = habitProgress[habit.id];
        if (progress?.completedDates.includes(dateStr)) {
          completed++;
        }
      });

      const percentage = habits.length > 0 ? (completed / habits.length) * 100 : 0;

      data.push({
        day: days[date.getDay() === 0 ? 6 : date.getDay() - 1],
        completed,
        total: habits.length,
        percentage: Math.round(percentage)
      });
    }

    return data;
  }, [habits, habitProgress]);

  // Calculate stats
  const habitStats = useMemo(() => {
    return habits.map(habit => {
      const progress = habitProgress[habit.id];
      const completions = progress?.completedDates.length || 0;
      const daysSinceCreated = Math.max(1, Math.ceil(
        (Date.now() - new Date(habit.createdAt).getTime()) / (1000 * 60 * 60 * 24)
      ));
      const completionRate = daysSinceCreated > 0 ? (completions / daysSinceCreated) * 100 : 0;

      return {
        habit,
        completionRate: Math.round(completionRate),
        currentStreak: progress?.currentStreak || 0,
        longestStreak: progress?.longestStreak || 0,
        totalCompletions: completions,
      };
    });
  }, [habits, habitProgress]);

  // Aggregate stats
  const overallStats = useMemo(() => {
    const totalCompletions = habitStats.reduce((sum, stat) => sum + stat.totalCompletions, 0);
    const avgCompletionRate = habitStats.length > 0
      ? habitStats.reduce((sum, stat) => sum + stat.completionRate, 0) / habitStats.length
      : 0;
    const totalStreaks = habitStats.reduce((sum, stat) => sum + stat.currentStreak, 0);
    const longestCurrentStreak = Math.max(...habitStats.map(stat => stat.currentStreak), 0);

    return {
      totalCompletions,
      avgCompletionRate: Math.round(avgCompletionRate),
      totalStreaks,
      longestCurrentStreak,
    };
  }, [habitStats]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Avg Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-serif">{overallStats.avgCompletionRate}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Streaks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-serif">{overallStats.totalStreaks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Done</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-serif">{overallStats.totalCompletions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Best Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-serif">{overallStats.longestCurrentStreak}</div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Chart (Minimal custom implementation) */}
      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Weekly Consistency</CardTitle>
          <CardDescription>Average completion across the week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between h-40 gap-2">
            {weeklyData.map((d, i) => (
              <div key={i} className="flex flex-col items-center gap-2 flex-1 h-full justify-end group">
                <div
                  className={cn(
                    "w-full rounded-t-md transition-all duration-500 min-h-[4px]",
                    d.percentage >= 80 ? "bg-primary" :
                      d.percentage >= 50 ? "bg-primary/60" : "bg-muted"
                  )}
                  style={{ height: `${d.percentage || 5}%` }}
                />
                <span className="text-xs text-muted-foreground font-medium">{d.day}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Habit Breakdown */}
      <div className="space-y-4">
        <h3 className="font-serif font-semibold text-lg flex items-center gap-2">
          <Award className="w-4 h-4 text-primary" /> Detail Performance
        </h3>

        <div className="grid gap-3">
          {habitStats.map((stat) => (
            <Card key={stat.habit.id} className="overflow-hidden">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{stat.habit.emoji}</span>
                  <div>
                    <p className="font-medium text-sm">{stat.habit.name}</p>
                    <p className="text-xs text-muted-foreground">Streak: {stat.currentStreak} • Best: {stat.longestStreak}</p>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <span className={cn(
                    "font-bold text-lg",
                    stat.completionRate >= 80 ? "text-primary" :
                      stat.completionRate >= 50 ? "text-primary/70" : "text-muted-foreground"
                  )}>
                    {stat.completionRate}%
                  </span>
                </div>
              </div>
              {/* Progress bar line */}
              <div className="h-1 w-full bg-muted">
                <div className="h-full bg-primary" style={{ width: `${stat.completionRate}%` }} />
              </div>
            </Card>
          ))}
        </div>
      </div>

      {overallStats.avgCompletionRate >= 80 && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4 flex items-center gap-4">
            <Zap className="w-5 h-5 text-primary" />
            <div>
              <p className="font-medium text-primary">Excellent Momentum!</p>
              <p className="text-xs text-muted-foreground">You're crushing your goals. Keep up the high consistency!</p>
            </div>
          </CardContent>
        </Card>
      )}

    </div>
  );
};

export default AnalyticsDashboard;
