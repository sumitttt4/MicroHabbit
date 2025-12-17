import React from 'react';
import { Crown, Sparkles, Zap, Check } from 'lucide-react';
import { User } from '../types';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';

interface PremiumCTAProps {
  user: User | null;
  onUpgrade: () => void;
}

const PremiumCTA: React.FC<PremiumCTAProps> = ({ user, onUpgrade }) => {
  if (user?.isPremium) {
    return (
      <Card className="bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 border-amber-200 dark:border-amber-800">
        <CardContent className="p-6 flex items-center gap-4">
          <div className="bg-gradient-to-br from-amber-400 to-orange-500 p-2 rounded-full shadow-md">
            <Crown className="text-white w-6 h-6" />
          </div>
          <div>
            <p className="font-bold text-lg text-amber-900 dark:text-amber-100">Premium Member</p>
            <p className="text-sm text-amber-800/80 dark:text-amber-200/80">You have access to all features.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden border-primary/20 bg-primary/5">
      <div className="absolute top-0 right-0 p-4 opacity-50">
        <Sparkles className="w-24 h-24 text-primary/10" />
      </div>

      <CardContent className="p-8 text-center relative z-10">
        <div className="inline-flex p-3 bg-primary/10 rounded-full mb-4">
          <Crown className="w-8 h-8 text-primary" />
        </div>

        <h2 className="text-2xl font-serif font-bold mb-2">Unlock Full Potential</h2>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Get AI coaching, unlimited habits, advanced analytics, and custom themes to accelerate your growth.
        </p>

        <div className="grid grid-cols-2 gap-3 mb-8 max-w-sm mx-auto text-left text-sm">
          <div className="flex gap-2">
            <Check className="w-4 h-4 text-green-500 shrink-0" /> <span>AI Motivation</span>
          </div>
          <div className="flex gap-2">
            <Check className="w-4 h-4 text-green-500 shrink-0" /> <span>Weekly Insights</span>
          </div>
          <div className="flex gap-2">
            <Check className="w-4 h-4 text-green-500 shrink-0" /> <span>Unlimited Habits</span>
          </div>
          <div className="flex gap-2">
            <Check className="w-4 h-4 text-green-500 shrink-0" /> <span>Data Export</span>
          </div>
        </div>

        <Button size="lg" onClick={onUpgrade} className="w-full max-w-sm shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all">
          <Zap className="w-4 h-4 mr-2 fill-current" /> Go Premium - $2.99
        </Button>
        <p className="text-xs text-muted-foreground mt-4">7-day free trial, cancel anytime.</p>
      </CardContent>
    </Card>
  );
};

export default PremiumCTA;
