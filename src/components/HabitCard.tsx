import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { getPlantStage } from '../utils/helpers';

interface HabitCardProps {
  habit: string;
  index: number;
  isCompleted: boolean;
  streak: number;
  onComplete: (index: number) => void;
  theme: any;
}

interface CelebrationParticle {
  id: number;
  emoji: string;
  left: number;
  top: number;
  animationDelay: number;
}

const HabitCard: React.FC<HabitCardProps> = ({ 
  habit, 
  index, 
  isCompleted, 
  streak, 
  onComplete, 
  theme 
}) => {
  const [showCelebration, setShowCelebration] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [particles, setParticles] = useState<CelebrationParticle[]>([]);

  // Generate celebration particles
  const generateParticles = () => {
    const emojis = ['🎉', '✨', '⭐', '🌟', '💫', '🎊', '🌸', '🌺'];
    const newParticles: CelebrationParticle[] = [];
    
    for (let i = 0; i < 10; i++) {
      newParticles.push({
        id: i,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        left: Math.random() * 80 + 10, // 10% to 90% from left
        top: Math.random() * 60 + 20,  // 20% to 80% from top
        animationDelay: Math.random() * 0.8
      });
    }
    
    setParticles(newParticles);
  };

  const handleComplete = () => {
    if (isCompleted || isAnimating) return;

    // Start celebration animation
    setIsAnimating(true);
    generateParticles();
    setShowCelebration(true);

    // Complete the habit after animation starts
    setTimeout(() => {
      onComplete(index);
    }, 300);

    // Clean up celebration
    setTimeout(() => {
      setShowCelebration(false);
      setIsAnimating(false);
      setParticles([]);
    }, 2500);
  };

  const getStreakEmoji = (streakCount: number) => {
    if (streakCount >= 100) return '🌳';
    if (streakCount >= 30) return '🌵';
    if (streakCount >= 7) return '🌿';
    if (streakCount >= 3) return '🌱';
    return '🌾';
  };

  return (
    <div 
      id={`habit-${index}`}
      className={`relative overflow-hidden ${theme.card} p-6 rounded-2xl shadow-lg transition-all duration-300 ${
        isAnimating ? 'transform scale-105 shadow-2xl' : 'hover:shadow-xl'
      }`}
    >
      {/* Celebration overlay */}
      {showCelebration && (
        <div className="absolute inset-0 pointer-events-none z-10">
          {/* Background glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 via-yellow-400/20 to-green-400/20 rounded-2xl animate-pulse"></div>
          
          {/* Celebration particles */}
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute text-lg"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                animationDelay: `${particle.animationDelay}s`,
              }}
            >
              <span 
                className="inline-block"
                style={{ 
                  animation: 'confettiPop 2s ease-out forwards'
                }}
              >
                {particle.emoji}
              </span>
            </div>
          ))}

          {/* Growing plant animation */}
          <div 
            className="absolute top-1/2 left-20 transform -translate-y-1/2 text-4xl"
            style={{ animation: 'plantGrow 1.2s ease-out' }}
          >
            🌱
          </div>
        </div>
      )}

      <div className="flex items-center justify-between relative z-20">
        <div className="flex items-center gap-4">
          <button
            onClick={handleComplete}
            disabled={isCompleted || isAnimating}
            className={`relative w-16 h-16 rounded-full border-4 flex items-center justify-center transition-all duration-300 ${
              isCompleted 
                ? 'bg-green-500 border-green-500 shadow-lg shadow-green-500/30' 
                : 'border-gray-300 hover:border-green-400 hover:scale-110'
            } ${isAnimating ? 'animate-pulse' : ''}`}
          >
            {/* Ripple effect */}
            {isAnimating && (
              <div 
                className="absolute inset-0 rounded-full bg-green-400 opacity-30"
                style={{ animation: 'ripple 1s ease-out' }}
              ></div>
            )}
            
            {isCompleted && <Check className="text-white" size={24} />}
          </button>
          
          <div>
            <h3 className={`font-semibold ${theme.text} text-lg`}>{habit}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span 
                className={`text-2xl transition-all duration-500 ${
                  streak > 0 ? 'filter brightness-110' : ''
                }`}
                style={{ 
                  animation: streak > 0 ? 'streakFireAnimation 3s ease-in-out infinite' : 'none'
                }}
              >
                {getStreakEmoji(streak)}
              </span>
              <span className={`text-sm font-medium ${
                streak > 0 ? 'text-green-500' : theme.textSecondary
              }`}>
                {streak} day streak
              </span>
              
              {/* Streak milestone badge */}
              {streak > 0 && (streak === 3 || streak === 7 || streak === 30 || streak === 100) && (
                <span 
                  className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs rounded-full font-bold"
                  style={{ animation: 'badgeUnlock 1s ease-out' }}
                >
                  {streak === 3 && 'New Sprout!'}
                  {streak === 7 && 'Growing Strong!'}
                  {streak === 30 && 'Mighty Tree!'}
                  {streak === 100 && 'Forest Master!'}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HabitCard;
