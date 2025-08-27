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
import ErrorBoundary from './components/ErrorBoundary';
import { LoadingOverlay } from './components/LoadingComponents';
import { useEnhancedLocalStorage } from './hooks/useEnhancedLocalStorage';
import { useAI } from './hooks/useAI';
import { THEMES } from './config/constants';
import { User, Habit } from './types';
import { authService } from './services/authService';
import { notificationService } from './services/notificationService';
import { checkNewDay } from './utils/helpers';
import { Home, Sprout, Calendar, BarChart3, Share2, Settings, Plus } from 'lucide-react';

// ✅ Correct type export (isolatedModules safe)
export type ViewType = 'splash' | 'auth' | 'onboarding' | 'dashboard' | 'settings';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('splash');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'garden' | 'calendar' | 'analytics' | 'social'>('dashboard');
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
    importData,
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

  const handleEditHabit = (habit: Habit) => {
    setEditingHabit(habit);
    setShowHabitEditor(true);
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

      if (user?.isPremium) {
        setTimeout(() => {
          const legacyStreaks = Object.fromEntries(
            habits.map((h, index) => [index, habitProgress[h.id]?.currentStreak || 0])
          );
          const legacyCompleted = Object.fromEntries(
            habits.map((h, index) => [index, habitProgress[h.id]?.completedToday || false])
          );
          generateAIMessage(habits.map(h => h.name), legacyStreaks, legacyCompleted, user.email.split('@')[0]);
        }, 1000);
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

  const currentTheme = THEMES[theme];
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
        <LoadingOverlay isLoading={isLoading} message="Signing in...">
          <AuthScreen onAuthSuccess={handleAuthSuccess} onBack={() => setCurrentView('splash')} />
        </LoadingOverlay>
      </ErrorBoundary>
    );
  }

  if (currentView === 'onboarding') {
    return (
      <ErrorBoundary>
        <OnboardingScreen
          onComplete={handleOnboardingComplete}
          suggestedHabits={suggestedHabits}
          onGenerateSuggestions={handleGenerateHabitSuggestions}
          loadingAI={loadingAI}
        />
      </ErrorBoundary>
    );
  }

  if (currentView === 'settings') {
    return (
      <ErrorBoundary>
        <div className={`min-h-screen ${currentTheme.bg}`}>
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

          <div className="max-w-md mx-auto p-4">
            <NotificationSettings
              settings={notifications}
              onUpdateSettings={updateNotifications}
              theme={currentTheme}
            />
          </div>
        </div>
      </ErrorBoundary>
    );
  }

  // Dashboard view
  return (
    <ErrorBoundary>
      <LoadingOverlay isLoading={isLoading} message="Loading your habits...">
        <div className={`min-h-screen ${currentTheme.bg} p-4`}>
          <div className="max-w-md mx-auto">
            <DashboardHeader
              user={user}
              completedCount={completedCount}
              totalHabits={habits.length}
              aiMessage={aiMessage}
              weeklyInsight={weeklyInsight}
              loadingAI={loadingAI}
              theme={currentTheme}
              onSettingsClick={() => setCurrentView('settings')}
              onGenerateAIMessage={handleGenerateAIMessage}
            />

            {/* Tabs */}
            <div className="flex mb-6 bg-white rounded-2xl p-1 shadow-lg border border-stone-200">
              {[
                { key: 'dashboard', icon: Home, label: 'Habits' },
                { key: 'garden', icon: Sprout, label: 'Garden' },
                { key: 'calendar', icon: Calendar, label: 'Calendar' },
                { key: 'analytics', icon: BarChart3, label: 'Stats' },
                { key: 'social', icon: Share2, label: 'Share' }
              ].map(({ key, icon: Icon, label }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as any)}
                  className={`flex-1 flex flex-col items-center gap-1 py-3 px-2 rounded-xl transition-all duration-300 border-none ${
                    activeTab === key
                      ? `${currentTheme.primary} text-white shadow-lg transform scale-105`
                      : `${currentTheme.text} hover:bg-stone-100`
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs font-medium">{label}</span>
                </button>
              ))}
            </div>

            {activeTab === 'dashboard' && (
              <button
                onClick={handleAddNewHabit}
                className="fixed bottom-6 right-6 w-14 h-14 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center transform hover:scale-110 z-40"
              >
                <Plus className="w-6 h-6" />
              </button>
            )}

            {/* Tab content */}
            <div className="space-y-6">
              {activeTab === 'dashboard' && (
                <Dashboard
                  user={user}
                  habits={habits.map(h => h.name)}
                  completedToday={completedToday}
                  streaks={streaks}
                  lastCompletedDate={lastCompletedDate}
                  theme={currentTheme}
                  onCompleteHabit={handleLegacyCompleteHabit}
                  onUpgradeToPremium={handleUpgradeToPremium}
                />
              )}

              {activeTab === 'garden' && (
                <GardenView
                  habits={habits.map(h => h.name)}
                  streaks={streaks}
                  completedToday={completedToday}
                  theme={currentTheme}
                />
              )}

              {activeTab === 'calendar' && (
                <CalendarView
                  habits={habits}
                  habitProgress={habitProgress}
                  theme={currentTheme}
                  onDateClick={(date) => console.log('Date clicked:', date)}
                />
              )}

              {activeTab === 'analytics' && (
                <AnalyticsDashboard
                  habits={habits}
                  habitProgress={habitProgress}
                  theme={currentTheme}
                />
              )}

              {activeTab === 'social' && (
                <SocialSharing
                  habits={habits}
                  habitProgress={habitProgress}
                  theme={currentTheme}
                />
              )}
            </div>
          </div>
        </div>

        {/* Habit editor */}
        <HabitEditor
          habit={editingHabit}
          isOpen={showHabitEditor}
          onClose={() => {
            setShowHabitEditor(false);
            setEditingHabit(undefined);
          }}
          onSave={handleSaveHabit}
          onDelete={handleDeleteHabit}
          theme={currentTheme}
        />
      </LoadingOverlay>
    </ErrorBoundary>
  );
};

export default App;

export {};
