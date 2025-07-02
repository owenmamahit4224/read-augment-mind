
import { StudyListEntry } from '@/types/article';

const STUDY_LIST_KEY = 'study_list';

export const saveStudyListEntry = (entry: Omit<StudyListEntry, 'id' | 'timestamp'>): StudyListEntry => {
  const newEntry: StudyListEntry = {
    ...entry,
    id: crypto.randomUUID(),
    timestamp: new Date(),
  };

  const existingEntries = getStudyListEntries();
  const updatedEntries = [newEntry, ...existingEntries];
  
  localStorage.setItem(STUDY_LIST_KEY, JSON.stringify(updatedEntries));
  return newEntry;
};

export const getStudyListEntries = (): StudyListEntry[] => {
  const stored = localStorage.getItem(STUDY_LIST_KEY);
  if (!stored) return [];
  
  try {
    const entries = JSON.parse(stored);
    return entries.map((entry: any) => ({
      ...entry,
      timestamp: new Date(entry.timestamp),
    }));
  } catch (error) {
    console.error('Error parsing study list entries:', error);
    return [];
  }
};

export const updateStudyListEntry = (id: string, updates: Partial<StudyListEntry>): void => {
  const entries = getStudyListEntries();
  const updatedEntries = entries.map(entry =>
    entry.id === id ? { ...entry, ...updates } : entry
  );
  localStorage.setItem(STUDY_LIST_KEY, JSON.stringify(updatedEntries));
};

export const deleteStudyListEntry = (id: string): void => {
  const entries = getStudyListEntries();
  const filtered = entries.filter(entry => entry.id !== id);
  localStorage.setItem(STUDY_LIST_KEY, JSON.stringify(filtered));
};

export const getStudyListEntriesByArticle = (articleId: string): StudyListEntry[] => {
  return getStudyListEntries().filter(entry => entry.articleId === articleId);
};
