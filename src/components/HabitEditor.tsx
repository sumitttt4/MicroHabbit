import React, { useState, useEffect } from 'react';
import { Save, Trash2 } from 'lucide-react';
import { Habit } from '../types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea'; // You need to implement this one too, or just use Input if simple
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { RadioGroup, RadioGroupItem } from './ui/radio-group'; // And this



interface HabitEditorProps {
  habit?: Habit;
  isOpen: boolean;
  onClose: () => void;
  onSave: (habit: Habit) => void;
  onDelete?: (habitId: string) => void;
  theme?: any;
}

const HabitEditor: React.FC<HabitEditorProps> = ({
  habit,
  isOpen,
  onClose,
  onSave,
  onDelete,
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

  const [loading, setLoading] = useState(false);

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
  }, [habit, isOpen]);

  const handleSave = async () => {
    if (!formData.name?.trim()) return;

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

  const categories = ['Health', 'Fitness', 'Learning', 'Productivity', 'Mindfulness', 'Social', 'Career', 'Hobby', 'Other'];
  const emojis = ['🎯', '💪', '📚', '🧘', '💧', '🏃', '🌺', '☕', '🎨', '🌱'];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">{habit ? 'Edit Habit' : 'New Habit'}</DialogTitle>
          <DialogDescription>
            Build a new routine, small steps at a time.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">

          <div className="grid gap-2">
            <Label htmlFor="name">Habit Name</Label>
            <Input
              id="name"
              value={formData.name || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g. Drink Water"
              className="col-span-3"
            />
          </div>

          <div className="grid gap-2">
            <Label>Icon</Label>
            <div className="flex gap-2 flex-wrap">
              {emojis.map(emoji => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, emoji }))}
                  className={`text-xl p-2 rounded-md hover:bg-muted transition-colors ${formData.emoji === emoji ? 'bg-primary/20 ring-1 ring-primary' : ''}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(val) => setFormData(prev => ({ ...prev, category: val }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="time">Time</Label>
              <Input
                type="time"
                id="time"
                value={formData.reminderTime}
                onChange={(e) => setFormData(prev => ({ ...prev, reminderTime: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="desc">Description (Optional)</Label>
            <Textarea
              id="desc"
              placeholder="Why do you want to build this habit?"
              value={formData.description || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>

        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          {habit && onDelete && (
            <Button variant="destructive" size="icon" onClick={() => { onDelete(habit.id); onClose(); }} className="mr-auto">
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={loading || !formData.name?.trim()}>
            {loading ? 'Saving...' : 'Save Habit'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default HabitEditor;
