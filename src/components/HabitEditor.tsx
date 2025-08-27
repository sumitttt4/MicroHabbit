import React, { useState, useEffect } from 'react';
import { X, Save, Trash2, Clock, Tag, Zap } from 'lucide-react';
import { Habit } from '../types';

interface HabitEditorProps {
  habit?: Habit;
  isOpen: boolean;
  onClose: () => void;
  onSave: (habit: Habit) => void;
  onDelete?: (habitId: string) => void;
  theme: any;
}

const HabitEditor: React.FC<HabitEditorProps> = ({
  habit,
  isOpen,
  onClose,
  onSave,
  onDelete,
  theme
}) => {
  const [formData, setFormData] = useState<Partial<Habit>>({
    name: '',
    description: '',
    emoji: '🎯',
    category: 'Health',
    difficulty: 'easy',
    reminderTime: '09:00',
    isActive: true,
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const categories = [
    'Health', 'Fitness', 'Learning', 'Productivity', 
    'Mindfulness', 'Social', 'Career', 'Hobby', 'Other'
  ];

  const emojis = [
    '🎯', '💪', '📚', '🧘', '💧', '🏃', '🍎', '📝', '🎨', '🌱',
    '☀️', '🧠', '❤️', '🔥', '⭐', '🏆', '🚀', '💎', '🌟', '✨'
  ];

  const difficulties = ['easy', 'medium', 'hard'] as const;

  useEffect(() => {
    if (habit) {
      setFormData({
        ...habit,
        reminderTime: habit.reminderTime || '09:00'
      });
    } else {
      setFormData({
        name: '',
        description: '',
        emoji: '🎯',
        category: 'Health',
        difficulty: 'easy',
        reminderTime: '09:00',
        isActive: true,
        notes: ''
      });
    }
    setErrors({});
  }, [habit, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Habit name is required';
    } else if (formData.name.length > 50) {
      newErrors.name = 'Habit name must be 50 characters or less';
    }

    if (formData.description && formData.description.length > 200) {
      newErrors.description = 'Description must be 200 characters or less';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const habitData: Habit = {
        id: habit?.id || `habit_${Date.now()}`,
        name: formData.name!.trim(),
        description: formData.description?.trim(),
        emoji: formData.emoji!,
        category: formData.category!,
        difficulty: formData.difficulty!,
        reminderTime: formData.reminderTime,
        isActive: formData.isActive ?? true,
        createdAt: habit?.createdAt || new Date().toISOString(),
        notes: formData.notes?.trim()
      };

      onSave(habitData);
      onClose();
    } catch (error) {
      console.error('Error saving habit:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    if (habit && onDelete && window.confirm('Are you sure you want to delete this habit? This action cannot be undone.')) {
      onDelete(habit.id);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className={`w-full max-w-md max-h-[90vh] overflow-y-auto ${theme.cardBg || theme.card} rounded-2xl shadow-xl`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className={`text-xl font-bold ${theme.textPrimary || theme.text}`}>
            {habit ? 'Edit Habit' : 'New Habit'}
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg ${theme.buttonSecondary || 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          {/* Emoji Selection */}
          <div>
            <label className={`block text-sm font-medium ${theme.textPrimary || theme.text} mb-2`}>
              Icon
            </label>
            <div className="grid grid-cols-10 gap-2">
              {emojis.map(emoji => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setFormData((prev: Partial<Habit>) => ({ ...prev, emoji }))}
                  className={`w-8 h-8 text-lg rounded-lg border-2 transition-all ${
                    formData.emoji === emoji 
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className={`block text-sm font-medium ${theme.textPrimary || theme.text} mb-2`}>
              Habit Name *
            </label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => setFormData((prev: Partial<Habit>) => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Drink 8 glasses of water"
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              } focus:ring-2 focus:ring-green-500 focus:border-transparent ${theme.cardBg || 'bg-white'}`}
              maxLength={50}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            <p className={`text-xs ${theme.textSecondary} mt-1`}>
              {(formData.name?.length || 0)}/50 characters
            </p>
          </div>

          {/* Description */}
          <div>
            <label className={`block text-sm font-medium ${theme.textPrimary || theme.text} mb-2`}>
              Description (Optional)
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData((prev: Partial<Habit>) => ({ ...prev, description: e.target.value }))}
              placeholder="Add more details about your habit..."
              rows={3}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              } focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none ${theme.cardBg || 'bg-white'}`}
              maxLength={200}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            <p className={`text-xs ${theme.textSecondary} mt-1`}>
              {(formData.description?.length || 0)}/200 characters
            </p>
          </div>

          {/* Category */}
          <div>
            <label className={`flex items-center gap-2 text-sm font-medium ${theme.textPrimary || theme.text} mb-2`}>
              <Tag className="w-4 h-4" />
              Category
            </label>
            <select
              value={formData.category || 'Health'}
              onChange={(e) => setFormData((prev: Partial<Habit>) => ({ ...prev, category: e.target.value }))}
              className={`w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent ${theme.cardBg || 'bg-white'}`}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Difficulty */}
          <div>
            <label className={`flex items-center gap-2 text-sm font-medium ${theme.textPrimary || theme.text} mb-2`}>
              <Zap className="w-4 h-4" />
              Difficulty
            </label>
            <div className="grid grid-cols-3 gap-2">
              {difficulties.map(difficulty => (
                <button
                  key={difficulty}
                  type="button"
                  onClick={() => setFormData((prev: Partial<Habit>) => ({ ...prev, difficulty }))}
                  className={`py-2 px-4 rounded-lg border-2 transition-all text-sm font-medium ${
                    formData.difficulty === difficulty
                      ? 'border-green-500 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {difficulty}
                </button>
              ))}
            </div>
          </div>

          {/* Reminder Time */}
          <div>
            <label className={`flex items-center gap-2 text-sm font-medium ${theme.textPrimary || theme.text} mb-2`}>
              <Clock className="w-4 h-4" />
              Reminder Time (Optional)
            </label>
            <input
              type="time"
              value={formData.reminderTime || '09:00'}
              onChange={(e) => setFormData((prev: Partial<Habit>) => ({ ...prev, reminderTime: e.target.value }))}
              className={`w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent ${theme.cardBg || 'bg-white'}`}
            />
          </div>

          {/* Notes */}
          <div>
            <label className={`block text-sm font-medium ${theme.textPrimary || theme.text} mb-2`}>
              Personal Notes (Optional)
            </label>
            <textarea
              value={formData.notes || ''}
              onChange={(e) => setFormData((prev: Partial<Habit>) => ({ ...prev, notes: e.target.value }))}
              placeholder="Why is this habit important to you?"
              rows={2}
              className={`w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none ${theme.cardBg || 'bg-white'}`}
              maxLength={300}
            />
            <p className={`text-xs ${theme.textSecondary} mt-1`}>
              {(formData.notes?.length || 0)}/300 characters
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
          <div>
            {habit && onDelete && (
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            )}
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className={`px-6 py-2 rounded-lg ${theme.buttonSecondary || 'bg-gray-200 hover:bg-gray-300'} transition-colors`}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading || !formData.name?.trim()}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg ${theme.buttonPrimary || theme.primary} text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {loading ? 'Saving...' : 'Save Habit'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HabitEditor;
