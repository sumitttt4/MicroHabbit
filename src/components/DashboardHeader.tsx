import React from 'react';
import { Settings, Sparkles } from 'lucide-react';
import { User } from '../types';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Progress } from './ui/progress'; // We need this
import { cn } from '../lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu" // We need this too

interface DashboardHeaderProps {
  user: User | null;
  completedCount: number;
  totalHabits: number;
  aiMessage: string;
  weeklyInsight: string;
  loadingAI: boolean;
  theme?: any;
  onSettingsClick: () => void;
  onGenerateAIMessage: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  user,
  completedCount,
  totalHabits,
  aiMessage,
  loadingAI,
  onSettingsClick,
  onGenerateAIMessage,
}) => {
  const getMotivationalMessage = () => {
    if (aiMessage && user?.isPremium) {
      return aiMessage;
    }

    if (totalHabits === 0) return "Ready to start?";
    if (completedCount === 0) return "Each step counts.";
    if (completedCount === totalHabits) return "All done today!";
    return `${completedCount} of ${totalHabits} completed.`;
  };

  const progressPercentage = totalHabits ? (completedCount / totalHabits) * 100 : 0;

  return (
    <div className="space-y-4 mb-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">
            {user?.name ? `Hello, ${user.name}` : 'Welcome back'}
          </h1>
          <p className="text-sm text-muted-foreground font-sans">
            let's make today count.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {user?.isPremium && (
            <Button
              variant="ghost"
              size="icon"
              className="text-primary hover:bg-primary/10"
              onClick={onGenerateAIMessage}
              disabled={loadingAI}
            >
              <Sparkles className={cn("w-5 h-5", loadingAI && "animate-spin text-muted-foreground")} />
            </Button>
          )}

          <Button variant="ghost" size="icon" onClick={onSettingsClick}>
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Motivational & Progress */}
      <Card className="bg-primary/5 border-none shadow-sm">
        <CardContent className="p-4 flex flex-col gap-3">
          <div className="flex justify-between items-center text-sm font-medium">
            <span className="text-primary/90 font-serif italic text-base">"{getMotivationalMessage()}"</span>
            <span className="text-xs text-muted-foreground font-sans">{Math.round(progressPercentage)}%</span>
          </div>

          <Progress value={progressPercentage} className="h-1.5" />
        </CardContent>
      </Card>

    </div>
  );
};

export default DashboardHeader;
