import React, { useState } from 'react';
import { Share2, Twitter, Copy, Download, Camera, Trophy, TrendingUp } from 'lucide-react';
import { Habit, HabitProgress } from '../types';

interface SocialSharingProps {
  habits: Habit[];
  habitProgress: Record<string, HabitProgress>;
  theme: any;
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
  theme
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
        title: `${topStreak.streak}-day streak! 🔥`,
        description: `I've been consistent with "${topStreak.habit.name}" for ${topStreak.streak} days straight! Building healthy habits one day at a time.`,
        visual: `${topStreak.habit.emoji}`.repeat(Math.min(topStreak.streak, 10)),
        hashtags: ['habits', 'consistency', 'selfimprovement', 'microhabit']
      });
    }

    // Daily completion
    const todayCompletions = habits.filter(habit => 
      habitProgress[habit.id]?.completedToday
    );

    if (todayCompletions.length > 0) {
      content.push({
        type: 'completion',
        title: `Completed ${todayCompletions.length}/${habits.length} habits today! ✅`,
        description: `Today I completed: ${todayCompletions.map(h => h.name).join(', ')}. Every small step counts!`,
        visual: todayCompletions.map(h => h.emoji).join(''),
        hashtags: ['dailyhabits', 'productivity', 'progress', 'microhabit']
      });
    }

    // Milestone achievements
    const milestoneHabits = habits.filter(habit => {
      const streak = habitProgress[habit.id]?.currentStreak || 0;
      return [7, 30, 100].includes(streak);
    });

    milestoneHabits.forEach(habit => {
      const streak = habitProgress[habit.id]?.currentStreak || 0;
      const milestone = streak === 7 ? 'Week' : streak === 30 ? 'Month' : 'Hundred Days';
      content.push({
        type: 'milestone',
        title: `${milestone} Milestone Unlocked! 🏆`,
        description: `Just hit ${streak} days of "${habit.name}"! ${milestone === 'Week' ? 'The first week is always the hardest!' : milestone === 'Month' ? 'A full month of consistency!' : 'Triple digits - I\'m unstoppable!'}`,
        visual: habit.emoji + '🏆',
        hashtags: ['milestone', 'achievement', 'habits', 'consistency', 'microhabit']
      });
    });

    // Garden overview
    const totalStreaks = Object.values(habitProgress).reduce((sum, p) => sum + (p.currentStreak || 0), 0);
    if (totalStreaks > 0) {
      content.push({
        type: 'garden',
        title: `My Habit Garden is Growing! 🌱`,
        description: `${totalStreaks} total streak days across ${habits.length} habits. My garden: ${habits.map(h => h.emoji).join('')}`,
        visual: '🌱🌿🌸🌳',
        hashtags: ['habitgarden', 'growth', 'selfcare', 'microhabit']
      });
    }

    return content;
  };

  const shareableOptions = generateShareableContent();

  const shareToTwitter = (content: ShareableContent) => {
    const text = `${content.title}\n\n${content.description}\n\n${content.hashtags.map(tag => `#${tag}`).join(' ')}`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const copyToClipboard = async (content: ShareableContent) => {
    const text = `${content.title}\n\n${content.description}\n\n${content.hashtags.map(tag => `#${tag}`).join(' ')}`;
    
    try {
      await navigator.clipboard.writeText(text);
      setCopying(true);
      setTimeout(() => setCopying(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  const shareViaWebShare = async (content: ShareableContent) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: content.title,
          text: content.description,
          url: window.location.href
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };

  const generateProgressImage = (content: ShareableContent) => {
    // This would generate a visual progress card
    // For now, we'll create a simple data URL with text
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    canvas.width = 600;
    canvas.height = 400;
    
    // Background
    ctx.fillStyle = theme.bg || '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Title
    ctx.fillStyle = theme.textPrimary || '#000';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(content.title, canvas.width / 2, 80);
    
    // Visual
    ctx.font = '64px Arial';
    ctx.fillText(content.visual, canvas.width / 2, 200);
    
    // Description
    ctx.fillStyle = theme.textSecondary || '#666';
    ctx.font = '16px Arial';
    const words = content.description.split(' ');
    let line = '';
    let y = 280;
    
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      
      if (testWidth > canvas.width - 40 && n > 0) {
        ctx.fillText(line, canvas.width / 2, y);
        line = words[n] + ' ';
        y += 20;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, canvas.width / 2, y);
    
    // Download the image
    const link = document.createElement('a');
    link.download = `microhabit-${content.type}-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  if (shareableOptions.length === 0) {
    return (
      <div className={`${theme.cardBg || theme.card} p-6 rounded-2xl shadow-lg text-center`}>
        <Share2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className={`text-lg font-bold ${theme.textPrimary || theme.text} mb-2`}>
          Start Building Habits to Share!
        </h3>
        <p className={`${theme.textSecondary}`}>
          Complete some habits and build streaks to unlock shareable achievements.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className={`${theme.cardBg || theme.card} p-6 rounded-2xl shadow-lg`}>
        <div className="flex items-center gap-3 mb-6">
          <Share2 className="text-blue-500" size={24} />
          <h2 className={`text-xl font-bold ${theme.textPrimary || theme.text}`}>
            Share Your Progress
          </h2>
        </div>
        
        <p className={`${theme.textSecondary} mb-6`}>
          Celebrate your achievements and inspire others by sharing your habit journey!
        </p>

        <div className="space-y-4">
          {shareableOptions.map((content, index) => (
            <div
              key={index}
              className={`border border-gray-200 dark:border-gray-700 rounded-xl p-4 ${
                shareContent === content ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="text-3xl">{content.visual}</div>
                
                <div className="flex-1">
                  <h4 className={`font-semibold ${theme.textPrimary || theme.text} mb-1`}>
                    {content.title}
                  </h4>
                  <p className={`text-sm ${theme.textSecondary} mb-2`}>
                    {content.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {content.hashtags.map(tag => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {/* Twitter Share */}
                  <button
                    onClick={() => shareToTwitter(content)}
                    className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                    title="Share on Twitter"
                  >
                    <Twitter className="w-4 h-4" />
                  </button>
                  
                  {/* Copy to Clipboard */}
                  <button
                    onClick={() => copyToClipboard(content)}
                    className={`p-2 rounded-lg transition-colors ${
                      copying 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                    title="Copy to clipboard"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  
                  {/* Web Share API */}
                  {'share' in navigator && (
                    <button
                      onClick={() => shareViaWebShare(content)}
                      className="p-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600 transition-colors"
                      title="Share"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  )}
                  
                  {/* Download Image */}
                  <button
                    onClick={() => generateProgressImage(content)}
                    className="p-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors"
                    title="Download as image"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats for Sharing */}
      <div className={`${theme.cardBg || theme.card} p-6 rounded-2xl shadow-lg`}>
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="text-green-500" size={24} />
          <h3 className={`text-lg font-bold ${theme.textPrimary || theme.text}`}>
            Your Progress Stats
          </h3>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
            <div className="text-2xl font-bold text-green-500">
              {Object.values(habitProgress).reduce((sum, p) => sum + (p.currentStreak || 0), 0)}
            </div>
            <div className={`text-sm ${theme.textSecondary}`}>Total Streak Days</div>
          </div>
          
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <div className="text-2xl font-bold text-blue-500">
              {Math.max(...Object.values(habitProgress).map(p => p.currentStreak || 0), 0)}
            </div>
            <div className={`text-sm ${theme.textSecondary}`}>Longest Current Streak</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
            <div className="text-2xl font-bold text-purple-500">
              {Object.values(habitProgress).reduce((sum, p) => sum + (p.completedDates?.length || 0), 0)}
            </div>
            <div className={`text-sm ${theme.textSecondary}`}>Total Completions</div>
          </div>
          
          <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
            <div className="text-2xl font-bold text-yellow-500">
              {Math.max(...Object.values(habitProgress).map(p => p.longestStreak || 0), 0)}
            </div>
            <div className={`text-sm ${theme.textSecondary}`}>Best Ever Streak</div>
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl">
          <div className={`text-sm ${theme.textPrimary || theme.text} font-medium mb-2`}>
            🎉 Share Your Journey
          </div>
          <p className={`text-sm ${theme.textSecondary}`}>
            Your consistency is inspiring! Share your progress to motivate others and celebrate your achievements.
          </p>
        </div>
      </div>

      {copying && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg">
          ✓ Copied to clipboard!
        </div>
      )}
    </div>
  );
};

export default SocialSharing;
