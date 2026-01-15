import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import GardenView from './components/GardenView';
import CalendarView from './components/CalendarView';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import SocialSharing from './components/SocialSharing';
import SettingsScreen from './components/SettingsScreen';
import HabitEditor from './components/HabitEditor';
import JournalScreen from './components/JournalScreen';
import ErrorBoundary from './components/ErrorBoundary';
import { useEnhancedLocalStorage } from './hooks/useEnhancedLocalStorage';
import { useAI } from './hooks/useAI';
import { Habit } from './types';
import { notificationService } from './services/notificationService';
import { checkNewDay } from './utils/helpers';
import { LayoutDashboard, Sprout, Calendar, BarChart3, BookOpen, Settings, Plus } from 'lucide-react';

export type ViewType = 'dashboard' | 'settings';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'garden' | 'calendar' | 'analytics' | 'social' | 'journal'>('dashboard');
  const [showHabitEditor, setShowHabitEditor] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | undefined>(undefined);

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
    resetDailyProgress,
    completedToday,
    streaks,
    lastCompletedDate,
    clearAllData
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
  } = useAI();

  // Initialize app - AUTO LOGIN / DEFAULT USER
  useEffect(() => {
    notificationService.registerServiceWorker();

    if (checkNewDay()) {
      resetDailyProgress();
    }

    // Auto-create a local user if none exists (Bypass Auth)
    if (!user) {
      updateUser({
        id: 'local-user',
        name: 'You',
        email: 'local@device',
        preferences: { theme: 'light', notifications: true },
        isPremium: true // Default to premium features for local
      });
    }

    // Enforce Light Mode
    const root = window.document.documentElement;
    root.classList.remove('dark');
    root.classList.add('light');

  }, []);

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
    }
  };

  const handleLegacyCompleteHabit = (index: number) => {
    const habit = habits[index];
    if (habit) {
      handleCompleteHabit(habit.id);
    }
  };

  // Mock handlers
  const handleGenerateAIMessage = () => { };
  const handleGenerateHabitSuggestions = () => { };
  const handleUpgradeToPremium = () => { };
  const handleGenerateWeeklyInsight = () => { };
  const handleLogout = () => {
    // Data reset option strictly
    if (window.confirm("This will clear all your data. Are you sure?")) {
      clearAllData();
      window.location.reload();
    }
  };


  const completedCount = Object.values(completedToday || {}).filter(Boolean).length;

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
          onUpgradeToPremium={() => { }}
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
      case 'journal':
        return <JournalScreen />
      default:
        return null;
    }
  }

  return (
    <ErrorBoundary>
      <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans">

        {/* Minimal Sidebar */}
        <aside className="w-20 lg:w-64 border-r border-border bg-white flex flex-col transition-all duration-300">
          <div className="p-6 flex items-center gap-3">
            <div className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center">
              <Sprout className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight hidden lg:block">
              MicroHabit
            </h1>
          </div>

          <nav className="flex-1 px-3 space-y-1 mt-6">
            {[
              { key: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
              { key: 'garden', icon: Sprout, label: 'Garden' },
              { key: 'calendar', icon: Calendar, label: 'History' },
              { key: 'analytics', icon: BarChart3, label: 'Analytics' },
              { key: 'journal', icon: BookOpen, label: 'Journal' },
            ].map(({ key, icon: Icon, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${activeTab === key
                    ? 'bg-black text-white shadow-lg shadow-black/20'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-black'
                  }`}
              >
                <Icon className={`w-5 h-5 ${activeTab === key ? 'text-white' : 'text-gray-500 group-hover:text-black'}`} />
                <span className="hidden lg:block">{label}</span>
              </button>
            ))}
          </nav>

          <div className="p-3 border-t border-border space-y-2 mb-4">
            <button
              onClick={() => handleAddNewHabit()}
              className="flex items-center gap-3 w-full px-3 py-3 rounded-lg text-sm font-medium text-black bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200 justify-center group"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden lg:block">New Habit</span>
            </button>

            <button
              onClick={() => setCurrentView('settings')}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-50 hover:text-black transition-colors"
            >
              <Settings className="w-5 h-5" />
              <span className="hidden lg:block">Settings</span>
            </button>
          </div>
        </aside>

        {/* Main Content - Minimal clean area */}
        <main className="flex-1 flex flex-col overflow-hidden bg-white">
          {/* Header - Simplified */}
          <header className="h-20 flex items-center justify-between px-8 shrink-0">
            <div>
              <h2 className="text-2xl font-bold capitalize tracking-tight">{activeTab}</h2>
              <p className="text-sm text-gray-500 mt-1">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-medium text-black">{completedCount} / {habits.length} Completed</div>
                <div className="w-32 h-1.5 bg-gray-100 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className="h-full bg-black rounded-full transition-all duration-500"
                    style={{ width: `${habits.length ? (completedCount / habits.length) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </header>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-auto p-8 pt-0">
            <div className="max-w-5xl">
              {currentView === 'settings' ? (
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
              ) : (
                renderContent()
              )}
            </div>
          </div>
        </main>

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
    </ErrorBoundary>
  );
};

export default App;
