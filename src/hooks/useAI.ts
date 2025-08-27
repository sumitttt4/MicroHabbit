import { useState, useCallback } from 'react';
import { aiService } from '../services/aiService';
import { loadFromStorage, saveToStorage } from '../utils/helpers';

export const useAI = () => {
  const [aiMessage, setAiMessage] = useState<string>('');
  const [loadingAI, setLoadingAI] = useState<boolean>(false);
  const [suggestedHabits, setSuggestedHabits] = useState<string[]>([]);
  const [weeklyInsight, setWeeklyInsight] = useState<string>('');

  const generateAIMessage = useCallback(async (
    habits: string[], 
    streaks: Record<number, number>, 
    completedToday: Record<number, boolean>, 
    userName?: string
  ) => {
    setLoadingAI(true);
    try {
      const message = await aiService.generateMotivationalMessage(habits, streaks, completedToday, userName);
      setAiMessage(message);
    } catch (error) {
      console.error('Error generating AI message:', error);
      setAiMessage("🌱 Keep growing, you're doing amazing!");
    } finally {
      setLoadingAI(false);
    }
  }, []);

  const generateHabitSuggestions = useCallback(async (currentHabits: string[]) => {
    setLoadingAI(true);
    try {
      const suggestions = await aiService.suggestHabits(currentHabits);
      setSuggestedHabits(suggestions);
    } catch (error) {
      console.error('Error generating habit suggestions:', error);
      setSuggestedHabits(['Drink water', 'Exercise', 'Read', 'Meditate', 'Journal']);
    } finally {
      setLoadingAI(false);
    }
  }, []);

  const generateWeeklyInsight = useCallback(async (weeklyData?: any) => {
    setLoadingAI(true);
    try {
      const insight = await aiService.generateWeeklyInsight(weeklyData);
      setWeeklyInsight(insight);
      saveToStorage('WEEKLY_INSIGHT', insight);
      saveToStorage('LAST_INSIGHT', new Date().toISOString());
    } catch (error) {
      console.error('Error generating weekly insight:', error);
      setWeeklyInsight("📈 Your dedication this week is inspiring!");
    } finally {
      setLoadingAI(false);
    }
  }, []);

  const loadWeeklyInsight = useCallback(() => {
    const savedInsight = loadFromStorage('WEEKLY_INSIGHT');
    if (savedInsight) {
      setWeeklyInsight(savedInsight);
    }
  }, []);

  return {
    aiMessage,
    loadingAI,
    suggestedHabits,
    weeklyInsight,
    generateAIMessage,
    generateHabitSuggestions,
    generateWeeklyInsight,
    loadWeeklyInsight,
    setSuggestedHabits,
  };
};
