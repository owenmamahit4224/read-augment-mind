
import { VocabularyEntry } from '@/types/article';

const VOCABULARY_KEY = 'new_vocabulary_list';

export const saveVocabularyEntry = (entry: Omit<VocabularyEntry, 'id' | 'timestamp'>): VocabularyEntry => {
  const newEntry: VocabularyEntry = {
    ...entry,
    id: crypto.randomUUID(),
    timestamp: new Date(),
  };

  const existingEntries = getVocabularyEntries();
  const updatedEntries = [newEntry, ...existingEntries];
  
  localStorage.setItem(VOCABULARY_KEY, JSON.stringify(updatedEntries));
  return newEntry;
};

export const getVocabularyEntries = (): VocabularyEntry[] => {
  const stored = localStorage.getItem(VOCABULARY_KEY);
  if (!stored) return [];
  
  try {
    const entries = JSON.parse(stored);
    return entries.map((entry: any) => ({
      ...entry,
      timestamp: new Date(entry.timestamp),
    }));
  } catch (error) {
    console.error('Error parsing vocabulary entries:', error);
    return [];
  }
};

export const updateVocabularyEntry = (id: string, updates: Partial<VocabularyEntry>): void => {
  const entries = getVocabularyEntries();
  const updatedEntries = entries.map(entry =>
    entry.id === id ? { ...entry, ...updates } : entry
  );
  localStorage.setItem(VOCABULARY_KEY, JSON.stringify(updatedEntries));
};

export const deleteVocabularyEntry = (id: string): void => {
  const entries = getVocabularyEntries();
  const filtered = entries.filter(entry => entry.id !== id);
  localStorage.setItem(VOCABULARY_KEY, JSON.stringify(filtered));
};

export const getVocabularyEntriesBySource = (sourceMaterialId: string): VocabularyEntry[] => {
  return getVocabularyEntries().filter(entry => entry.sourceMaterialId === sourceMaterialId);
};
