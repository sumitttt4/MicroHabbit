import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { cn } from '../lib/utils';
import { getPlantStage } from '../utils/helpers';

interface HabitCardProps {
  habit: string;
  index: number;
  isCompleted: boolean;
  streak: number;
  onComplete: (index: number) => void;
  theme?: any; // kept for compatibility but not strictly used for styling anymore
}

const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  index,
  isCompleted,
  streak,
  onComplete
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleComplete = () => {
    if (isCompleted || isAnimating) return;

    setIsAnimating(true);
    // Delay actual completion slightly for animation
    setTimeout(() => {
      onComplete(index);
      setIsAnimating(false);
    }, 500);
  };

  const getStreakEmoji = (streakCount: number) => {
    if (streakCount >= 100) return '🌳';
    if (streakCount >= 30) return '🌵';
    if (streakCount >= 7) return '🌿';
    if (streakCount >= 3) return '🌱';
    return ''; // No emoji for low streaks to keep it minimal
  };

  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-300 hover:shadow-md border-border/50",
      isCompleted ? "opacity-90 bg-muted/40" : "bg-card"
    )}>
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "h-12 w-12 rounded-full border-2 transition-all duration-500",
              isCompleted
                ? "bg-primary border-primary text-primary-foreground"
                : "border-muted-foreground/30 hover:border-primary/50 hover:bg-primary/5",
              isAnimating && "scale-110",
              isCompleted && "hover:bg-primary/90"
            )}
            onClick={handleComplete}
            disabled={isCompleted}
          >
            {isCompleted ? (
              <Check className="h-6 w-6 animate-in zoom-in spin-in-180 duration-500" />
            ) : (
              <div className={cn("h-full w-full rounded-full transition-colors", isAnimating && "bg-primary/20")} />
            )}
          </Button>

          <div className="space-y-1">
            <h3 className={cn(
              "font-semibold text-lg leading-none transition-colors",
              isCompleted ? "text-muted-foreground line-through decoration-primary/30" : "text-foreground"
            )}>
              {habit}
            </h3>

            <div className="flex items-center gap-2 text-xs text-muted-foreground h-5">
              {streak > 0 && (
                <span className="flex items-center gap-1 font-medium text-primary/80 animate-in fade-in slide-in-from-left-2">
                  <span>{streak} day streak</span>
                  <span>{getStreakEmoji(streak)}</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HabitCard;
