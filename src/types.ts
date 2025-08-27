// User related types
export interface User {
  id: string | number;
  name?: string;
  email: string;
  avatar?: string;
  isPremium: boolean;
  joinDate?: string;
  preferences?: {
    theme?: string;
    notifications?: boolean;
    [key: string]: any;
  };
}

// Habit related types
export interface Habit {
  id: string;
  name: string;
  description?: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  emoji?: string;
  color?: string;
  createdAt: string;
  reminderTime?: string;
  notes?: string;
  tags?: string[];
  isActive?: boolean;
}

export interface HabitProgress {
  habitId: string;
  streak?: number;
  currentStreak: number;
  longestStreak: number;
  completedToday: boolean;
  completedDates: string[];
  // keep name consistent with codebase
  lastCompletedDate?: string;
}

// Notification related types
export interface NotificationSettings {
  enabled: boolean;
  dailyReminder: boolean;
  streakReminder: boolean;
  motivationalMessage: boolean;
  reminderTime: string;
  sound: boolean;
  vibration: boolean;
  dailySummary: boolean;
  milestones: boolean;
}

// Theme related types
export interface Theme {
  // friendly labels (optional for backward compatibility)
  name?: string;
  primaryColor?: string;
  secondaryColor?: string;
  textColor?: string;
  backgroundColor?: string;
  cardBg?: string;
  accentColor?: string;
  darkMode?: boolean;

  // minimal css-class style theme keys used across the app
  bg: string;
  card: string;
  primary: string;
  primaryHover: string;
  text: string;
  textSecondary: string;
}

// Export an empty object to ensure this file is treated as a module
export {};
