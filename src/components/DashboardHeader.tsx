import React from 'react';
import { Settings, Brain, Sparkles, MessageCircle } from 'lucide-react';
import { User } from '../types';

interface DashboardHeaderProps {
  user: User | null;
  completedCount: number;
  totalHabits: number;
  aiMessage: string;
  weeklyInsight: string;
  loadingAI: boolean;
  theme: any;
  onSettingsClick: () => void;
  onGenerateAIMessage: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  user,
  completedCount,
  totalHabits,
  aiMessage,
  weeklyInsight,
  loadingAI,
  theme,
  onSettingsClick,
  onGenerateAIMessage,
}) => {
  const getMotivationalMessage = () => {
    if (aiMessage && user?.isPremium) {
      return aiMessage;
    }
    
    if (completedCount === 0) {
      return "🌱 Ready to start your day? Your plants are waiting!";
    } else if (completedCount === totalHabits) {
      return "🎉 Amazing! All habits completed. Your garden is thriving!";
    } else {
      return `🌿 Great job! ${completedCount}/${totalHabits} done. Keep going!`;
    }
  };

  return (
    <div className={`${theme.card} p-6 rounded-2xl shadow-lg mb-6`}>
      <div className="flex justify-between items-center mb-4">
        <h1 className={`text-2xl font-bold ${theme.text}`}>MicroHabit</h1>
        <button 
          onClick={onSettingsClick}
          className={`${theme.textSecondary} hover:${theme.text}`}
        >
          <Settings size={24} />
        </button>
      </div>
      
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className={`text-sm ${theme.textSecondary}`}>
            Today's Progress
          </span>
          <span className={`text-sm font-semibold ${theme.text}`}>
            {completedCount}/{totalHabits}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-green-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${totalHabits ? (completedCount / totalHabits) * 100 : 0}%` }}
          ></div>
        </div>
      </div>
      
      {/* AI Motivational Message */}
      {user?.isPremium && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg flex items-start gap-3 mb-4">
          <div className="flex-shrink-0">
            {loadingAI ? (
              <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Brain size={18} className="text-purple-500 mt-0.5" />
            )}
          </div>
          <div className="flex-1">
            <p className="text-purple-700 text-sm font-medium">AI Coach</p>
            <p className="text-purple-800 text-sm">{getMotivationalMessage()}</p>
          </div>
          <button 
            onClick={onGenerateAIMessage}
            disabled={loadingAI}
            className="flex-shrink-0 text-purple-500 hover:text-purple-600 disabled:opacity-50"
          >
            <Sparkles size={16} />
          </button>
        </div>
      )}
      
      {/* Weekly AI Insight */}
      {user?.isPremium && weeklyInsight && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg mb-4">
          <div className="flex items-center gap-2 mb-1">
            <MessageCircle size={16} className="text-emerald-500" />
            <span className="text-emerald-700 text-sm font-medium">This Week's Insight</span>
          </div>
          <p className="text-emerald-800 text-sm">{weeklyInsight}</p>
        </div>
      )}
    </div>
  );
};

export default DashboardHeader;
