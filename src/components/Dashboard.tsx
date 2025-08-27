import React from 'react';
import HabitCard from './HabitCard';
import PremiumCTA from './PremiumCTA';
import { User } from '../types';
import { celebrateCompletion } from '../utils/helpers';

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
  lastCompletedDate,
  theme,
  onCompleteHabit,
  onUpgradeToPremium,
}) => {
  const handleCompleteHabit = (index: number) => {
    if (completedToday[index]) return; // Already completed today

    onCompleteHabit(index);
    celebrateCompletion(index);
  };

  const completedCount = Object.values(completedToday).filter(Boolean).length;
  const totalStreaks = Object.values(streaks).reduce((sum, streak) => sum + streak, 0);

  return (
    <div className="space-y-6">
      {/* Habits */}
      <div className="space-y-4">
        {habits.map((habit, index) => (
          <HabitCard
            key={index}
            habit={habit}
            index={index}
            isCompleted={completedToday[index] || false}
            streak={streaks[index] || 0}
            onComplete={handleCompleteHabit}
            theme={theme}
          />
        ))}
      </div>
      
      {/* Stats */}
      <div className={`${theme.card} p-6 rounded-2xl shadow-lg`}>
        <h3 className={`font-semibold ${theme.text} mb-4`}>Your Garden</h3>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-500">{totalStreaks}</div>
            <div className={`text-sm ${theme.textSecondary}`}>Total Streaks</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-500">{completedCount}</div>
            <div className={`text-sm ${theme.textSecondary}`}>Done Today</div>
          </div>
        </div>
      </div>
      
      {/* Premium CTA */}
      <PremiumCTA user={user} onUpgrade={onUpgradeToPremium} />
    </div>
  );
};

export default Dashboard;
