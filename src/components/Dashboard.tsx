import React from 'react';
import HabitCard from './HabitCard';
import { User } from '../types';
import { celebrateCompletion } from '../utils/helpers';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { cn } from '../lib/utils';

interface DashboardProps {
  user: User | null;
  habits: string[];
  completedToday: Record<number, boolean>;
  streaks: Record<number, number>;
  lastCompletedDate: Record<number, string>;
  theme: any;
  onCompleteHabit: (index: number) => void;
  onUpgradeToPremium: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  user,
  habits,
  completedToday,
  streaks,
  onCompleteHabit,
}) => {
  const handleCompleteHabit = (index: number) => {
    if (completedToday[index]) return;
    onCompleteHabit(index);
    celebrateCompletion(index);
  };

  const completedCount = Object.values(completedToday).filter(Boolean).length;
  const totalStreaks = Object.values(streaks).reduce((sum, streak) => sum + streak, 0);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* Habits List */}
      <div className="space-y-4">
        {habits.length === 0 ? (
          <div className="text-center py-20 bg-muted/20 rounded-xl border border-dashed text-muted-foreground">
            <p>No habits yet. Start by adding one!</p>
          </div>
        ) : (
          habits.map((habit, index) => (
            <HabitCard
              key={index}
              habit={habit}
              index={index}
              isCompleted={completedToday[index] || false}
              streak={streaks[index] || 0}
              onComplete={handleCompleteHabit}
            />
          ))
        )}
      </div>

      {/* Stats Summary - Simple Clean Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gray-50/50 border-gray-100 shadow-sm">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-bold tracking-tight text-black">{totalStreaks}</span>
            <span className="text-xs text-gray-400 uppercase tracking-widest font-medium mt-1">Total Streak Days</span>
          </CardContent>
        </Card>

        <Card className="bg-gray-50/50 border-gray-100 shadow-sm">
          <CardContent className="p-6 flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-bold tracking-tight text-black">{completedCount}</span>
            <span className="text-xs text-gray-400 uppercase tracking-widest font-medium mt-1">Completed Today</span>
          </CardContent>
        </Card>
      </div>

    </div>
  );
};

export default Dashboard;
