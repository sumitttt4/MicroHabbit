import React from 'react';
import { Sprout, Award, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { cn } from '../lib/utils';

// Removed theme prop as we use Shadcn/Tailwind classes
interface GardenViewProps {
  habits: string[];
  streaks: Record<number, number>;
  completedToday: Record<number, boolean>;
  theme?: any;
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
}) => {
  const getPlantInfo = (streak: number): PlantInfo => {
    if (streak >= 100) {
      return { emoji: '🌳', name: 'Ancient Oak', description: 'Legendary (100+ days)', size: 'xlarge', rarity: 'legendary' };
    } else if (streak >= 50) {
      return { emoji: '🌲', name: 'Evergreen Pine', description: 'Epic (50+ days)', size: 'large', rarity: 'epic' };
    } else if (streak >= 30) {
      return { emoji: '🌵', name: 'Desert Warrior', description: 'Rare (30+ days)', size: 'large', rarity: 'rare' };
    } else if (streak >= 15) {
      return { emoji: '🌻', name: 'Sunflower', description: 'Rare (15+ days)', size: 'medium', rarity: 'rare' };
    } else if (streak >= 7) {
      return { emoji: '🌿', name: 'Lucky Clover', description: 'Common (7+ days)', size: 'medium', rarity: 'common' };
    } else if (streak >= 3) {
      return { emoji: '🌱', name: 'Young Sprout', description: 'Common (3+ days)', size: 'small', rarity: 'common' };
    } else {
      return { emoji: '🌾', name: 'Seed', description: 'Beginner', size: 'small', rarity: 'common' };
    }
  };

  const getPlantSize = (size: string) => {
    switch (size) {
      case 'xlarge': return 'text-7xl';
      case 'large': return 'text-6xl';
      case 'medium': return 'text-5xl';
      case 'small': return 'text-4xl';
      default: return 'text-3xl';
    }
  };

  // Minimal rarity colors (badges) using Shadcn utility classes
  const getRarityBadge = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'epic': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'rare': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'common': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Just counts for stats
  const totalPlants = habits.length;
  // Mature = streak >= 7
  const maturePlants = Object.values(streaks).filter(streak => streak >= 7).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      {/* Stats Header */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Plants</CardTitle>
            <div className="text-3xl font-bold font-serif">{totalPlants}</div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Mature Plants</CardTitle>
            <div className="text-3xl font-bold font-serif">{maturePlants}</div>
          </CardHeader>
        </Card>
      </div>

      {/* Garden Grid */}
      <h2 className="text-xl font-serif font-semibold mt-8 mb-4">Your Garden</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {habits.map((habit, index) => {
          const streak = streaks[index] || 0;
          const isCompleted = completedToday[index] || false;
          const plant = getPlantInfo(streak);

          return (
            <Card key={index} className={cn(
              "relative overflow-hidden transition-all duration-300 hover:shadow-md border-border/60",
              isCompleted ? "bg-muted/30" : "bg-card"
            )}>
              <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-3">
                <div className={cn(
                  "transition-all duration-700",
                  getPlantSize(plant.size),
                  streak > 0 && "animate-in zoom-in spin-in-[5deg] duration-1000",
                  isCompleted && "scale-110 drop-shadow-sm"
                )}>
                  {plant.emoji}
                </div>

                <div className="space-y-1">
                  <h3 className="font-medium text-foreground text-sm line-clamp-1">{habit}</h3>
                  <p className="text-xs text-muted-foreground">{plant.name}</p>
                </div>

                <span className={cn(
                  "px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide border",
                  getRarityBadge(plant.rarity)
                )}>
                  {plant.rarity}
                </span>
              </CardContent>

              {/* Minimal streak indicator at bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
                <div
                  className="h-full bg-primary/50"
                  style={{ width: `${Math.min(streak, 100)}%`, transition: 'width 1s ease-in-out' }}
                />
              </div>
            </Card>
          );
        })}

        {/* Placeholder for new habits */}
        {habits.length < 9 && (
          <Card className="border-dashed flex flex-col items-center justify-center p-6 text-center text-muted-foreground/50 hover:text-muted-foreground hover:bg-muted/20 transition-colors cursor-default">
            <Sprout className="w-8 h-8 mb-2 opacity-50" />
            <span className="text-xs">New Spot</span>
          </Card>
        )}
      </div>

    </div>
  );
};

export default GardenView;
