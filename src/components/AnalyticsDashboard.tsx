import React, { useMemo } from 'react';
import { BarChart3, TrendingUp, Target, Award, Calendar, Zap, Clock, Star } from 'lucide-react';
import { Habit, HabitProgress } from '../types';

interface AnalyticsDashboardProps {
  habits: Habit[];
  habitProgress: Record<string, HabitProgress>;
  theme: any;
}

interface WeeklyData {
  day: string;
  completed: number;
  total: number;
  percentage: number;
}

interface HabitStats {
  habit: Habit;
  completionRate: number;
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  difficulty: string;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  habits,
  habitProgress,
  theme
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

  // Calculate habit statistics
  const habitStats = useMemo(() => {
    return habits.map(habit => {
      const progress = habitProgress[habit.id];
      const completions = progress?.completedDates.length || 0;
      const daysSinceCreated = Math.ceil(
        (Date.now() - new Date(habit.createdAt).getTime()) / (1000 * 60 * 60 * 24)
      );
      const completionRate = daysSinceCreated > 0 ? (completions / daysSinceCreated) * 100 : 0;
      
      return {
        habit,
        completionRate: Math.round(completionRate),
        currentStreak: progress?.currentStreak || 0,
        longestStreak: progress?.longestStreak || 0,
        totalCompletions: completions,
        difficulty: habit.difficulty
      };
    });
  }, [habits, habitProgress]);

  // Calculate overall stats
  const overallStats = useMemo(() => {
    const totalCompletions = habitStats.reduce((sum, stat) => sum + stat.totalCompletions, 0);
    const avgCompletionRate = habitStats.length > 0 
      ? habitStats.reduce((sum, stat) => sum + stat.completionRate, 0) / habitStats.length 
      : 0;
    const totalStreaks = habitStats.reduce((sum, stat) => sum + stat.currentStreak, 0);
    const longestCurrentStreak = Math.max(...habitStats.map(stat => stat.currentStreak), 0);
    const perfectWeeks = weeklyData.filter(day => day.percentage === 100).length;
    
    // Get best and struggling habits
    const bestHabits = [...habitStats]
      .sort((a, b) => b.completionRate - a.completionRate)
      .slice(0, 3);
    const strugglingHabits = [...habitStats]
      .filter(stat => stat.completionRate < 50)
      .sort((a, b) => a.completionRate - b.completionRate)
      .slice(0, 3);

    return {
      totalCompletions,
      avgCompletionRate: Math.round(avgCompletionRate),
      totalStreaks,
      longestCurrentStreak,
      perfectWeeks,
      bestHabits,
      strugglingHabits
    };
  }, [habitStats, weeklyData]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-500';
      case 'Medium': return 'text-yellow-500';
      case 'Hard': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getCompletionRateColor = (rate: number) => {
    if (rate >= 80) return 'text-green-500';
    if (rate >= 60) return 'text-yellow-500';
    if (rate >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  const maxWeeklyPercentage = Math.max(...weeklyData.map(d => d.percentage), 1);

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className={`${theme.cardBg || theme.card} p-6 rounded-2xl shadow-lg`}>
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="text-blue-500" size={24} />
          <h2 className={`text-xl font-bold ${theme.textPrimary || theme.text}`}>
            Analytics Overview
          </h2>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <div className="text-2xl font-bold text-blue-500">{overallStats.avgCompletionRate}%</div>
            <div className={`text-sm ${theme.textSecondary}`}>Avg Completion</div>
          </div>
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
            <div className="text-2xl font-bold text-green-500">{overallStats.totalStreaks}</div>
            <div className={`text-sm ${theme.textSecondary}`}>Total Streaks</div>
          </div>
          <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
            <div className="text-2xl font-bold text-purple-500">{overallStats.totalCompletions}</div>
            <div className={`text-sm ${theme.textSecondary}`}>Total Done</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
            <div className="text-2xl font-bold text-yellow-500">{overallStats.longestCurrentStreak}</div>
            <div className={`text-sm ${theme.textSecondary}`}>Best Streak</div>
          </div>
        </div>
      </div>

      {/* Weekly Progress Chart */}
      <div className={`${theme.cardBg || theme.card} p-6 rounded-2xl shadow-lg`}>
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="text-green-500" size={24} />
          <h3 className={`text-lg font-bold ${theme.textPrimary || theme.text}`}>
            Weekly Progress
          </h3>
        </div>
        
        <div className="space-y-4">
          {weeklyData.map((day, index) => (
            <div key={day.day} className="flex items-center gap-4">
              <div className={`w-12 text-sm font-medium ${theme.textSecondary}`}>
                {day.day}
              </div>
              
              <div className="flex-1 relative">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      day.percentage === 100 ? 'bg-green-500' :
                      day.percentage >= 75 ? 'bg-green-400' :
                      day.percentage >= 50 ? 'bg-yellow-400' :
                      day.percentage >= 25 ? 'bg-orange-400' :
                      day.percentage > 0 ? 'bg-red-400' : 'bg-gray-300'
                    }`}
                    style={{ width: `${(day.percentage / maxWeeklyPercentage) * 100}%` }}
                  />
                </div>
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    {day.completed}/{day.total} ({day.percentage}%)
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Best Performing Habits */}
      {overallStats.bestHabits.length > 0 && (
        <div className={`${theme.cardBg || theme.card} p-6 rounded-2xl shadow-lg`}>
          <div className="flex items-center gap-3 mb-6">
            <Star className="text-yellow-500" size={24} />
            <h3 className={`text-lg font-bold ${theme.textPrimary || theme.text}`}>
              Top Performing Habits
            </h3>
          </div>
          
          <div className="space-y-4">
            {overallStats.bestHabits.map((stat, index) => (
              <div key={stat.habit.id} className="flex items-center gap-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
                <div className="flex items-center justify-center w-8 h-8 bg-yellow-500 text-white text-sm font-bold rounded-full">
                  #{index + 1}
                </div>
                
                <span className="text-2xl">{stat.habit.emoji}</span>
                
                <div className="flex-1">
                  <div className={`font-medium ${theme.textPrimary || theme.text}`}>
                    {stat.habit.name}
                  </div>
                  <div className={`text-sm ${theme.textSecondary}`}>
                    {stat.habit.category} • {stat.totalCompletions} completions
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`text-lg font-bold ${getCompletionRateColor(stat.completionRate)}`}>
                    {stat.completionRate}%
                  </div>
                  <div className="text-sm text-green-500 font-medium">
                    {stat.currentStreak} day streak
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Struggling Habits */}
      {overallStats.strugglingHabits.length > 0 && (
        <div className={`${theme.cardBg || theme.card} p-6 rounded-2xl shadow-lg`}>
          <div className="flex items-center gap-3 mb-6">
            <Target className="text-red-500" size={24} />
            <h3 className={`text-lg font-bold ${theme.textPrimary || theme.text}`}>
              Needs Attention
            </h3>
          </div>
          
          <div className="space-y-4">
            {overallStats.strugglingHabits.map((stat) => (
              <div key={stat.habit.id} className="flex items-center gap-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
                <span className="text-2xl">{stat.habit.emoji}</span>
                
                <div className="flex-1">
                  <div className={`font-medium ${theme.textPrimary || theme.text}`}>
                    {stat.habit.name}
                  </div>
                  <div className={`text-sm ${theme.textSecondary}`}>
                    {stat.habit.category} • {stat.totalCompletions} completions
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`text-lg font-bold ${getCompletionRateColor(stat.completionRate)}`}>
                    {stat.completionRate}%
                  </div>
                  <div className={`text-sm ${getDifficultyColor(stat.difficulty)}`}>
                    {stat.difficulty} habit
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <div className={`text-sm ${theme.textPrimary || theme.text} font-medium mb-2`}>
              💡 Improvement Tips:
            </div>
            <ul className={`text-sm ${theme.textSecondary} space-y-1`}>
              <li>• Try breaking difficult habits into smaller steps</li>
              <li>• Set specific reminder times for struggling habits</li>
              <li>• Consider pairing with existing strong habits</li>
              <li>• Celebrate small wins to build momentum</li>
            </ul>
          </div>
        </div>
      )}

      {/* Detailed Habit Statistics */}
      <div className={`${theme.cardBg || theme.card} p-6 rounded-2xl shadow-lg`}>
        <div className="flex items-center gap-3 mb-6">
          <Award className="text-purple-500" size={24} />
          <h3 className={`text-lg font-bold ${theme.textPrimary || theme.text}`}>
            All Habits Performance
          </h3>
        </div>
        
        <div className="space-y-4">
          {habitStats.map((stat) => (
            <div key={stat.habit.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
              <div className="flex items-center gap-4 mb-3">
                <span className="text-2xl">{stat.habit.emoji}</span>
                
                <div className="flex-1">
                  <div className={`font-medium ${theme.textPrimary || theme.text}`}>
                    {stat.habit.name}
                  </div>
                  <div className={`text-sm ${theme.textSecondary}`}>
                    {stat.habit.category} • Created {new Date(stat.habit.createdAt).toLocaleDateString()}
                  </div>
                </div>
                
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(stat.difficulty)} bg-gray-100 dark:bg-gray-800`}>
                  {stat.difficulty}
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className={`text-lg font-bold ${getCompletionRateColor(stat.completionRate)}`}>
                    {stat.completionRate}%
                  </div>
                  <div className={`text-xs ${theme.textSecondary}`}>Completion</div>
                </div>
                <div>
                  <div className={`text-lg font-bold ${stat.currentStreak > 0 ? 'text-green-500' : 'text-gray-400'}`}>
                    {stat.currentStreak}
                  </div>
                  <div className={`text-xs ${theme.textSecondary}`}>Current Streak</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-blue-500">
                    {stat.longestStreak}
                  </div>
                  <div className={`text-xs ${theme.textSecondary}`}>Best Streak</div>
                </div>
              </div>
              
              {stat.habit.description && (
                <div className={`mt-3 text-sm ${theme.textSecondary} italic`}>
                  "{stat.habit.description}"
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Insights & Recommendations */}
      <div className={`${theme.cardBg || theme.card} p-6 rounded-2xl shadow-lg`}>
        <div className="flex items-center gap-3 mb-6">
          <Zap className="text-orange-500" size={24} />
          <h3 className={`text-lg font-bold ${theme.textPrimary || theme.text}`}>
            Smart Insights
          </h3>
        </div>
        
        <div className="space-y-4">
          {overallStats.avgCompletionRate >= 80 && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border-l-4 border-green-500">
              <div className="font-medium text-green-700 dark:text-green-300">🎉 Excellent Progress!</div>
              <div className="text-sm text-green-600 dark:text-green-400 mt-1">
                You're maintaining an {overallStats.avgCompletionRate}% completion rate. Keep up the amazing work!
              </div>
            </div>
          )}
          
          {overallStats.longestCurrentStreak >= 7 && (
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border-l-4 border-blue-500">
              <div className="font-medium text-blue-700 dark:text-blue-300">🔥 Streak Master!</div>
              <div className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                Your {overallStats.longestCurrentStreak}-day streak shows incredible consistency. Habit formation is happening!
              </div>
            </div>
          )}
          
          {overallStats.avgCompletionRate < 50 && (
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border-l-4 border-yellow-500">
              <div className="font-medium text-yellow-700 dark:text-yellow-300">💪 Room for Growth</div>
              <div className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
                Focus on building consistency. Start with your easiest habit and build momentum from there.
              </div>
            </div>
          )}
          
          {habits.length > 5 && (
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border-l-4 border-purple-500">
              <div className="font-medium text-purple-700 dark:text-purple-300">🎯 Quality Focus</div>
              <div className="text-sm text-purple-600 dark:text-purple-400 mt-1">
                You have {habits.length} habits. Consider focusing on 3-5 core habits for better consistency.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
