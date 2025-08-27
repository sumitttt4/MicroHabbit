export interface User {
  id: number;
  email: string;
  isPremium: boolean;
  name?: string;
  avatar?: string;
}

export interface Habit {
  id: string;
  name: string;
  description?: string;
  emoji: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  reminderTime?: string;
  isActive: boolean;
  createdAt: string;
  targetDays?: number;
  notes?: string;
}

export interface HabitProgress {
  habitId: string;
  completedDates: string[];
  currentStreak: number;
  longestStreak: number;
  completedToday: boolean;
  lastCompletedDate?: string;
}

export interface Theme {
  bg: string;
  card: string;
  primary: string;
  primaryHover: string;
  text: string;
  textSecondary: string;
  buttonPrimary?: string;
  buttonSecondary?: string;
  cardBg?: string;
  cardBorder?: string;
  textPrimary?: string;
}

export interface AppState {
  currentView: 'splash' | 'auth' | 'onboarding' | 'dashboard' | 'settings' | 'calendar' | 'analytics';
  user: User | null;
  habits: Habit[];
  habitProgress: Record<string, HabitProgress>;
  theme: string;
  notifications: NotificationSettings;
}

export interface NotificationSettings {
  enabled: boolean;
  dailyReminder: boolean;
  streakReminder: boolean;
  motivationalMessage: boolean;
  reminderTime: string;
}

export interface AuthState {
  authMode: 'login' | 'signup';
  email: string;
  password: string;
  loading: boolean;
  showPassword: boolean;
}

export interface OnboardingState {
  newHabits: Habit[];
  suggestedHabits: string[];
}

export interface AIState {
  aiMessage: string;
  loadingAI: boolean;
  weeklyInsight: string;
  showAIChat: boolean;
}

export interface AnalyticsData {
  weeklyProgress: number[];
  monthlyCompletion: Record<string, number>;
  streakHistory: Record<string, number[]>;
  bestPerformingHabits: string[];
  strugglingHabits: string[];
}

export type ViewType = 'splash' | 'auth' | 'onboarding' | 'dashboard' | 'settings' | 'calendar' | 'analytics';
