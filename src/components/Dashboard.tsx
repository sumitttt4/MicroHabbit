import React from 'react';
import HabitCard from './HabitCard';
import { User } from '../types';
import { celebrateCompletion } from '../utils/helpers';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Separator } from './ui/separator'; // Need to create if not exists
import { cn } from '../lib/utils';
import { ArrowUpRight } from 'lucide-react';

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

      {/* Welcome Section / Header could go here in parent, but this is content */}

      {/* Habits List */}
      <div className="space-y-4">
        {habits.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
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

      {/* Stats Summary - "Garden" */}
      <Card className="border-border/40 shadow-sm bg-muted/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-serif tracking-tight flex items-center gap-2">
            Your Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-8">
            <div className="flex flex-col gap-1">
              <span className="text-3xl font-bold font-serif">{totalStreaks}</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Total Streak Days</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-3xl font-bold font-serif">{completedCount}</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Completed Today</span>
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  );
};

export default Dashboard;
