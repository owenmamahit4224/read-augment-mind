
import { SavedArticle, ApiSettings } from '@/types/article';
import { syncUserData, loadUserData, UserData } from '@/services/userService';
import { KnowledgeProfile, KnowledgeProfileEntry } from '@/types/knowledgeProfile';
import { StudyListEntry } from '@/types/article';
import { VocabularyEntry } from '@/types/article';

const ARTICLES_KEY = 'saved_articles';
const API_SETTINGS_KEY = 'api_settings';
const KNOWLEDGE_PROFILE_KEY = 'knowledge_profile';
const STUDY_LIST_KEY = 'study_list';
const VOCABULARY_KEY = 'new_vocabulary_list';

const updateAndSyncAllData = async (
  articles: SavedArticle[],
  apiSettings: ApiSettings,
  knowledgeProfile: KnowledgeProfile | null,
  studyList: StudyListEntry[],
  vocabulary: VocabularyEntry[]
) => {
  const dataToSync: UserData = {
    articles,
    apiSettings,
    knowledgeProfile,
    studyList,
    vocabulary,
  };
  try {
    await syncUserData(dataToSync);
  } catch (error) {
    console.error('Failed to sync all user data:', error);
  }
};

export const saveArticle = (article: Omit<SavedArticle, 'id' | 'timestamp'>): SavedArticle => {
  const newArticle: SavedArticle = {
    ...article,
    id: crypto.randomUUID(),
    timestamp: new Date(),
  };

  const existingArticles = getSavedArticles();
  const updatedArticles = [newArticle, ...existingArticles];
  
  localStorage.setItem(ARTICLES_KEY, JSON.stringify(updatedArticles));
  
  // Trigger sync for all data
  updateAndSyncAllData(
    updatedArticles,
    getApiSettings(),
    getKnowledgeProfile(),
    getStudyListEntries(),
    getVocabularyEntries()
  );

  return newArticle;
};

export const getSavedArticles = (): SavedArticle[] => {
  const stored = localStorage.getItem(ARTICLES_KEY);
  if (!stored) return [];
  
  try {
    const articles = JSON.parse(stored);
    return articles.map((article: any) => ({
      ...article,
      timestamp: new Date(article.timestamp),
    }));
  } catch (error) {
    console.error('Error parsing saved articles:', error);
    return [];
  }
};

export const deleteArticle = (id: string): void => {
  const articles = getSavedArticles();
  const filtered = articles.filter(article => article.id !== id);
  localStorage.setItem(ARTICLES_KEY, JSON.stringify(filtered));

  // Trigger sync for all data
  updateAndSyncAllData(
    filtered,
    getApiSettings(),
    getKnowledgeProfile(),
    getStudyListEntries(),
    getVocabularyEntries()
  );
};

export const saveApiSettings = (settings: ApiSettings): void => {
  localStorage.setItem(API_SETTINGS_KEY, JSON.stringify(settings));

  // Trigger sync for all data
  updateAndSyncAllData(
    getSavedArticles(),
    settings,
    getKnowledgeProfile(),
    getStudyListEntries(),
    getVocabularyEntries()
  );
};

export const getApiSettings = (): ApiSettings => {
  const stored = localStorage.getItem(API_SETTINGS_KEY);
  if (!stored) {
    return { selectedProvider: 'openai' };
  }
  
  try {
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error parsing API settings:', error);
    return { selectedProvider: 'openai' };
  }
};

// Existing Knowledge Profile functions (moved from knowledgeProfileStorage.ts)
export const saveKnowledgeProfile = (profile: KnowledgeProfile): void => {
  localStorage.setItem(KNOWLEDGE_PROFILE_KEY, JSON.stringify(profile));
  updateAndSyncAllData(
    getSavedArticles(),
    getApiSettings(),
    profile,
    getStudyListEntries(),
    getVocabularyEntries()
  );
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

  saveKnowledgeProfile(updatedProfile); // This will trigger sync
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
    saveKnowledgeProfile(updatedProfile); // This will trigger sync
  } else {
    const newProfile: KnowledgeProfile = {
      id: crypto.randomUUID(),
      entries: [newEntry],
      lastUpdated: new Date(),
      totalInteractions: 1,
    };
    saveKnowledgeProfile(newProfile); // This will trigger sync
  }
};

export const getKnowledgeProfileByTopic = (topic: string): KnowledgeProfileEntry | null => {
  const profile = getKnowledgeProfile();
  if (!profile) return null;
  
  return profile.entries.find(entry => 
    entry.topic.toLowerCase() === topic.toLowerCase()
  ) || null;
};

// Existing Study List functions (moved from studyListStorage.ts)
export const saveStudyListEntry = (entry: Omit<StudyListEntry, 'id' | 'timestamp'>): StudyListEntry => {
  const newEntry: StudyListEntry = {
    ...entry,
    id: crypto.randomUUID(),
    timestamp: new Date(),
  };

  const existingEntries = getStudyListEntries();
  const updatedEntries = [newEntry, ...existingEntries];
  
  localStorage.setItem(STUDY_LIST_KEY, JSON.stringify(updatedEntries));
  
  updateAndSyncAllData(
    getSavedArticles(),
    getApiSettings(),
    getKnowledgeProfile(),
    updatedEntries,
    getVocabularyEntries()
  );

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
  
  updateAndSyncAllData(
    getSavedArticles(),
    getApiSettings(),
    getKnowledgeProfile(),
    updatedEntries,
    getVocabularyEntries()
  );
};

export const deleteStudyListEntry = (id: string): void => {
  const entries = getStudyListEntries();
  const filtered = entries.filter(entry => entry.id !== id);
  localStorage.setItem(STUDY_LIST_KEY, JSON.stringify(filtered));
  
  updateAndSyncAllData(
    getSavedArticles(),
    getApiSettings(),
    getKnowledgeProfile(),
    filtered,
    getVocabularyEntries()
  );
};

export const getStudyListEntriesByArticle = (articleId: string): StudyListEntry[] => {
  return getStudyListEntries().filter(entry => entry.articleId === articleId);
};

// Existing Vocabulary functions (moved from vocabularyStorage.ts)
export const saveVocabularyEntry = (entry: Omit<VocabularyEntry, 'id' | 'timestamp'>): VocabularyEntry => {
  const newEntry: VocabularyEntry = {
    ...entry,
    id: crypto.randomUUID(),
    timestamp: new Date(),
  };

  const existingEntries = getVocabularyEntries();
  const updatedEntries = [newEntry, ...existingEntries];
  
  localStorage.setItem(VOCABULARY_KEY, JSON.stringify(updatedEntries));
  
  updateAndSyncAllData(
    getSavedArticles(),
    getApiSettings(),
    getKnowledgeProfile(),
    getStudyListEntries(),
    updatedEntries
  );

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
  
  updateAndSyncAllData(
    getSavedArticles(),
    getApiSettings(),
    getKnowledgeProfile(),
    getStudyListEntries(),
    updatedEntries
  );
};

export const deleteVocabularyEntry = (id: string): void => {
  const entries = getVocabularyEntries();
  const filtered = entries.filter(entry => entry.id !== id);
  localStorage.setItem(VOCABULARY_KEY, JSON.stringify(filtered));
  
  updateAndSyncAllData(
    getSavedArticles(),
    getApiSettings(),
    getKnowledgeProfile(),
    getStudyListEntries(),
    filtered
  );
};

export const getVocabularyEntriesBySource = (sourceMaterialId: string): VocabularyEntry[] => {
  return getVocabularyEntries().filter(entry => entry.sourceMaterialId === sourceMaterialId);
};

export const initializeUserData = async () => {
  try {
    const data = await loadUserData();
    if (data) {
      localStorage.setItem(ARTICLES_KEY, JSON.stringify(data.articles));
      localStorage.setItem(API_SETTINGS_KEY, JSON.stringify(data.apiSettings));
      if (data.knowledgeProfile) {
        localStorage.setItem(KNOWLEDGE_PROFILE_KEY, JSON.stringify(data.knowledgeProfile));
      }
      localStorage.setItem(STUDY_LIST_KEY, JSON.stringify(data.studyList));
      localStorage.setItem(VOCABULARY_KEY, JSON.stringify(data.vocabulary));
      console.log('Local storage initialized with synced data.');
    } else {
      console.log('No synced data found, local storage remains as is.');
    }
  } catch (error) {
    console.error('Error initializing user data from sync service:', error);
  }
};
