import React, { useState } from 'react';

interface HabitCompletionProps {
  habitName: string;
  isCompleted: boolean;
  onToggle: () => void;
  streak: number;
}

const HabitCompletion: React.FC<HabitCompletionProps> = ({
  habitName,
  isCompleted,
  onToggle,
  streak
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    setIsAnimating(true);
    onToggle();
    
    // Reset animation after completion
    setTimeout(() => setIsAnimating(false), 600);
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-stone-200 hover:border-orange-300 transition-all duration-200 hover:shadow-sm">
      <div className="flex items-center space-x-3">
        <button
          onClick={handleClick}
          className={`w-8 h-8 rounded-full border-2 transition-all duration-200 transform hover:scale-110 ${
            isCompleted
              ? 'bg-orange-500 border-orange-500 text-white hover:bg-orange-600'
              : 'border-stone-300 hover:border-orange-400 bg-white'
          } ${
            isAnimating ? 'animate-celebration' : ''
          }`}
        >
          {isCompleted && (
            <svg
              className="w-4 h-4 mx-auto"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>
        
        <div>
          <h3 className={`font-medium ${
            isCompleted ? 'text-stone-600 line-through' : 'text-stone-900'
          }`}>
            {habitName}
          </h3>
          {streak > 0 && (
            <div className="flex items-center space-x-1 mt-1">
              <span className="text-orange-500 text-sm">🔥</span>
              <span className="text-sm text-stone-600">{streak} day{streak > 1 ? 's' : ''}</span>
            </div>
          )}
        </div>
      </div>

      {/* Streak milestone celebration */}
      {isCompleted && [3, 7, 30, 100].includes(streak) && (
        <div className="text-xl animate-pulse">
          {streak === 3 && '🌱'}
          {streak === 7 && '🔥'}
          {streak === 30 && '🏆'}
          {streak >= 100 && '👑'}
        </div>
      )}
    </div>
  );
};

export default HabitCompletion;
