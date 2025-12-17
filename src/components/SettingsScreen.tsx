import React from 'react';
import { Crown, Palette, Brain, Lightbulb, MessageCircle, Download, User, LogOut, Sparkles } from 'lucide-react';
import { THEMES } from '../config/constants';
import { User as UserType } from '../types';
import { exportData } from '../utils/helpers';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from './ui/dialog';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';

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

  const handleExportData = () => {
    exportData(habits, streaks, completedToday);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden p-0 flex flex-col">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-2xl font-serif">Settings</DialogTitle>
          <DialogDescription>Manage your account, preferences, and AI features.</DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6 pb-6">
          <div className="space-y-6">

            {/* Premium Status */}
            <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-orange-200 dark:border-orange-800">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full text-white shadow-sm">
                    <Crown className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {user?.isPremium ? 'Premium Plan' : 'Free Plan'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {user?.isPremium ? 'Active since Dec 2024' : 'Unlock full potential'}
                    </p>
                  </div>
                </div>
                {!user?.isPremium && (
                  <Button onClick={onUpgradeToPremium} variant="default" className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 border-none shadow-md">
                    Upgrade
                  </Button>
                )}
              </CardContent>
            </Card>

            <Separator />

            {/* Theme Selection */}
            {user?.isPremium && (
              <div className="space-y-3">
                <h3 className="font-medium flex items-center gap-2">
                  <Palette className="w-4 h-4" /> Theme
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {Object.keys(THEMES).map(themeKey => (
                    <button
                      key={themeKey}
                      onClick={() => onThemeChange(themeKey)}
                      className={`h-20 rounded-lg border-2 flex flex-col items-center justify-center gap-2 transition-all hover:scale-105 ${theme === themeKey ? 'border-primary ring-2 ring-primary/20' : 'border-muted'
                        }`}
                    >
                      <div className={`w-6 h-6 rounded-full border shadow-sm ${THEMES[themeKey].primary.replace('bg-', 'bg-')}`} />
                      <span className="text-xs font-medium capitalize">{themeKey}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* AI Features */}
            {user?.isPremium && (
              <div className="space-y-3">
                <h3 className="font-medium flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-500" /> AI Coach
                </h3>
                <div className="grid gap-2">
                  <Button variant="outline" className="justify-start h-auto py-3" onClick={onGenerateAIMessage} disabled={loadingAI}>
                    <Brain className="w-4 h-4 mr-2 text-muted-foreground" />
                    <div className="flex flex-col items-start text-left">
                      <span className="text-sm font-medium">Get Motivation</span>
                      <span className="text-xs text-muted-foreground">Daily personalized boost</span>
                    </div>
                  </Button>
                  <Button variant="outline" className="justify-start h-auto py-3" onClick={onGenerateWeeklyInsight} disabled={loadingAI}>
                    <MessageCircle className="w-4 h-4 mr-2 text-muted-foreground" />
                    <div className="flex flex-col items-start text-left">
                      <span className="text-sm font-medium">Weekly Insight</span>
                      <span className="text-xs text-muted-foreground">Pattern analysis & tips</span>
                    </div>
                  </Button>
                  <Button variant="outline" className="justify-start h-auto py-3" onClick={onGenerateHabitSuggestions} disabled={loadingAI}>
                    <Lightbulb className="w-4 h-4 mr-2 text-muted-foreground" />
                    <div className="flex flex-col items-start text-left">
                      <span className="text-sm font-medium">Habit Ideas</span>
                      <span className="text-xs text-muted-foreground">Discover new routines</span>
                    </div>
                  </Button>
                </div>

                {/* Display suggested habits */}
                {suggestedHabits.length > 0 && (
                  <div className="p-4 bg-muted/50 rounded-lg border">
                    <p className="text-xs font-semibold mb-2 uppercase text-muted-foreground">Suggestions</p>
                    <div className="flex flex-wrap gap-2">
                      {suggestedHabits.map((suggestion, index) => (
                        <Badge key={index} variant="secondary" className="font-normal">
                          {suggestion}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <Separator />

            {/* Data & Account */}
            <div className="space-y-4">
              {user?.isPremium && (
                <Button variant="outline" className="w-full justify-start" onClick={handleExportData}>
                  <Download className="w-4 h-4 mr-2" /> Export Data
                </Button>
              )}

              <div className="bg-muted/30 p-4 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{user?.name || 'User'}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
                <Button variant="destructive" size="sm" onClick={onLogout}>
                  <LogOut className="w-4 h-4 mr-2" /> Sign Out
                </Button>
              </div>
            </div>

          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsScreen;
