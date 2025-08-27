import React from 'react';
import { Crown, Palette, Brain, Lightbulb, MessageCircle, Download, User, LogOut, Sparkles } from 'lucide-react';
import { THEMES } from '../config/constants';
import { User as UserType } from '../types';
import { exportData } from '../utils/helpers';

interface SettingsScreenProps {
  user: UserType | null;
  theme: string;
  suggestedHabits: string[];
  loadingAI: boolean;
  onClose: () => void;
  onThemeChange: (theme: string) => void;
  onUpgradeToPremium: () => void;
  onLogout: () => void;
  onGenerateAIMessage: () => void;
  onGenerateHabitSuggestions: () => void;
  onGenerateWeeklyInsight: () => void;
  habits: string[];
  streaks: Record<number, number>;
  completedToday: Record<number, boolean>;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({
  user,
  theme,
  suggestedHabits,
  loadingAI,
  onClose,
  onThemeChange,
  onUpgradeToPremium,
  onLogout,
  onGenerateAIMessage,
  onGenerateHabitSuggestions,
  onGenerateWeeklyInsight,
  habits,
  streaks,
  completedToday,
}) => {
  const currentTheme = THEMES[theme];

  const handleExportData = () => {
    exportData(habits, streaks, completedToday);
  };

  return (
    <div className={`min-h-screen ${currentTheme.bg} p-4`}>
      <div className="max-w-md mx-auto">
        <div className={`${currentTheme.card} p-6 rounded-2xl shadow-lg`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className={`text-2xl font-bold ${currentTheme.text}`}>Settings</h2>
            <button 
              onClick={onClose}
              className={`${currentTheme.textSecondary} hover:${currentTheme.text}`}
            >
              ✕
            </button>
          </div>
          
          {/* Premium Status */}
          <div className="mb-6 p-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-lg text-white">
            <div className="flex items-center gap-2 mb-2">
              <Crown size={20} />
              <span className="font-semibold">
                {user?.isPremium ? 'Premium Member' : 'Free Plan'}
              </span>
            </div>
            {!user?.isPremium && (
              <button 
                onClick={onUpgradeToPremium}
                className="bg-white text-orange-500 px-4 py-2 rounded-full text-sm font-semibold hover:bg-gray-100 transition-colors"
              >
                Upgrade to Premium - $2.99/mo
              </button>
            )}
          </div>
          
          {/* Theme Selection */}
          {user?.isPremium && (
            <div className="mb-6">
              <h3 className={`font-semibold ${currentTheme.text} mb-3 flex items-center gap-2`}>
                <Palette size={18} /> Themes
              </h3>
              <div className="space-y-2">
                {Object.keys(THEMES).map(themeKey => (
                  <button
                    key={themeKey}
                    onClick={() => onThemeChange(themeKey)}
                    className={`w-full p-3 rounded-lg border-2 ${
                      theme === themeKey ? 'border-green-500' : 'border-gray-200'
                    } ${currentTheme.text} capitalize`}
                  >
                    {themeKey}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* AI Features Section */}
          {user?.isPremium && (
            <div className="mb-6">
              <h3 className={`font-semibold ${currentTheme.text} mb-3 flex items-center gap-2`}>
                <Sparkles size={18} className="text-purple-500" /> AI Features
              </h3>
              <div className="space-y-2">
                <button 
                  onClick={onGenerateAIMessage}
                  disabled={loadingAI}
                  className={`w-full p-3 rounded-lg border border-gray-300 ${currentTheme.text} flex items-center justify-center gap-2 hover:bg-gray-50 disabled:opacity-50`}
                >
                  <Brain size={18} />
                  {loadingAI ? 'Generating...' : 'Get AI Motivation'}
                </button>
                
                <button 
                  onClick={onGenerateHabitSuggestions}
                  disabled={loadingAI}
                  className={`w-full p-3 rounded-lg border border-gray-300 ${currentTheme.text} flex items-center justify-center gap-2 hover:bg-gray-50 disabled:opacity-50`}
                >
                  <Lightbulb size={18} />
                  {loadingAI ? 'Loading...' : 'Get Habit Ideas'}
                </button>
                
                <button 
                  onClick={onGenerateWeeklyInsight}
                  disabled={loadingAI}
                  className={`w-full p-3 rounded-lg border border-gray-300 ${currentTheme.text} flex items-center justify-center gap-2 hover:bg-gray-50 disabled:opacity-50`}
                >
                  <MessageCircle size={18} />
                  Weekly AI Insight
                </button>
              </div>
              
              {/* Display suggested habits */}
              {suggestedHabits.length > 0 && (
                <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm font-medium text-purple-800 mb-2">AI Habit Suggestions:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedHabits.map((suggestion, index) => (
                      <span key={index} className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                        {suggestion}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Export Data */}
          {user?.isPremium && (
            <div className="mb-6">
              <button 
                onClick={handleExportData}
                className={`w-full p-3 rounded-lg border border-gray-300 ${currentTheme.text} flex items-center justify-center gap-2 hover:bg-gray-50`}
              >
                <Download size={18} />
                Export Streak Data
              </button>
            </div>
          )}
          
          {/* Account */}
          <div className="mb-6">
            <h3 className={`font-semibold ${currentTheme.text} mb-3 flex items-center gap-2`}>
              <User size={18} /> Account
            </h3>
            <p className={`${currentTheme.textSecondary} mb-3`}>{user?.email}</p>
            <button 
              onClick={onLogout}
              className={`w-full p-3 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors flex items-center justify-center gap-2`}
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;
