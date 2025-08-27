import React from 'react';
import { TrendingUp, Award, Sprout, TreePine } from 'lucide-react';

interface GardenViewProps {
  habits: string[];
  streaks: Record<number, number>;
  completedToday: Record<number, boolean>;
  theme: any;
}

interface PlantInfo {
  emoji: string;
  name: string;
  description: string;
  size: 'small' | 'medium' | 'large' | 'xlarge';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

const GardenView: React.FC<GardenViewProps> = ({
  habits,
  streaks,
  completedToday,
  theme
}) => {
  const getPlantInfo = (streak: number): PlantInfo => {
    if (streak >= 100) {
      return {
        emoji: '🌳',
        name: 'Ancient Oak',
        description: 'A legendary tree that has weathered 100+ days',
        size: 'xlarge',
        rarity: 'legendary'
      };
    } else if (streak >= 50) {
      return {
        emoji: '🌲',
        name: 'Evergreen Pine',
        description: 'A majestic tree standing tall and proud',
        size: 'large',
        rarity: 'epic'
      };
    } else if (streak >= 30) {
      return {
        emoji: '🌵',
        name: 'Desert Warrior',
        description: 'Resilient and enduring through challenges',
        size: 'large',
        rarity: 'rare'
      };
    } else if (streak >= 15) {
      return {
        emoji: '🌻',
        name: 'Sunflower',
        description: 'Bright and cheerful, always reaching for the sun',
        size: 'medium',
        rarity: 'rare'
      };
    } else if (streak >= 7) {
      return {
        emoji: '🌿',
        name: 'Lucky Clover',
        description: 'A symbol of good fortune and persistence',
        size: 'medium',
        rarity: 'common'
      };
    } else if (streak >= 3) {
      return {
        emoji: '🌱',
        name: 'Young Sprout',
        description: 'Fresh and full of potential',
        size: 'small',
        rarity: 'common'
      };
    } else {
      return {
        emoji: '🌾',
        name: 'Seed',
        description: 'Just beginning the journey',
        size: 'small',
        rarity: 'common'
      };
    }
  };

  const getPlantSize = (size: string) => {
    switch (size) {
      case 'xlarge': return 'text-8xl';
      case 'large': return 'text-6xl';
      case 'medium': return 'text-4xl';
      case 'small': return 'text-2xl';
      default: return 'text-2xl';
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'from-purple-500 via-pink-500 to-yellow-500';
      case 'epic': return 'from-purple-500 to-blue-500';
      case 'rare': return 'from-blue-500 to-green-500';
      case 'common': return 'from-green-400 to-green-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const totalPlants = habits.length;
  const maturePlants = Object.values(streaks).filter(streak => streak >= 7).length;
  const rarePlants = Object.values(streaks).filter(streak => streak >= 15).length;

  return (
    <div className="space-y-6">
      {/* Garden Stats */}
      <div className={`${theme.card} p-6 rounded-2xl shadow-lg`}>
        <div className="flex items-center gap-3 mb-4">
          <Sprout className="text-green-500" size={24} />
          <h2 className={`text-xl font-bold ${theme.text}`}>Your Habit Garden</h2>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-500">{totalPlants}</div>
            <div className={`text-sm ${theme.textSecondary}`}>Total Plants</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-500">{maturePlants}</div>
            <div className={`text-sm ${theme.textSecondary}`}>Mature Plants</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-500">{rarePlants}</div>
            <div className={`text-sm ${theme.textSecondary}`}>Rare Plants</div>
          </div>
        </div>
      </div>

      {/* Garden Grid */}
      <div className="grid grid-cols-2 gap-4">
        {habits.map((habit, index) => {
          const streak = streaks[index] || 0;
          const isCompleted = completedToday[index] || false;
          const plant = getPlantInfo(streak);
          
          return (
            <div
              key={index}
              className={`relative ${theme.card} p-6 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl overflow-hidden`}
            >
              {/* Rarity background glow */}
              <div 
                className={`absolute inset-0 opacity-10 bg-gradient-to-br ${getRarityColor(plant.rarity)}`}
              ></div>
              
              {/* Completion glow for today */}
              {isCompleted && (
                <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-yellow-400/20 animate-pulse"></div>
              )}
              
              <div className="relative z-10 text-center">
                {/* Plant with animation */}
                <div 
                  className={`${getPlantSize(plant.size)} mb-3 transition-all duration-500 ${
                    streak > 0 ? 'filter brightness-110' : ''
                  }`}
                  style={{ 
                    animation: streak > 0 ? 'plantBreathe 10s ease-in-out infinite' : 'none'
                  }}
                >
                  {plant.emoji}
                </div>
                
                {/* Plant info */}
                <h3 className={`font-semibold ${theme.text} mb-1`}>{plant.name}</h3>
                <p className={`text-xs ${theme.textSecondary} mb-2`}>{plant.description}</p>
                
                {/* Habit name */}
                <div className={`text-sm font-medium ${theme.text} mb-2 truncate`}>
                  {habit}
                </div>
                
                {/* Streak info */}
                <div className="flex items-center justify-center gap-2">
                  <TrendingUp className={`w-3 h-3 ${streak > 0 ? 'text-green-500' : theme.textSecondary}`} />
                  <span className={`text-xs font-medium ${streak > 0 ? 'text-green-500' : theme.textSecondary}`}>
                    {streak} days
                  </span>
                </div>
                
                {/* Rarity badge */}
                {plant.rarity !== 'common' && (
                  <div className={`inline-flex items-center gap-1 px-2 py-1 mt-2 rounded-full text-xs font-bold bg-gradient-to-r ${getRarityColor(plant.rarity)} text-white`}>
                    <Award className="w-3 h-3" />
                    {plant.rarity.charAt(0).toUpperCase() + plant.rarity.slice(1)}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        
        {/* Add new habit placeholder */}
        <div className={`${theme.card} p-6 rounded-2xl shadow-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-center transition-all duration-300 hover:border-green-400`}>
          <div className="text-4xl mb-2">🌱</div>
          <div className={`text-sm font-medium ${theme.textSecondary}`}>
            Plant a new habit
          </div>
          <div className={`text-xs ${theme.textSecondary} mt-1`}>
            Add more plants to your garden
          </div>
        </div>
      </div>

      {/* Milestone achievements */}
      <div className={`${theme.card} p-6 rounded-2xl shadow-lg`}>
        <div className="flex items-center gap-3 mb-4">
          <Award className="text-yellow-500" size={24} />
          <h3 className={`text-lg font-bold ${theme.text}`}>Garden Milestones</h3>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className={theme.textSecondary}>First Sprout (3 days)</span>
            <span className="text-2xl">🌱</span>
          </div>
          <div className="flex items-center justify-between">
            <span className={theme.textSecondary}>Lucky Clover (7 days)</span>
            <span className="text-2xl">🌿</span>
          </div>
          <div className="flex items-center justify-between">
            <span className={theme.textSecondary}>Bright Sunflower (15 days)</span>
            <span className="text-2xl">🌻</span>
          </div>
          <div className="flex items-center justify-between">
            <span className={theme.textSecondary}>Desert Warrior (30 days)</span>
            <span className="text-2xl">🌵</span>
          </div>
          <div className="flex items-center justify-between">
            <span className={theme.textSecondary}>Evergreen Pine (50 days)</span>
            <span className="text-2xl">🌲</span>
          </div>
          <div className="flex items-center justify-between">
            <span className={theme.textSecondary}>Ancient Oak (100 days)</span>
            <span className="text-2xl">🌳</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GardenView;
