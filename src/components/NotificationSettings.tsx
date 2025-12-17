import React, { useState, useEffect } from 'react';
import { Bell, Clock, Zap, Volume2, CheckCircle, AlertOctagon } from 'lucide-react';
import { NotificationSettings } from '../types';
import { notificationService } from '../services/notificationService';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from './ui/card';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Alert, AlertDescription, AlertTitle } from './ui/alert'; // Need to create Alert, or just use div with styles

interface NotificationSettingsProps {
  settings: NotificationSettings;
  onUpdateSettings: (settings: NotificationSettings) => void;
  theme?: any; // kept for compatibility in parent
}

const NotificationSettingsComponent: React.FC<NotificationSettingsProps> = ({
  settings,
  onUpdateSettings,
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
    <div className="space-y-6 animate-in fade-in duration-500">

      {/* Permission Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            <CardTitle>Permissions</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-sm">Browser Permissions</span>
            <div className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${permission === 'granted' ? 'bg-green-100 text-green-700' :
                permission === 'denied' ? 'bg-red-100 text-red-700' :
                  'bg-yellow-100 text-yellow-700'
              }`}>
              {permission === 'granted' ? 'Allowed' : permission === 'denied' ? 'Blocked' : 'Not Set'}
            </div>
          </div>

          {permission !== 'granted' && (
            <div className="space-y-2">
              <Button onClick={handleRequestPermission} className="w-full" variant={permission === 'denied' ? 'destructive' : 'default'}>
                {permission === 'denied' ? 'Enable in Browser Settings' : 'Request Permissions'}
              </Button>
              {permission === 'denied' && (
                <p className="text-xs text-muted-foreground text-center">
                  Please check your browser settings to allow notifications.
                </p>
              )}
            </div>
          )}

          {permission === 'granted' && (
            <Button
              onClick={sendTestNotification}
              variant="outline"
              className="w-full"
              disabled={testNotificationSent}
            >
              {testNotificationSent ? <><CheckCircle className="w-4 h-4 mr-2" /> Sent!</> : 'Send Test Notification'}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Settings List */}
      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>Manage when and how you want to be notified.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">

          {/* Master Toggle */}
          <div className="flex items-center justify-between space-x-2">
            <div className="flex flex-col space-y-1">
              <Label htmlFor="notifications-enable">Enable Notifications</Label>
              <span className="text-xs text-muted-foreground">Turn on/off all notifications</span>
            </div>
            <Switch
              id="notifications-enable"
              checked={settings.enabled && permission === 'granted'}
              onCheckedChange={(checked) => handleSettingChange('enabled', checked)}
              disabled={permission !== 'granted'}
            />
          </div>

          <div className="space-y-4 pt-4 border-t">
            {/* Daily */}
            <div className="flex items-center justify-between space-x-2">
              <div className="flex items-center space-x-4">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="daily-reminder">Daily Reminders</Label>
                  <span className="text-xs text-muted-foreground">Get reminded about incomplete habits</span>
                </div>
              </div>
              <Switch
                id="daily-reminder"
                checked={settings.dailyReminder}
                onCheckedChange={(checked) => handleSettingChange('dailyReminder', checked)}
                disabled={!settings.enabled}
              />
            </div>

            {/* Streak */}
            <div className="flex items-center justify-between space-x-2">
              <div className="flex items-center space-x-4">
                <Zap className="w-5 h-5 text-muted-foreground" />
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="streak-protection">Streak Protection</Label>
                  <span className="text-xs text-muted-foreground">Alerts before you lose a streak</span>
                </div>
              </div>
              <Switch
                id="streak-protection"
                checked={settings.streakReminder}
                onCheckedChange={(checked) => handleSettingChange('streakReminder', checked)}
                disabled={!settings.enabled}
              />
            </div>

            {/* Motivation */}
            <div className="flex items-center justify-between space-x-2">
              <div className="flex items-center space-x-4">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <div className="flex flex-col space-y-1">
                  <Label htmlFor="motivation">Motivational Messages</Label>
                  <span className="text-xs text-muted-foreground">Occasional boosts of motivation</span>
                </div>
              </div>
              <Switch
                id="motivation"
                checked={settings.motivationalMessage}
                onCheckedChange={(checked) => handleSettingChange('motivationalMessage', checked)}
                disabled={!settings.enabled}
              />
            </div>

            {/* Time Picker */}
            <div className="pt-2">
              <Label className="mb-2 block">Reminder Time</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="time"
                  value={settings.reminderTime}
                  onChange={(e) => handleSettingChange('reminderTime', e.target.value)}
                  disabled={!settings.enabled || !settings.dailyReminder}
                  className="w-full max-w-[200px]"
                />
              </div>
            </div>

          </div>

        </CardContent>
      </Card>

      {/* Tips */}
      <div className="bg-primary/5 p-4 rounded-lg flex gap-3 text-sm text-primary/80">
        <AlertOctagon className="w-5 h-5 shrink-0" />
        <div>
          <p className="font-semibold mb-1">Did you know?</p>
          <p>Notifications are most effective when set for a time you're usually free, like in the morning or just after work.</p>
        </div>
      </div>

    </div>
  );
};

export default NotificationSettingsComponent;
