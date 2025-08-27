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
  const [newHabits, setNewHabits] = useState<string[]>(['', '', '']);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      emoji: '🌱',
      title: 'Start small',
      subtitle: 'What would you like to do every day?',
    },
    {
      emoji: '✨',
      title: 'Keep it simple',
      subtitle: 'Pick just 3 habits to focus on',
    },
    {
      emoji: '🎯',
      title: 'You\'re ready!',
      subtitle: 'Let\'s build these habits together',
    }
  ];

  const handleHabitChange = (index: number, value: string) => {
    const updated = [...newHabits];
    updated[index] = value;
    setNewHabits(updated);
  };

  const selectSuggestion = (suggestion: string) => {
    const emptyIndex = newHabits.findIndex(h => h.trim() === '');
    if (emptyIndex !== -1) {
      handleHabitChange(emptyIndex, suggestion);
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
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-sm w-full max-w-sm border border-stone-200">
        
        {/* Simple step indicator */}
        <div className="flex justify-center mb-6">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full mx-1 transition-colors ${
                index <= currentStep ? 'bg-orange-500' : 'bg-stone-300'
              }`}
            />
          ))}
        </div>

        {/* Step content */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">{steps[currentStep].emoji}</div>
          <h2 className="text-2xl font-bold text-stone-900 mb-2 font-serif">
            {steps[currentStep].title}
          </h2>
          <p className="text-stone-600">{steps[currentStep].subtitle}</p>
        </div>
        
        {/* Habit inputs */}
        <div className="space-y-3 mb-6">
          {newHabits.map((habit, index) => (
            <input
              key={index}
              type="text"
              placeholder={`Habit ${index + 1}`}
              value={habit}
              onChange={(e) => handleHabitChange(index, e.target.value)}
              className="w-full p-4 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-stone-900 placeholder-stone-500"
            />
          ))}
        </div>

        {/* AI suggestions */}
        {suggestedHabits.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={16} className="text-orange-500" />
              <span className="text-sm font-medium text-stone-700">Quick ideas</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestedHabits.slice(0, 6).map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => selectSuggestion(suggestion)}
                  className="px-3 py-2 bg-stone-100 hover:bg-orange-100 text-stone-700 hover:text-orange-700 rounded-lg text-sm transition-colors border border-stone-200 hover:border-orange-300"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
        
        <div className="space-y-3">
          {!suggestedHabits.length && (
            <button
              onClick={onGenerateSuggestions}
              disabled={loadingAI}
              className="w-full bg-stone-100 hover:bg-stone-200 text-stone-700 p-4 rounded-xl font-medium transition-colors disabled:opacity-50 border border-stone-200"
            >
              {loadingAI ? 'Getting ideas...' : 'Get some ideas ✨'}
            </button>
          )}
          
          <button
            onClick={finishOnboarding}
            disabled={!canContinue}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
          >
            {canContinue ? 'Start my journey' : 'Add at least 1 habit'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingScreen;
