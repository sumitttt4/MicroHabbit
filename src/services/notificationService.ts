import { NotificationSettings } from '../types';

class NotificationService {
  private permission: NotificationPermission = 'default';
  
  constructor() {
    this.permission = this.getPermission();
  }

  /**
   * Get current notification permission status
   */
  getPermission(): NotificationPermission {
    if ('Notification' in window) {
      return Notification.permission;
    }
    return 'denied';
  }

  /**
   * Request notification permission from user
   */
  async requestPermission(): Promise<NotificationPermission> {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      this.permission = permission;
      return permission;
    }
    return 'denied';
  }

  /**
   * Check if notifications are supported and permitted
   */
  isSupported(): boolean {
    return 'Notification' in window && this.permission === 'granted';
  }

  /**
   * Show a notification
   */
  showNotification(title: string, options?: NotificationOptions): Notification | null {
    if (!this.isSupported()) {
      console.warn('Notifications not supported or not permitted');
      return null;
    }

    try {
      const notification = new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options
      });

      // Auto-close notification after 5 seconds
      setTimeout(() => {
        notification.close();
      }, 5000);

      return notification;
    } catch (error) {
      console.error('Error showing notification:', error);
      return null;
    }
  }

  /**
   * Show daily reminder notification
   */
  showDailyReminder(incompleteHabits: string[]): void {
    if (incompleteHabits.length === 0) return;

    const title = incompleteHabits.length === 1 
      ? `Don't forget: ${incompleteHabits[0]}` 
      : `${incompleteHabits.length} habits waiting for you!`;

    const body = incompleteHabits.length === 1
      ? 'Keep your streak going! 🔥'
      : `Complete: ${incompleteHabits.slice(0, 2).join(', ')}${incompleteHabits.length > 2 ? '...' : ''}`;

    this.showNotification(title, {
      body,
      tag: 'daily-reminder',
      icon: '/favicon.ico'
    });
  }

  /**
   * Show streak protection notification
   */
  showStreakReminder(habit: string, streak: number): void {
    const title = `Don't break your ${streak}-day streak! 🔥`;
    const body = `Complete "${habit}" to keep your amazing progress going.`;

    this.showNotification(title, {
      body,
      tag: 'streak-reminder',
      icon: '/favicon.ico',
      requireInteraction: true
    });
  }

  /**
   * Show motivational message notification
   */
  showMotivationalMessage(message: string): void {
    this.showNotification('MicroHabit Motivation 💪', {
      body: message,
      tag: 'motivation',
      icon: '/favicon.ico'
    });
  }

  /**
   * Show achievement notification
   */
  showAchievement(title: string, description: string): void {
    this.showNotification(title, {
      body: description,
      tag: 'achievement',
      icon: '/favicon.ico',
      requireInteraction: true
    });
  }

  /**
   * Schedule daily notifications
   */
  scheduleDailyNotifications(settings: NotificationSettings, habits: Array<{name: string, completed: boolean}>): void {
    if (!settings.enabled || !this.isSupported()) return;

    // Clear existing timers
    this.clearScheduledNotifications();

    const [hours, minutes] = settings.reminderTime.split(':').map(Number);
    const now = new Date();
    const reminderTime = new Date();
    reminderTime.setHours(hours, minutes, 0, 0);

    // If reminder time has passed today, schedule for tomorrow
    if (reminderTime <= now) {
      reminderTime.setDate(reminderTime.getDate() + 1);
    }

    const timeUntilReminder = reminderTime.getTime() - now.getTime();

    // Schedule daily reminder
    if (settings.dailyReminder) {
      setTimeout(() => {
        const incompleteHabits = habits
          .filter(h => !h.completed)
          .map(h => h.name);
        
        if (incompleteHabits.length > 0) {
          this.showDailyReminder(incompleteHabits);
        }

        // Schedule for next day
        this.scheduleDailyNotifications(settings, habits);
      }, timeUntilReminder);
    }

    // Store timer ID for cleanup
    (window as any).microhabitNotificationTimer = setTimeout(() => {
      this.scheduleDailyNotifications(settings, habits);
    }, timeUntilReminder);
  }

  /**
   * Schedule streak protection notifications
   */
  scheduleStreakReminders(habits: Array<{name: string, streak: number, completed: boolean}>): void {
    if (!this.isSupported()) return;

    // Check for habits with good streaks that aren't completed today
    const riskyStreaks = habits.filter(h => h.streak >= 3 && !h.completed);
    
    if (riskyStreaks.length === 0) return;

    // Schedule reminder 2 hours before end of day (10 PM)
    const now = new Date();
    const reminderTime = new Date();
    reminderTime.setHours(22, 0, 0, 0);

    if (reminderTime > now) {
      const timeUntilReminder = reminderTime.getTime() - now.getTime();
      
      setTimeout(() => {
        riskyStreaks.forEach(habit => {
          this.showStreakReminder(habit.name, habit.streak);
        });
      }, timeUntilReminder);
    }
  }

  /**
   * Clear all scheduled notifications
   */
  clearScheduledNotifications(): void {
    if ((window as any).microhabitNotificationTimer) {
      clearTimeout((window as any).microhabitNotificationTimer);
      delete (window as any).microhabitNotificationTimer;
    }
  }

  /**
   * Register service worker for background notifications (PWA)
   */
  async registerServiceWorker(): Promise<void> {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered:', registration);
        
        // Handle notification clicks
        navigator.serviceWorker.addEventListener('message', (event) => {
          if (event.data && event.data.type === 'notification-click') {
            // Focus the app window
            window.focus();
          }
        });
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  }

  /**
   * Show browser notification if app is in background
   */
  showBackgroundNotification(title: string, body: string, tag: string): void {
    if (!this.isSupported()) return;

    // Only show if page is not visible
    if (document.hidden) {
      this.showNotification(title, { body, tag });
    }
  }

  /**
   * Schedule smart reminders based on user patterns
   */
  scheduleSmartReminders(userPatterns: {
    activeHours: number[];
    preferredReminderGap: number;
    lastActivityTime?: Date;
  }): void {
    // This would analyze user behavior and send reminders at optimal times
    // For now, we'll implement a simple version
    
    const now = new Date();
    const currentHour = now.getHours();
    
    // If user is typically active during this time and hasn't been active recently
    if (userPatterns.activeHours.includes(currentHour) && userPatterns.lastActivityTime) {
      const timeSinceActivity = now.getTime() - userPatterns.lastActivityTime.getTime();
      const reminderGapMs = userPatterns.preferredReminderGap * 60 * 1000; // Convert minutes to ms
      
      if (timeSinceActivity >= reminderGapMs) {
        this.showNotification('Time for your habits! 🌱', {
          body: 'A few minutes now can make your day great!',
          tag: 'smart-reminder'
        });
      }
    }
  }
}

// Create singleton instance
export const notificationService = new NotificationService();

// Export types for easier imports
export type { NotificationSettings };
