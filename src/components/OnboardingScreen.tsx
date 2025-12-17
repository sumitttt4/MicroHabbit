import React, { useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { cn } from '../lib/utils';

interface OnboardingScreenProps {
  onComplete: (habits: string[]) => void;
  suggestedHabits: string[];
  onGenerateSuggestions: () => void;
  loadingAI: boolean;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  onComplete,
  suggestedHabits,
  onGenerateSuggestions,
  loadingAI
}) => {
  const [newHabits, setNewHabits] = useState<string[]>([
    'Read for 15 minutes',
    'Drink 5 glasses of water',
    'Take a 10 minute walk'
  ]);

  const handleHabitChange = (index: number, value: string) => {
    const updated = [...newHabits];
    updated[index] = value;
    setNewHabits(updated);
  };

  const finishOnboarding = () => {
    const validHabits = newHabits.filter(h => h.trim() !== '');
    if (validHabits.length > 0) {
      onComplete(validHabits);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4 animate-in fade-in duration-500">
      <div className="w-full max-w-md space-y-4">

        {/* Step indicators (Minimal) */}
        <div className="flex justify-center gap-2 mb-8">
          <div className="h-1 w-8 rounded-full bg-primary/20"></div>
          <div className="h-1 w-8 rounded-full bg-primary"></div>
          <div className="h-1 w-8 rounded-full bg-primary/20"></div>
        </div>

        <Card className="border-border/40 shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-serif text-center">Start small</CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              Define three simple habits to start your journey.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {newHabits.map((habit, index) => (
              <div key={index} className="grid gap-2">
                <Input
                  type="text"
                  value={habit}
                  onChange={(e) => handleHabitChange(index, e.target.value)}
                  placeholder={`Habit ${index + 1}`}
                  className="bg-muted/30"
                />
              </div>
            ))}

            <div className="pt-4 pb-2">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Quick ideas</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {['Read 15 mins', 'Drink Water', 'Walk', 'Meditate'].map((idea) => (
                  <Button
                    key={idea}
                    variant="outline"
                    size="sm"
                    className="justify-start h-auto py-2 px-3 text-xs font-normal"
                    onClick={() => handleHabitChange(newHabits.findIndex(h => h.trim() === '') !== -1 ? newHabits.findIndex(h => h.trim() === '') : 2, idea)}
                  >
                    {idea}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full font-sans" onClick={finishOnboarding} size="lg">
              Start my journey <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default OnboardingScreen;
