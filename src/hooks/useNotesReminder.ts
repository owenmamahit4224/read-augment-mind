
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface NotesReminderEntry {
  id: string;
  type: 'study' | 'vocabulary';
  itemName: string;
  hasNotes: boolean;
  lastInteracted: Date;
}

export const useNotesReminder = () => {
  const [reminderEntries, setReminderEntries] = useState<NotesReminderEntry[]>([]);
  const { toast } = useToast();

  // Track an entry for reminder purposes
  const trackEntry = (id: string, type: 'study' | 'vocabulary', itemName: string, hasNotes: boolean) => {
    setReminderEntries(prev => {
      const existing = prev.find(entry => entry.id === id);
      if (existing) {
        return prev.map(entry => 
          entry.id === id 
            ? { ...entry, hasNotes, lastInteracted: new Date() }
            : entry
        );
      }
      return [...prev, { id, type, itemName, hasNotes, lastInteracted: new Date() }];
    });
  };

  // Remove entry from tracking
  const untrackEntry = (id: string) => {
    setReminderEntries(prev => prev.filter(entry => entry.id !== id));
  };

  // Check for entries that need reminders
  const checkForReminders = () => {
    const now = new Date();
    const entriesNeedingReminders = reminderEntries.filter(entry => {
      const timeSinceInteraction = now.getTime() - entry.lastInteracted.getTime();
      const fiveMinutes = 5 * 60 * 1000;
      return !entry.hasNotes && timeSinceInteraction > fiveMinutes;
    });

    entriesNeedingReminders.forEach(entry => {
      toast({
        title: "Don't forget to add notes! 📝",
        description: `Consider adding notes for "${entry.itemName}" to help with your learning.`,
        duration: 8000,
      });
      
      // Update last interacted to avoid showing the same reminder repeatedly
      setReminderEntries(prev => 
        prev.map(e => 
          e.id === entry.id 
            ? { ...e, lastInteracted: new Date() }
            : e
        )
      );
    });
  };

  // Set up periodic reminder checks
  useEffect(() => {
    const interval = setInterval(checkForReminders, 2 * 60 * 1000); // Check every 2 minutes
    return () => clearInterval(interval);
  }, [reminderEntries]);

  // Handle page visibility change (when user switches tabs or closes)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page is being hidden, check for immediate reminders
        const entriesNeedingNotes = reminderEntries.filter(entry => !entry.hasNotes);
        if (entriesNeedingNotes.length > 0) {
          // Show a gentle reminder toast for when they return
          setTimeout(() => {
            if (entriesNeedingNotes.length === 1) {
              toast({
                title: "Welcome back! 👋",
                description: `Don't forget to add notes for "${entriesNeedingNotes[0].itemName}".`,
                duration: 6000,
              });
            } else {
              toast({
                title: "Welcome back! 👋",
                description: `You have ${entriesNeedingNotes.length} items that could use some notes.`,
                duration: 6000,
              });
            }
          }, 1000);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [reminderEntries, toast]);

  return {
    trackEntry,
    untrackEntry,
    checkForReminders,
  };
};
