import React, { useState } from 'react';
import { Share2, Twitter, Copy, Download, TrendingUp } from 'lucide-react';
import { Habit, HabitProgress } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

interface SocialSharingProps {
  habits: Habit[];
  habitProgress: Record<string, HabitProgress>;
  theme?: any;
}

interface ShareableContent {
  type: 'streak' | 'completion' | 'milestone' | 'garden';
  title: string;
  description: string;
  visual: string;
  hashtags: string[];
}

const SocialSharing: React.FC<SocialSharingProps> = ({
  habits,
  habitProgress,
}) => {
  const [shareContent, setShareContent] = useState<ShareableContent | null>(null);
  const [copying, setCopying] = useState(false);

  // Generate shareable content based on user progress
  const generateShareableContent = (): ShareableContent[] => {
    const content: ShareableContent[] = [];

    // Best streaks
    const bestStreaks = habits
      .map(habit => ({
        habit,
        streak: habitProgress[habit.id]?.currentStreak || 0
      }))
      .filter(item => item.streak > 0)
      .sort((a, b) => b.streak - a.streak)
      .slice(0, 3);

    if (bestStreaks.length > 0) {
      const topStreak = bestStreaks[0];
      content.push({
        type: 'streak',
        title: `${topStreak.streak} Day Streak! 🔥`,
        description: `Consistent with ${topStreak.habit.name} for ${topStreak.streak} days.`,
        visual: `${topStreak.habit.emoji}`.repeat(Math.min(topStreak.streak, 5)),
        hashtags: ['microhabit', 'consistency']
      });
    }

    // Daily completion
    const todayCompletions = habits.filter(habit =>
      habitProgress[habit.id]?.completedToday
    );

    if (todayCompletions.length > 0) {
      content.push({
        type: 'completion',
        title: `Day Complete ✅`,
        description: `Finished ${todayCompletions.length} habits today.`,
        visual: todayCompletions.map(h => h.emoji).join(' '),
        hashtags: ['dailywins', 'microhabit']
      });
    }

    // Garden overview
    const totalStreaks = Object.values(habitProgress).reduce((sum, p) => sum + (p.currentStreak || 0), 0);
    if (totalStreaks > 0) {
      content.push({
        type: 'garden',
        title: `My Garden is Growing 🌱`,
        description: `${totalStreaks} total growth days across ${habits.length} habits.`,
        visual: '🌱🌿🌻',
        hashtags: ['growth', 'microhabit']
      });
    }

    return content;
  };

  const shareableOptions = generateShareableContent();

  const shareToTwitter = (content: ShareableContent) => {
    const text = `${content.title}\n${content.description}\n\n${content.hashtags.map(tag => `#${tag}`).join(' ')}`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const copyToClipboard = async (content: ShareableContent) => {
    const text = `${content.title}\n${content.description}\n\n${content.hashtags.map(tag => `#${tag}`).join(' ')}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopying(true);
      setTimeout(() => setCopying(false), 2000);
    } catch (error) {
      console.error('Failed to copy', error);
    }
  };

  if (shareableOptions.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <Share2 className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold mb-2">Build Habits to Share</h3>
          <p className="text-muted-foreground">Complete habits to unlock shareable cards.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">

      <div className="grid gap-4">
        {shareableOptions.map((content, index) => (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col sm:flex-row">
                {/* Visual Left */}
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-6 flex items-center justify-center sm:w-1/3 min-h-[120px]">
                  <span className="text-4xl">{content.visual}</span>
                </div>

                {/* Content Right */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-serif font-bold text-lg mb-1">{content.title}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{content.description}</p>
                    <div className="flex gap-2 mb-4">
                      {content.hashtags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs font-normal">#{tag}</Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => shareToTwitter(content)} className="bg-sky-500 hover:bg-sky-600 text-white border-none">
                      <Twitter className="w-4 h-4 mr-2" /> Tweet
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => copyToClipboard(content)}>
                      {copying ? 'Copied!' : <><Copy className="w-4 h-4 mr-2" /> Copy</>}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

    </div>
  );
};

export default SocialSharing;
