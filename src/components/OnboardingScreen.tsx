import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface OnboardingScreenProps {
  onComplete: (habits: string[]) => void;
  suggestedHabits: string[];
  onGenerateSuggestions: () => void;
  loadingAI: boolean;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ 
  onComplete, 
  suggestedHabits, 
  onGenerateSuggestions, 
  loadingAI 
}) => {
  const [newHabits, setNewHabits] = useState<string[]>([
    'Read for 15 minutes',
    'Drink 5 glasses of water', 
    'Take a 10 minute walk'
  ]);

  const handleHabitChange = (index: number, value: string) => {
    const updated = [...newHabits];
    updated[index] = value;
    setNewHabits(updated);
  };

  const selectSuggestion = (suggestion: string) => {
    const emptyIndex = newHabits.findIndex(h => h.trim() === '');
    if (emptyIndex !== -1) {
      handleHabitChange(emptyIndex, suggestion);
    } else {
      // Replace the last habit if all are filled
      handleHabitChange(2, suggestion);
    }
  };

  const finishOnboarding = () => {
    const validHabits = newHabits.filter(h => h.trim() !== '');
    if (validHabits.length > 0) {
      onComplete(validHabits);
    }
  };

  const canContinue = newHabits.filter(h => h.trim()).length >= 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-purple-100 to-pink-100 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-sm">
        
        {/* Step indicators */}
        <div className="flex justify-center mb-8">
          <div className="w-2 h-2 rounded-full bg-orange-500 mx-1"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300 mx-1"></div>
          <div className="w-2 h-2 rounded-full bg-gray-300 mx-1"></div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">🌱</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2 font-serif">
            Start small
          </h2>
          <p className="text-gray-600">What would you like to do every day?</p>
        </div>
        
        {/* Habit inputs */}
        <div className="space-y-4 mb-6">
          {newHabits.map((habit, index) => (
            <input
              key={index}
              type="text"
              value={habit}
              onChange={(e) => handleHabitChange(index, e.target.value)}
              className="w-full p-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 bg-gray-50"
            />
          ))}
        </div>

        {/* Quick ideas section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={16} className="text-orange-500" />
            <span className="text-sm font-medium text-gray-700">Quick ideas</span>
          </div>
          <div className="space-y-2 text-sm text-gray-600">
            <div>Read for 15 minutes</div>
            <div>Drink 8 glasses of water</div>
            <div>Take a 10-minute walk</div>
          </div>
        </div>
        
        {/* Action button */}
        <button
          onClick={finishOnboarding}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-2xl font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95"
        >
          Start my journey
        </button>
      </div>
    </div>
  );
};

export default OnboardingScreen;
