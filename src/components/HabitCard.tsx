import React, { useState } from 'react';
import { Check, Flame } from 'lucide-react'; // Replaced emoji with Flame icon for streak
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { cn } from '../lib/utils';
// Removed getPlantStage import

interface HabitCardProps {
  habit: string;
  index: number;
  isCompleted: boolean;
  streak: number;
  onComplete: (index: number) => void;
  theme?: any;
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
    setTimeout(() => {
      onComplete(index);
      setIsAnimating(false);
    }, 500);
  };

  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-300 hover:shadow-md border-input",
      isCompleted ? "bg-success/10 border-success/20" : "bg-card"
    )}>
      <CardContent className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "h-12 w-12 rounded-full border-2 transition-all duration-500",
              isCompleted
                ? "bg-success border-success text-success-foreground hover:bg-success hover:text-success-foreground opacity-100"
                : "border-input hover:border-success/50 hover:bg-success/5",
              isAnimating && "scale-110"
            )}
            onClick={handleComplete}
            disabled={isCompleted}
          >
            {isCompleted ? (
              <Check className="h-6 w-6 animate-in zoom-in spin-in-180 duration-500" />
            ) : (
              <div className={cn("h-full w-full rounded-full transition-colors", isAnimating && "bg-success/20")} />
            )}
          </Button>

          <div className="space-y-1">
            <h3 className={cn(
              "font-semibold text-lg leading-none transition-colors",
              isCompleted ? "text-success/80 line-through" : "text-foreground"
            )}>
              {habit}
            </h3>

            {(streak > 0 || isCompleted) && (
              <div className="flex items-center gap-2 text-xs font-medium h-5">
                {streak > 0 && (
                  <span className={cn(
                    "flex items-center gap-1",
                    streak >= 7 ? "text-warning" : "text-muted-foreground" // Gold/Yellow for high streaks
                  )}>
                    <Flame className={cn("w-3 h-3 fill-current", streak >= 7 && "animate-pulse")} />
                    <span>{streak} day streak</span>
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HabitCard;
