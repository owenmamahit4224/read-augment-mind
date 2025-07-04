
import { KnowledgeProfile, KnowledgeProfileEntry } from '@/types/knowledgeProfile';

const KNOWLEDGE_PROFILE_KEY = 'knowledge_profile';

export const saveKnowledgeProfile = (profile: KnowledgeProfile): void => {
  localStorage.setItem(KNOWLEDGE_PROFILE_KEY, JSON.stringify(profile));
};

export const getKnowledgeProfile = (): KnowledgeProfile | null => {
  const stored = localStorage.getItem(KNOWLEDGE_PROFILE_KEY);
  if (!stored) return null;
  
  try {
    const profile = JSON.parse(stored);
    return {
      ...profile,
      lastUpdated: new Date(profile.lastUpdated),
      entries: profile.entries.map((entry: any) => ({
        ...entry,
        lastInteracted: new Date(entry.lastInteracted),
      })),
    };
  } catch (error) {
    console.error('Error parsing knowledge profile:', error);
    return null;
  }
};

export const updateKnowledgeProfileEntry = (
  entryId: string, 
  updates: Partial<KnowledgeProfileEntry>
): void => {
  const profile = getKnowledgeProfile();
  if (!profile) return;

  const updatedEntries = profile.entries.map(entry =>
    entry.id === entryId ? { ...entry, ...updates } : entry
  );

  const updatedProfile: KnowledgeProfile = {
    ...profile,
    entries: updatedEntries,
    lastUpdated: new Date(),
  };

  saveKnowledgeProfile(updatedProfile);
};

export const addKnowledgeProfileEntry = (entry: Omit<KnowledgeProfileEntry, 'id'>): void => {
  const profile = getKnowledgeProfile();
  const newEntry: KnowledgeProfileEntry = {
    ...entry,
    id: crypto.randomUUID(),
  };

  if (profile) {
    const updatedProfile: KnowledgeProfile = {
      ...profile,
      entries: [...profile.entries, newEntry],
      lastUpdated: new Date(),
      totalInteractions: profile.totalInteractions + 1,
    };
    saveKnowledgeProfile(updatedProfile);
  } else {
    const newProfile: KnowledgeProfile = {
      id: crypto.randomUUID(),
      entries: [newEntry],
      lastUpdated: new Date(),
      totalInteractions: 1,
    };
    saveKnowledgeProfile(newProfile);
  }
};

export const getKnowledgeProfileByTopic = (topic: string): KnowledgeProfileEntry | null => {
  const profile = getKnowledgeProfile();
  if (!profile) return null;
  
  return profile.entries.find(entry => 
    entry.topic.toLowerCase() === topic.toLowerCase()
  ) || null;
};
