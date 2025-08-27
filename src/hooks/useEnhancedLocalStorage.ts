import { useState, useCallback, useEffect } from 'react';
import { STORAGE_KEYS, DEFAULT_NOTIFICATIONS, APP_CONFIG } from '../config/constants';
import { User, Habit, HabitProgress, NotificationSettings } from '../types';

// Enhanced localStorage hook with better data persistence
export const useEnhancedLocalStorage = () => {
  // State management
  const [user, setUser] = useState<User | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [habitProgress, setHabitProgress] = useState<Record<string, HabitProgress>>({});
  const [theme, setTheme] = useState<string>('default');
  const [notifications, setNotifications] = useState<NotificationSettings>(DEFAULT_NOTIFICATIONS);

  // Utility functions
  const saveToStorage = useCallback((key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, []);

  const loadFromStorage = useCallback((key: string, defaultValue: any = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return defaultValue;
    }
  }, []);

  // Data migration from old format
  const migrateData = useCallback(() => {
    const legacyHabits = loadFromStorage(STORAGE_KEYS.LEGACY_HABITS, []);
    const legacyStreaks = loadFromStorage(STORAGE_KEYS.LEGACY_STREAKS, {});
    const legacyCompleted = loadFromStorage(STORAGE_KEYS.LEGACY_COMPLETED, {});
    const legacyDates = loadFromStorage(STORAGE_KEYS.LEGACY_DATES, {});

    if (legacyHabits.length > 0) {
      // Convert old format to new format
      const newHabits: Habit[] = legacyHabits.map((name: string, index: number) => ({
        id: `habit_${Date.now()}_${index}`,
        name,
        description: '',
        emoji: '🎯',
        category: 'Other',
        difficulty: 'Medium' as const,
        isActive: true,
        createdAt: new Date().toISOString()
      }));

      const newProgress: Record<string, HabitProgress> = {};
      newHabits.forEach((habit, index) => {
        const streak = legacyStreaks[index] || 0;
        const completedToday = legacyCompleted[index] || false;
        const lastDate = legacyDates[index];
        
        newProgress[habit.id] = {
          habitId: habit.id,
          completedDates: lastDate ? [lastDate] : [],
          currentStreak: streak,
          longestStreak: streak,
          completedToday,
          lastCompletedDate: lastDate
        };
      });

      // Save in new format
      saveToStorage(STORAGE_KEYS.HABITS, newHabits);
      saveToStorage(STORAGE_KEYS.HABIT_PROGRESS, newProgress);

      // Clear old data
      localStorage.removeItem(STORAGE_KEYS.LEGACY_HABITS);
      localStorage.removeItem(STORAGE_KEYS.LEGACY_STREAKS);
      localStorage.removeItem(STORAGE_KEYS.LEGACY_COMPLETED);
      localStorage.removeItem(STORAGE_KEYS.LEGACY_DATES);

      console.log('Data migrated to new format');
      return { newHabits, newProgress };
    }

    return null;
  }, [loadFromStorage, saveToStorage]);

  // Initialize data on component mount
  useEffect(() => {
    // Load user data
    const savedUser = loadFromStorage(STORAGE_KEYS.USER);
    if (savedUser) setUser(savedUser);

    // Load theme
    const savedTheme = loadFromStorage(STORAGE_KEYS.THEME, 'default');
    setTheme(savedTheme);

    // Load notifications
    const savedNotifications = loadFromStorage(STORAGE_KEYS.NOTIFICATIONS, DEFAULT_NOTIFICATIONS);
    setNotifications(savedNotifications);

    // Try to migrate old data first
    const migrationResult = migrateData();
    
    if (migrationResult) {
      setHabits(migrationResult.newHabits);
      setHabitProgress(migrationResult.newProgress);
    } else {
      // Load new format data
      const savedHabits = loadFromStorage(STORAGE_KEYS.HABITS, []);
      const savedProgress = loadFromStorage(STORAGE_KEYS.HABIT_PROGRESS, {});
      
      setHabits(savedHabits);
      setHabitProgress(savedProgress);
    }

    // Check and update app version
    const currentVersion = loadFromStorage(STORAGE_KEYS.APP_VERSION);
    if (currentVersion !== APP_CONFIG.VERSION) {
      saveToStorage(STORAGE_KEYS.APP_VERSION, APP_CONFIG.VERSION);
      console.log(`App updated to version ${APP_CONFIG.VERSION}`);
    }
  }, [loadFromStorage, migrateData, saveToStorage]);

  // User management
  const updateUser = useCallback((newUser: User) => {
    setUser(newUser);
    saveToStorage(STORAGE_KEYS.USER, newUser);
  }, [saveToStorage]);

  // Habit management
  const updateHabits = useCallback((newHabits: Habit[]) => {
    setHabits(newHabits);
    saveToStorage(STORAGE_KEYS.HABITS, newHabits);
  }, [saveToStorage]);

  const addHabit = useCallback((habit: Habit) => {
    const newHabits = [...habits, habit];
    updateHabits(newHabits);
    
    // Initialize progress for new habit
    const newProgress = {
      ...habitProgress,
      [habit.id]: {
        habitId: habit.id,
        completedDates: [],
        currentStreak: 0,
        longestStreak: 0,
        completedToday: false
      }
    };
    setHabitProgress(newProgress);
    saveToStorage(STORAGE_KEYS.HABIT_PROGRESS, newProgress);
  }, [habits, habitProgress, updateHabits, saveToStorage]);

  const updateHabit = useCallback((updatedHabit: Habit) => {
    const newHabits = habits.map(habit => 
      habit.id === updatedHabit.id ? updatedHabit : habit
    );
    updateHabits(newHabits);
  }, [habits, updateHabits]);

  const deleteHabit = useCallback((habitId: string) => {
    const newHabits = habits.filter(habit => habit.id !== habitId);
    updateHabits(newHabits);
    
    const newProgress = { ...habitProgress };
    delete newProgress[habitId];
    setHabitProgress(newProgress);
    saveToStorage(STORAGE_KEYS.HABIT_PROGRESS, newProgress);
  }, [habits, habitProgress, updateHabits, saveToStorage]);

  // Progress management
  const updateHabitProgress = useCallback((habitId: string, progress: Partial<HabitProgress>) => {
    const newProgress = {
      ...habitProgress,
      [habitId]: {
        ...habitProgress[habitId],
        ...progress
      }
    };
    setHabitProgress(newProgress);
    saveToStorage(STORAGE_KEYS.HABIT_PROGRESS, newProgress);
  }, [habitProgress, saveToStorage]);

  const completeHabit = useCallback((habitId: string) => {
    const today = new Date().toDateString();
    const currentProgress = habitProgress[habitId];
    
    if (!currentProgress || currentProgress.completedToday) return;

    const completedDates = [...(currentProgress.completedDates || []), today];
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    
    // Calculate new streak
    let newStreak = 1;
    if (currentProgress.lastCompletedDate === yesterday) {
      newStreak = (currentProgress.currentStreak || 0) + 1;
    }
    
    const longestStreak = Math.max(newStreak, currentProgress.longestStreak || 0);

    updateHabitProgress(habitId, {
      completedDates,
      currentStreak: newStreak,
      longestStreak,
      completedToday: true,
      lastCompletedDate: today
    });
  }, [habitProgress, updateHabitProgress]);

  const uncompleteHabit = useCallback((habitId: string) => {
    const today = new Date().toDateString();
    const currentProgress = habitProgress[habitId];
    
    if (!currentProgress || !currentProgress.completedToday) return;

    const completedDates = currentProgress.completedDates.filter((date: string) => date !== today);
    
    updateHabitProgress(habitId, {
      completedDates,
      currentStreak: Math.max(0, (currentProgress.currentStreak || 1) - 1),
      completedToday: false,
      lastCompletedDate: completedDates[completedDates.length - 1] || undefined
    });
  }, [habitProgress, updateHabitProgress]);

  // Theme management
  const updateTheme = useCallback((newTheme: string) => {
    setTheme(newTheme);
    saveToStorage(STORAGE_KEYS.THEME, newTheme);
  }, [saveToStorage]);

  // Notification management
  const updateNotifications = useCallback((newNotifications: NotificationSettings) => {
    setNotifications(newNotifications);
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, newNotifications);
  }, [saveToStorage]);

  // Reset daily progress
  const resetDailyProgress = useCallback(() => {
    const newProgress = { ...habitProgress };
    Object.keys(newProgress).forEach(habitId => {
      newProgress[habitId] = {
        ...newProgress[habitId],
        completedToday: false
      };
    });
    setHabitProgress(newProgress);
    saveToStorage(STORAGE_KEYS.HABIT_PROGRESS, newProgress);
  }, [habitProgress, saveToStorage]);

  // Clear all data
  const clearAllData = useCallback(() => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
    setUser(null);
    setHabits([]);
    setHabitProgress({});
    setTheme('default');
    setNotifications(DEFAULT_NOTIFICATIONS);
  }, []);

  // Export/Import data
  const exportData = useCallback(() => {
    const data = {
      user,
      habits,
      habitProgress,
      theme,
      notifications,
      exportDate: new Date().toISOString(),
      version: APP_CONFIG.VERSION
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `microhabit-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [user, habits, habitProgress, theme, notifications]);

  const importData = useCallback((jsonData: string) => {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.habits) setHabits(data.habits);
      if (data.habitProgress) setHabitProgress(data.habitProgress);
      if (data.user) setUser(data.user);
      if (data.theme) setTheme(data.theme);
      if (data.notifications) setNotifications(data.notifications);
      
      // Save to localStorage
      if (data.habits) saveToStorage(STORAGE_KEYS.HABITS, data.habits);
      if (data.habitProgress) saveToStorage(STORAGE_KEYS.HABIT_PROGRESS, data.habitProgress);
      if (data.user) saveToStorage(STORAGE_KEYS.USER, data.user);
      if (data.theme) saveToStorage(STORAGE_KEYS.THEME, data.theme);
      if (data.notifications) saveToStorage(STORAGE_KEYS.NOTIFICATIONS, data.notifications);
      
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }, [saveToStorage]);

  return {
    // State
    user,
    habits,
    habitProgress,
    theme,
    notifications,
    
    // User management
    updateUser,
    
    // Habit management
    updateHabits,
    addHabit,
    updateHabit,
    deleteHabit,
    
    // Progress management
    updateHabitProgress,
    completeHabit,
    uncompleteHabit,
    resetDailyProgress,
    
    // Settings
    updateTheme,
    updateNotifications,
    
    // Utilities
    clearAllData,
    exportData,
    importData,
    
    // Legacy compatibility (for components that still use old format)
    completedToday: Object.fromEntries(
      habits.map((habit, index) => [index, habitProgress[habit.id]?.completedToday || false])
    ),
    streaks: Object.fromEntries(
      habits.map((habit, index) => [index, habitProgress[habit.id]?.currentStreak || 0])
    ),
    lastCompletedDate: Object.fromEntries(
      habits.map((habit, index) => [index, habitProgress[habit.id]?.lastCompletedDate || ''])
    )
  };
};
