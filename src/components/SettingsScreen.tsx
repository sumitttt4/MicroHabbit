import React from 'react';
import { Crown, Palette, Brain, Lightbulb, MessageCircle, Download, User, Trash2, Sparkles } from 'lucide-react';
import { THEMES } from '../config/constants';
import { User as UserType } from '../types';
import { exportData } from '../utils/helpers';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle,
} from './ui/dialog';
import { Card, CardContent } from './ui/card';
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
  onLogout: () => void; // Used for "Reset Data" now
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
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-hidden p-0 flex flex-col bg-white">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl font-bold tracking-tight">Settings</DialogTitle>
          <DialogDescription>Preferences and personal data.</DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6 pb-6">
          <div className="space-y-8 mt-2">

            {/* Simpler Premium Status - always on for local */}
            <div className="flex items-center gap-4 p-4 border rounded-lg bg-gray-50/50">
              <div className="p-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg text-white shadow-sm">
                <Crown className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Premium Active</p>
                <p className="text-xs text-gray-500">Local Mode Unlocked</p>
              </div>
            </div>

            {/* AI Features */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold flex items-center gap-2 text-gray-900">
                <Sparkles className="w-4 h-4 text-purple-600" /> AI Coach
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Button variant="outline" className="h-auto py-4 px-3 flex flex-col items-start gap-2 hover:border-black/20 hover:bg-gray-50" onClick={onGenerateAIMessage} disabled={loadingAI}>
                  <Brain className="w-5 h-5 text-gray-600" />
                  <div className="text-left">
                    <span className="block text-sm font-medium">Motivation</span>
                    <span className="text-[10px] text-gray-400 font-normal">Daily boost</span>
                  </div>
                </Button>
                <Button variant="outline" className="h-auto py-4 px-3 flex flex-col items-start gap-2 hover:border-black/20 hover:bg-gray-50" onClick={onGenerateWeeklyInsight} disabled={loadingAI}>
                  <MessageCircle className="w-5 h-5 text-gray-600" />
                  <div className="text-left">
                    <span className="block text-sm font-medium">Insights</span>
                    <span className="text-[10px] text-gray-400 font-normal">Analysis</span>
                  </div>
                </Button>
                <Button variant="outline" className="h-auto py-4 px-3 flex flex-col items-start gap-2 hover:border-black/20 hover:bg-gray-50" onClick={onGenerateHabitSuggestions} disabled={loadingAI}>
                  <Lightbulb className="w-5 h-5 text-gray-600" />
                  <div className="text-left">
                    <span className="block text-sm font-medium">Ideas</span>
                    <span className="text-[10px] text-gray-400 font-normal">New habits</span>
                  </div>
                </Button>
              </div>

              {suggestedHabits.length > 0 && (
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-xs font-semibold mb-2 uppercase text-gray-500">Suggestions</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedHabits.map((suggestion, index) => (
                      <Badge key={index} variant="secondary" className="font-normal bg-white border shadow-sm">
                        {suggestion}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Data & Account */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900">Data Management</h3>
              <div className="grid gap-3">
                <Button variant="outline" className="w-full justify-start h-10" onClick={handleExportData}>
                  <Download className="w-4 h-4 mr-2" /> Export Data
                </Button>

                <div className="bg-red-50 p-4 rounded-lg flex items-center justify-between border border-red-100 mt-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-red-900">Reset Application</p>
                      <p className="text-xs text-red-600/80">Clear all data and start over</p>
                    </div>
                  </div>
                  <Button variant="destructive" size="sm" onClick={onLogout} className="bg-red-600 hover:bg-red-700">
                    Reset
                  </Button>
                </div>
              </div>
            </div>

          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsScreen;
