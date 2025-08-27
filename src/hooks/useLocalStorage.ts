import { useState, useEffect } from 'react';
import { User } from '../types';
import { loadFromStorage, saveToStorage, clearStorage } from '../utils/helpers';

export const useLocalStorage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [habits, setHabits] = useState<string[]>([]);
  const [theme, setTheme] = useState<string>('default');
  const [completedToday, setCompletedToday] = useState<Record<number, boolean>>({});
  const [streaks, setStreaks] = useState<Record<number, number>>({});
  const [lastCompletedDate, setLastCompletedDate] = useState<Record<number, string>>({});

  // Load data from localStorage on mount
  useEffect(() => {
    const savedUser = loadFromStorage('USER');
    const savedHabits = loadFromStorage('LEGACY_HABITS');
    const savedStreaks = loadFromStorage('LEGACY_STREAKS');
    const savedCompleted = loadFromStorage('LEGACY_COMPLETED');
    const savedDates = loadFromStorage('LEGACY_DATES');
    const savedTheme = loadFromStorage('THEME');

    if (savedUser) setUser(savedUser);
    if (savedHabits) setHabits(savedHabits);
    if (savedStreaks) setStreaks(savedStreaks);
    if (savedCompleted) setCompletedToday(savedCompleted);
    if (savedDates) setLastCompletedDate(savedDates);
    if (savedTheme) setTheme(savedTheme);
  }, []);

  const updateUser = (userData: User | null) => {
    setUser(userData);
    if (userData) {
      saveToStorage('USER', userData);
    }
  };

  const updateHabits = (newHabits: string[]) => {
    setHabits(newHabits);
    saveToStorage('LEGACY_HABITS', newHabits);
  };

  const updateTheme = (newTheme: string) => {
    setTheme(newTheme);
    saveToStorage('THEME', newTheme);
  };

  const updateCompletedToday = (completed: Record<number, boolean>) => {
    setCompletedToday(completed);
    saveToStorage('LEGACY_COMPLETED', completed);
  };

  const updateStreaks = (newStreaks: Record<number, number>) => {
    setStreaks(newStreaks);
    saveToStorage('LEGACY_STREAKS', newStreaks);
  };

  const updateLastCompletedDate = (dates: Record<number, string>) => {
    setLastCompletedDate(dates);
    saveToStorage('LEGACY_DATES', dates);
  };

  const clearAllData = () => {
    clearStorage();
    setUser(null);
    setHabits([]);
    setTheme('default');
    setCompletedToday({});
    setStreaks({});
    setLastCompletedDate({});
  };

  return {
    user,
    habits,
    theme,
    completedToday,
    streaks,
    lastCompletedDate,
    updateUser,
    updateHabits,
    updateTheme,
    updateCompletedToday,
    updateStreaks,
    updateLastCompletedDate,
    clearAllData,
  };
};
