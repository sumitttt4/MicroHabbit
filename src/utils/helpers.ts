import { PLANT_STAGES, STORAGE_KEYS } from '../config/constants';

/**
 * Get plant stage based on streak count
 */
export const getPlantStage = (streak: number): string => {
  if (streak === 0) return '⚫';
  if (streak <= 3) return PLANT_STAGES[0];
  if (streak <= 7) return PLANT_STAGES[1];
  if (streak <= 14) return PLANT_STAGES[2];
  if (streak <= 30) return PLANT_STAGES[3];
  return PLANT_STAGES[4];
};

/**
 * Save data to localStorage
 */
export const saveToStorage = (key: keyof typeof STORAGE_KEYS, data: any): void => {
  try {
    localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

/**
 * Load data from localStorage
 */
export const loadFromStorage = (key: keyof typeof STORAGE_KEYS): any => {
  try {
    const item = localStorage.getItem(STORAGE_KEYS[key]);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return null;
  }
};

/**
 * Clear all app data from localStorage
 */
export const clearStorage = (): void => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

/**
 * Check if it's a new day and reset daily progress
 */
export const checkNewDay = (): boolean => {
  const today = new Date().toDateString();
  const lastDate = localStorage.getItem(STORAGE_KEYS.LAST_DATE);
  
  if (lastDate !== today) {
    localStorage.setItem(STORAGE_KEYS.LAST_DATE, today);
    localStorage.removeItem(STORAGE_KEYS.LEGACY_COMPLETED);
    return true;
  }
  return false;
};

/**
 * Export user data as JSON
 */
export const exportData = (habits: string[], streaks: Record<number, number>, completedToday: Record<number, boolean>): void => {
  const data = {
    habits,
    streaks,
    completedToday,
    exportDate: new Date().toISOString()
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'microhabit-streaks.json';
  a.click();
  URL.revokeObjectURL(url);
};

/**
 * Trigger celebration animation for habit completion
 */
export const celebrateCompletion = (index: number): void => {
  const element = document.getElementById(`habit-${index}`);
  if (element) {
    element.classList.add('animate-pulse');
    setTimeout(() => element.classList.remove('animate-pulse'), 1000);
  }
};
