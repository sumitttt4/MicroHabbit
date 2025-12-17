import React, { useState, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';
import AuthScreen from './components/AuthScreen';
import OnboardingScreen from './components/OnboardingScreen';
import DashboardHeader from './components/DashboardHeader';
import Dashboard from './components/Dashboard';
import GardenView from './components/GardenView';
import CalendarView from './components/CalendarView';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import SocialSharing from './components/SocialSharing';
import SettingsScreen from './components/SettingsScreen';
import HabitEditor from './components/HabitEditor';
import NotificationSettings from './components/NotificationSettings';
import JournalScreen from './components/JournalScreen'; // Import JournalScreen
import ErrorBoundary from './components/ErrorBoundary';
import { LoadingOverlay } from './components/LoadingComponents';
import { useEnhancedLocalStorage } from './hooks/useEnhancedLocalStorage';
import { useAI } from './hooks/useAI';
import { THEMES } from './config/constants';
import { User, Habit } from './types';
import { authService } from './services/authService';
import { notificationService } from './services/notificationService';
import { checkNewDay } from './utils/helpers';
import { Home, Sprout, Calendar, BarChart3, Share2, Settings, Plus, Book, BookOpen } from 'lucide-react';

import PhoneFrame from './components/PhoneFrame';

// ✅ Correct type export (isolatedModules safe)
export type ViewType = 'splash' | 'auth' | 'onboarding' | 'dashboard' | 'settings';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('splash');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'garden' | 'calendar' | 'analytics' | 'social' | 'journal'>('dashboard');
  const [showHabitEditor, setShowHabitEditor] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  // Enhanced storage hook
  const {
    user,
    habits,
    habitProgress,
    theme,
    notifications,
    updateUser,
    addHabit,
    updateHabit,
    deleteHabit,
    completeHabit,
    uncompleteHabit,
    updateTheme,
    updateNotifications,
    resetDailyProgress,
    clearAllData,
    exportData,
    completedToday,
    streaks,
    lastCompletedDate
  } = useEnhancedLocalStorage();

  // AI hook
  const {
    aiMessage,
    loadingAI,
    suggestedHabits,
    weeklyInsight,
    generateAIMessage,
    generateHabitSuggestions,
    generateWeeklyInsight,
    loadWeeklyInsight,
    setSuggestedHabits,
  } = useAI();

  // Initialize app + notifications
  useEffect(() => {
    notificationService.registerServiceWorker();

    if (checkNewDay()) {
      resetDailyProgress();
    }

    if (user) {
      if (habits.length === 0) {
        setCurrentView('onboarding');
      } else {
        setCurrentView('dashboard');
      }
    }

    if (notifications.enabled && user && habits.length > 0) {
      const habitData = habits.map(habit => ({
        name: habit.name,
        completed: habitProgress[habit.id]?.completedToday || false,
        streak: habitProgress[habit.id]?.currentStreak || 0
      }));

      notificationService.scheduleDailyNotifications(notifications, habitData);
      notificationService.scheduleStreakReminders(habitData);
    }

    if (user?.isPremium) {
      loadWeeklyInsight();

      if (habits.length > 0) {
        const legacyStreaks = Object.fromEntries(
          habits.map((habit, index) => [index, habitProgress[habit.id]?.currentStreak || 0])
        );
        const legacyCompleted = Object.fromEntries(
          habits.map((habit, index) => [index, habitProgress[habit.id]?.completedToday || false])
        );
        generateAIMessage(habits.map(h => h.name), legacyStreaks, legacyCompleted, user.email.split('@')[0]);
      }
    }
  }, [user, habits.length, notifications, habitProgress, resetDailyProgress, loadWeeklyInsight, generateAIMessage]);

  // Theme management using class-based Dark mode (Shadcn style)
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    // If theme is dark, or system is dark and theme is system (not handled here but good practice)
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.add('light');
    }
  }, [theme]);

  // Auth handlers
  const handleAuthSuccess = (userData: User) => {
    updateUser(userData);
    if (habits.length === 0) {
      setCurrentView('onboarding');
    } else {
      setCurrentView('dashboard');
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      notificationService.clearScheduledNotifications();
      clearAllData();
      setSuggestedHabits([]);
      setCurrentView('splash');
    } finally {
      setIsLoading(false);
    }
  };

  // Onboarding
  const handleOnboardingComplete = (newHabits: string[]) => {
    const habitObjects: Habit[] = newHabits.map((name, index) => ({
      id: `habit_${Date.now()}_${index}`,
      name,
      description: '',
      emoji: ['🎯', '💪', '📚', '🧘', '💧'][index % 5],
      category: 'Health',
      difficulty: 'medium',
      isActive: true,
      createdAt: new Date().toISOString()
    }));

    habitObjects.forEach(habit => addHabit(habit));
    setCurrentView('dashboard');
  };

  const handleGenerateHabitSuggestions = () => {
    generateHabitSuggestions(habits.map(h => h.name));
  };

  // Habit management
  const handleSaveHabit = (habit: Habit) => {
    if (editingHabit) {
      updateHabit(habit);
    } else {
      addHabit(habit);
    }
    setShowHabitEditor(false);
    setEditingHabit(undefined);
  };

  const handleDeleteHabit = (habitId: string) => {
    deleteHabit(habitId);
  };

  const handleAddNewHabit = () => {
    setEditingHabit(undefined);
    setShowHabitEditor(true);
  };

  const handleCompleteHabit = (habitId: string) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    const progress = habitProgress[habitId];
    if (progress?.completedToday) {
      uncompleteHabit(habitId);
    } else {
      completeHabit(habitId);

      const newStreak = (progress?.currentStreak || 0) + 1;
      if ([3, 7, 30, 100].includes(newStreak)) {
        const milestones = {
          3: 'First Sprout! 🌱',
          7: 'Weekly Warrior! 🔥',
          30: 'Monthly Master! 🏆',
          100: 'Century Champion! 👑'
        };
        notificationService.showAchievement(
          milestones[newStreak as keyof typeof milestones],
          `You've completed "${habit.name}" for ${newStreak} days straight!`
        );
      }
    }
  };

  const handleLegacyCompleteHabit = (index: number) => {
    const habit = habits[index];
    if (habit) {
      handleCompleteHabit(habit.id);
    }
  };

  const handleUpgradeToPremium = () => {
    if (user) {
      const updatedUser = { ...user, isPremium: true };
      updateUser(updatedUser);
      notificationService.showNotification('🎉 Premium Activated!', {
        body: 'Welcome to MicroHabit Premium! Enjoy your new features.',
        tag: 'premium-upgrade'
      });
    }
  };

  const handleGenerateAIMessage = () => {
    if (user && habits.length > 0) {
      const legacyStreaks = Object.fromEntries(
        habits.map((habit, index) => [index, habitProgress[habit.id]?.currentStreak || 0])
      );
      const legacyCompleted = Object.fromEntries(
        habits.map((habit, index) => [index, habitProgress[habit.id]?.completedToday || false])
      );
      generateAIMessage(habits.map(h => h.name), legacyStreaks, legacyCompleted, user.email.split('@')[0]);
    }
  };

  const handleGenerateWeeklyInsight = () => {
    const weeklyData = {
      habits: habits.map(h => h.name),
      streaks: Object.fromEntries(
        habits.map((habit, index) => [index, habitProgress[habit.id]?.currentStreak || 0])
      ),
      completedToday: Object.fromEntries(
        habits.map((habit, index) => [index, habitProgress[habit.id]?.completedToday || false])
      ),
      user: user?.email.split('@')[0]
    };
    generateWeeklyInsight(weeklyData);
  };

  const completedCount = Object.values(completedToday || {}).filter(Boolean).length;

  // View rendering
  if (currentView === 'splash') {
    return (
      <ErrorBoundary>
        <SplashScreen onGetStarted={() => setCurrentView('auth')} />
      </ErrorBoundary>
    );
  }

  if (currentView === 'auth') {
    return (
      <ErrorBoundary>
        <PhoneFrame>
          <LoadingOverlay isLoading={isLoading} message="Signing in...">
            <AuthScreen onAuthSuccess={handleAuthSuccess} onBack={() => setCurrentView('splash')} />
          </LoadingOverlay>
        </PhoneFrame>
      </ErrorBoundary>
    );
  }

  if (currentView === 'onboarding') {
    return (
      <ErrorBoundary>
        <PhoneFrame>
          <OnboardingScreen
            onComplete={handleOnboardingComplete}
            suggestedHabits={suggestedHabits}
            onGenerateSuggestions={handleGenerateHabitSuggestions}
            loadingAI={loadingAI}
          />
        </PhoneFrame>
      </ErrorBoundary>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard
          user={user}
          habits={habits.map(h => h.name)}
          completedToday={completedToday}
          streaks={streaks}
          lastCompletedDate={lastCompletedDate}
          theme={theme}
          onCompleteHabit={handleLegacyCompleteHabit}
          onUpgradeToPremium={handleUpgradeToPremium}
        />
      case 'garden':
        return <GardenView
          habits={habits.map(h => h.name)}
          streaks={streaks}
          completedToday={completedToday}
        />
      case 'calendar':
        return <CalendarView
          habits={habits}
          habitProgress={habitProgress}
        />
      case 'analytics':
        return <AnalyticsDashboard
          habits={habits}
          habitProgress={habitProgress}
        />
      case 'social':
        return <SocialSharing
          habits={habits}
          habitProgress={habitProgress}
        />
      case 'journal': // Existing
        return <JournalScreen />
      default:
        return null;
    }
  }

  return (
    <ErrorBoundary>
      <PhoneFrame>
        <div className="bg-background text-foreground transition-colors duration-300 min-h-full">

          {currentView === 'settings' && (
            <SettingsScreen
              user={user}
              theme={theme}
              suggestedHabits={suggestedHabits}
              loadingAI={loadingAI}
              onClose={() => setCurrentView('dashboard')}
              onThemeChange={updateTheme}
              onUpgradeToPremium={handleUpgradeToPremium}
              onLogout={handleLogout}
              onGenerateAIMessage={handleGenerateAIMessage}
              onGenerateHabitSuggestions={handleGenerateHabitSuggestions}
              onGenerateWeeklyInsight={handleGenerateWeeklyInsight}
              habits={habits.map(h => h.name)}
              streaks={streaks}
              completedToday={completedToday}
            />
          )}

          <div className="p-4 pb-24">
            {/* Header */}
            <DashboardHeader
              user={user}
              completedCount={completedCount}
              totalHabits={habits.length}
              aiMessage={aiMessage}
              weeklyInsight={weeklyInsight}
              loadingAI={loadingAI}
              onSettingsClick={() => setCurrentView('settings')}
              onGenerateAIMessage={handleGenerateAIMessage}
            />

            {/* Content */}
            {renderContent()}

            {/* FAB for Adding Habits (Only on Dashboard) */}
            {activeTab === 'dashboard' && (
              <button
                onClick={handleAddNewHabit}
                className="absolute bottom-24 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center transform hover:scale-110 z-40"
              >
                <Plus className="w-6 h-6" />
              </button>
            )}

            {/* Bottom Nav */}
            <div className="absolute bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border p-2 z-50 rounded-b-[2rem]">
              <div className="flex justify-around items-center pb-2">
                {[
                  { key: 'dashboard', icon: Home, label: 'Home' },
                  { key: 'garden', icon: Sprout, label: 'Garden' },
                  { key: 'calendar', icon: Calendar, label: 'History' },
                  { key: 'analytics', icon: BarChart3, label: 'Stats' },
                  { key: 'journal', icon: BookOpen, label: 'Journal' }, // Added Journal
                ].map(({ key, icon: Icon, label }) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key as any)}
                    className={`flex flex-col items-center justify-center w-full py-2 transition-all ${activeTab === key ? 'text-primary scale-110' : 'text-muted-foreground hover:text-primary/70'
                      }`}
                  >
                    <Icon className="w-5 h-5 mb-0.5" strokeWidth={activeTab === key ? 2.5 : 2} />
                    <span className="text-[10px] font-medium">{label}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Modals */}
          <HabitEditor
            habit={editingHabit}
            isOpen={showHabitEditor}
            onClose={() => {
              setShowHabitEditor(false);
              setEditingHabit(undefined);
            }}
            onSave={handleSaveHabit}
            onDelete={handleDeleteHabit}
          />

        </div>
      </PhoneFrame>
    </ErrorBoundary>
  );
};

export default App;

export { };
