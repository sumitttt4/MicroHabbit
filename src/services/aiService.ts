import { AI_CONFIG } from '../config/constants';

class AIService {
  /**
   * Generate motivational message based on user's habits and progress
   */
  async generateMotivationalMessage(
    habits: string[], 
    streaks: Record<number, number>, 
    completedToday: Record<number, boolean>, 
    userName = 'friend'
  ): Promise<string> {
    const completedCount = Object.values(completedToday).filter(Boolean).length;
    const totalCount = habits.length;
    const totalStreaks = Object.values(streaks).reduce((sum, streak) => sum + streak, 0);
    
    const prompt = `You are an encouraging habit coach for MicroHabit app. Generate a short, motivational message (max 15 words) for a user named ${userName}.

Current status:
- Habits: ${habits.join(', ')}
- Completed today: ${completedCount}/${totalCount}
- Individual streaks: ${Object.entries(streaks).map(([i, s]) => `${habits[parseInt(i)]}: ${s} days`).join(', ')}
- Total streak days: ${totalStreaks}

Be encouraging, use emojis, and keep it short and actionable. Focus on progress, not perfection.`;

    try {
      const response = await fetch(AI_CONFIG.API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${AI_CONFIG.API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: AI_CONFIG.MODEL,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 50,
          temperature: 0.7
        })
      });

      const data = await response.json();
      return data.choices[0]?.message?.content || "🌱 Keep growing, you're doing amazing!";
    } catch (error) {
      console.error('AI Error:', error);
      return "🌱 Your consistency is building something beautiful!";
    }
  }

  /**
   * Suggest new habits based on current habits
   */
  async suggestHabits(currentHabits: string[] = []): Promise<string[]> {
    const prompt = `Suggest 5 simple, achievable daily habits for someone using MicroHabit app. They currently have: ${currentHabits.join(', ') || 'none'}.

Requirements:
- Each habit should be 2-4 words max
- Focus on health, productivity, or wellness
- Should take 5-30 minutes daily
- Be specific and actionable
- Avoid duplicating current habits

Format as a JSON array of strings: ["habit1", "habit2", "habit3", "habit4", "habit5"]`;

    try {
      const response = await fetch(AI_CONFIG.API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${AI_CONFIG.API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: AI_CONFIG.MODEL,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 150,
          temperature: 0.8
        })
      });

      const data = await response.json();
      const content = data.choices[0]?.message?.content;
      
      try {
        return JSON.parse(content);
      } catch {
        // Fallback suggestions if JSON parsing fails
        return ['Drink water', 'Walk outside', 'Read 10 pages', 'Meditate 5min', 'Write gratitude'];
      }
    } catch (error) {
      console.error('AI Error:', error);
      return ['Drink water', 'Exercise', 'Read', 'Meditate', 'Journal'];
    }
  }

  /**
   * Generate weekly insight based on user's habit data
   */
  async generateWeeklyInsight(weeklyData: any): Promise<string> {
    const prompt = `Generate a brief weekly insight (max 25 words) for a MicroHabit user based on their week:

${JSON.stringify(weeklyData, null, 2)}

Focus on patterns, improvements, or encouragement. Use emojis and be positive.`;

    try {
      const response = await fetch(AI_CONFIG.API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${AI_CONFIG.API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: AI_CONFIG.MODEL,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 60,
          temperature: 0.7
        })
      });

      const data = await response.json();
      return data.choices[0]?.message?.content || "📈 You're building consistency one day at a time!";
    } catch (error) {
      console.error('AI Error:', error);
      return "📈 Your dedication this week is inspiring!";
    }
  }
}

export const aiService = new AIService();
