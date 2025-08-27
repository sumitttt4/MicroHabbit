import React, { useState, useEffect } from 'react';
import { Bell, Clock, Zap, Volume2, VolumeX, CheckCircle } from 'lucide-react';
import { NotificationSettings } from '../types';
import { notificationService } from '../services/notificationService';

interface NotificationSettingsProps {
  settings: NotificationSettings;
  onUpdateSettings: (settings: NotificationSettings) => void;
  theme: any;
}

const NotificationSettingsComponent: React.FC<NotificationSettingsProps> = ({
  settings,
  onUpdateSettings,
  theme
}) => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [testNotificationSent, setTestNotificationSent] = useState(false);

  useEffect(() => {
    setPermission(notificationService.getPermission());
  }, []);

  const handleRequestPermission = async () => {
    const newPermission = await notificationService.requestPermission();
    setPermission(newPermission);
    
    if (newPermission === 'granted') {
      // Enable notifications in settings
      onUpdateSettings({
        ...settings,
        enabled: true
      });
    }
  };

  const handleSettingChange = (key: keyof NotificationSettings, value: boolean | string) => {
    const newSettings = {
      ...settings,
      [key]: value
    };
    onUpdateSettings(newSettings);
  };

  const sendTestNotification = () => {
    if (notificationService.isSupported()) {
      notificationService.showNotification('Test Notification 🧪', {
        body: 'Great! Your notifications are working perfectly.',
        tag: 'test'
      });
      setTestNotificationSent(true);
      setTimeout(() => setTestNotificationSent(false), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Permission Status */}
      <div className={`${theme.cardBg || theme.card} p-6 rounded-2xl shadow-lg`}>
        <div className="flex items-center gap-3 mb-4">
          <Bell className="text-blue-500" size={24} />
          <h3 className={`text-lg font-bold ${theme.textPrimary || theme.text}`}>
            Notification Settings
          </h3>
        </div>

        {/* Permission Status */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className={`font-medium ${theme.textPrimary || theme.text}`}>
              Browser Permissions
            </span>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              permission === 'granted' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : permission === 'denied'
                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
            }`}>
              {permission === 'granted' ? '✓ Allowed' : 
               permission === 'denied' ? '✗ Blocked' : '? Not Set'}
            </div>
          </div>

          {permission !== 'granted' && (
            <div className="mb-4">
              <button
                onClick={handleRequestPermission}
                className={`w-full py-3 px-4 rounded-lg ${theme.buttonPrimary || theme.primary} text-white font-medium transition-colors`}
              >
                {permission === 'denied' 
                  ? 'Enable in Browser Settings' 
                  : 'Enable Notifications'}
              </button>
              
              {permission === 'denied' && (
                <p className={`text-sm ${theme.textSecondary} mt-2`}>
                  Notifications are blocked. Please enable them in your browser settings.
                </p>
              )}
            </div>
          )}

          {permission === 'granted' && (
            <button
              onClick={sendTestNotification}
              disabled={testNotificationSent}
              className={`w-full py-2 px-4 rounded-lg border border-gray-300 dark:border-gray-600 transition-colors ${
                testNotificationSent 
                  ? 'bg-green-50 text-green-700 border-green-300 dark:bg-green-900/20 dark:text-green-300'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              {testNotificationSent ? (
                <span className="flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Test Sent!
                </span>
              ) : (
                'Send Test Notification'
              )}
            </button>
          )}
        </div>

        {/* Master Toggle */}
        <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
          <div className="flex items-center gap-3">
            {settings.enabled ? (
              <Volume2 className="text-green-500" size={20} />
            ) : (
              <VolumeX className="text-gray-400" size={20} />
            )}
            <div>
              <div className={`font-medium ${theme.textPrimary || theme.text}`}>
                Enable Notifications
              </div>
              <div className={`text-sm ${theme.textSecondary}`}>
                Master switch for all notification types
              </div>
            </div>
          </div>
          
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.enabled && permission === 'granted'}
              onChange={(e) => handleSettingChange('enabled', e.target.checked)}
              disabled={permission !== 'granted'}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* Individual Settings */}
        <div className="space-y-4">
          {/* Daily Reminders */}
          <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl">
            <div className="flex items-center gap-3">
              <Clock className={`${settings.dailyReminder ? 'text-blue-500' : 'text-gray-400'}`} size={20} />
              <div>
                <div className={`font-medium ${theme.textPrimary || theme.text}`}>
                  Daily Reminders
                </div>
                <div className={`text-sm ${theme.textSecondary}`}>
                  Get reminded about incomplete habits
                </div>
              </div>
            </div>
            
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.dailyReminder}
                onChange={(e) => handleSettingChange('dailyReminder', e.target.checked)}
                disabled={!settings.enabled}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Streak Protection */}
          <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl">
            <div className="flex items-center gap-3">
              <Zap className={`${settings.streakReminder ? 'text-orange-500' : 'text-gray-400'}`} size={20} />
              <div>
                <div className={`font-medium ${theme.textPrimary || theme.text}`}>
                  Streak Protection
                </div>
                <div className={`text-sm ${theme.textSecondary}`}>
                  Don't let your streaks break!
                </div>
              </div>
            </div>
            
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.streakReminder}
                onChange={(e) => handleSettingChange('streakReminder', e.target.checked)}
                disabled={!settings.enabled}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Motivational Messages */}
          <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl">
            <div className="flex items-center gap-3">
              <Bell className={`${settings.motivationalMessage ? 'text-purple-500' : 'text-gray-400'}`} size={20} />
              <div>
                <div className={`font-medium ${theme.textPrimary || theme.text}`}>
                  Motivational Messages
                </div>
                <div className={`text-sm ${theme.textSecondary}`}>
                  Inspirational quotes and tips
                </div>
              </div>
            </div>
            
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.motivationalMessage}
                onChange={(e) => handleSettingChange('motivationalMessage', e.target.checked)}
                disabled={!settings.enabled}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Reminder Time */}
          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <Clock className="text-green-500" size={20} />
              <div>
                <div className={`font-medium ${theme.textPrimary || theme.text}`}>
                  Reminder Time
                </div>
                <div className={`text-sm ${theme.textSecondary}`}>
                  When to send daily notifications
                </div>
              </div>
            </div>
            
            <input
              type="time"
              value={settings.reminderTime}
              onChange={(e) => handleSettingChange('reminderTime', e.target.value)}
              disabled={!settings.enabled || !settings.dailyReminder}
              className={`w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                !settings.enabled || !settings.dailyReminder ? 'opacity-50 cursor-not-allowed' : ''
              } ${theme.cardBg || 'bg-white dark:bg-gray-800'}`}
            />
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
          <div className={`text-sm ${theme.textPrimary || theme.text} font-medium mb-2`}>
            💡 Notification Tips:
          </div>
          <ul className={`text-sm ${theme.textSecondary} space-y-1`}>
            <li>• Notifications work best when the app is open in a tab</li>
            <li>• Daily reminders help maintain consistency</li>
            <li>• Streak protection prevents long streaks from breaking</li>
            <li>• You can always disable specific notification types</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettingsComponent;
