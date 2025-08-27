// User related types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isPremium: boolean;
  joinDate: string;
  preferences?: {
    theme: string;
    notifications: boolean;
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
  streak: number;
  currentStreak: number;
  longestStreak: number;
  completedToday: boolean;
  completedDates: string[];
  lastCompleted?: string;
}

// Notification related types
export interface NotificationSettings {
  enabled: boolean;
  reminderTime: string;
  sound: boolean;
  vibration: boolean;
  dailySummary: boolean;
  milestones: boolean;
}

// Theme related types
export interface Theme {
  name: string;
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  backgroundColor: string;
  cardBg?: string;
  accentColor?: string;
  darkMode?: boolean;
  // Adding properties that are used in App.tsx
  bg: string;
  primary: string;
  text: string;
  card: string;
  textSecondary: string;
}

// Export an empty object to ensure this file is treated as a module
export {};
