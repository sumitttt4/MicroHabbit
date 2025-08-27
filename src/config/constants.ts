import { Theme } from '../types';

// OpenRouter AI Configuration
export const AI_CONFIG = {
  API_KEY: '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', // Replace with your actual API key
  API_URL: 'https://openrouter.ai/api/v1/chat/completions',
  MODEL: 'microsoft/wizardlm-2-8x22b',
};

// Plant growth stages
export const PLANT_STAGES = ['🌱', '🌿', '🍀', '🌳', '🌲'];

// Theme configurations - Minimal, warm, human-centered design
export const THEMES: Record<string, Theme> = {
  default: {
    bg: 'bg-stone-50',
    card: 'bg-white',
    primary: 'bg-orange-500',
    primaryHover: 'hover:bg-orange-600',
    text: 'text-stone-900',
    textSecondary: 'text-stone-600'
  },
  dark: {
    bg: 'bg-stone-900',
    card: 'bg-stone-800',
    primary: 'bg-orange-500',
    primaryHover: 'hover:bg-orange-600',
    text: 'text-stone-100',
    textSecondary: 'text-stone-400'
  }
};

// Storage keys
export const STORAGE_KEYS = {
  USER: 'microhabit_user',
  HABITS: 'microhabit_habits_v2',
  HABIT_PROGRESS: 'microhabit_progress_v2',
  THEME: 'microhabit_theme',
  LAST_DATE: 'microhabit_last_date',
  LAST_INSIGHT: 'microhabit_last_insight',
  WEEKLY_INSIGHT: 'microhabit_weekly_insight',
  NOTIFICATIONS: 'microhabit_notifications',
  ANALYTICS: 'microhabit_analytics',
  APP_VERSION: 'microhabit_version',
  
  // Legacy keys for migration
  LEGACY_HABITS: 'microhabit_habits',
  LEGACY_STREAKS: 'microhabit_streaks',
  LEGACY_COMPLETED: 'microhabit_completed',
  LEGACY_DATES: 'microhabit_dates',
};

// Default notification settings
export const DEFAULT_NOTIFICATIONS = {
  enabled: false,
  dailyReminder: true,
  streakReminder: true,
  motivationalMessage: false,
  reminderTime: '09:00',
  sound: true,
  vibration: true,
  dailySummary: false,
  milestones: true
};


// App configuration
export const APP_CONFIG = {
  VERSION: '2.0.0',
  MAX_HABITS: 10,
  MIN_HABIT_NAME_LENGTH: 2,
  MAX_HABIT_NAME_LENGTH: 50,
  MAX_DESCRIPTION_LENGTH: 200,
  BACKUP_INTERVAL_DAYS: 7,
  ANALYTICS_RETENTION_DAYS: 90
};
