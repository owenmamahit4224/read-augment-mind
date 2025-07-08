import { SavedArticle, ApiSettings, StudyListEntry, VocabularyEntry } from '@/types/article';
import { KnowledgeProfile } from '@/types/knowledgeProfile';

// Define a type for the aggregated user data
export interface UserData {
  articles: SavedArticle[];
  apiSettings: ApiSettings;
  knowledgeProfile: KnowledgeProfile | null;
  studyList: StudyListEntry[];
  vocabulary: VocabularyEntry[];
}

const SYNC_SECRET_CODE = import.meta.env.VITE_SYNC_SECRET_CODE; // Assuming a Vite environment variable

const getUserId = (): string => {
  let userId = localStorage.getItem('user_id');
  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem('user_id', userId);
  }
  return userId;
};

export const syncUserData = async (data: UserData): Promise<void> => {
  const userId = getUserId();
  try {
    const response = await fetch(`/api/sync-user-data?userId=${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-sync-secret': SYNC_SECRET_CODE,
      },
      body: JSON.stringify({ data }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Failed to sync user data:', errorData.error);
      throw new Error(errorData.error || 'Failed to sync user data');
    }
    console.log('User data synced successfully.');
  } catch (error) {
    console.error('Error syncing user data:', error);
    throw error;
  }
};

export const loadUserData = async (): Promise<UserData | null> => {
  const userId = getUserId();
  try {
    const response = await fetch(`/api/sync-user-data?userId=${userId}`, {
      method: 'GET',
      headers: {
        'x-sync-secret': SYNC_SECRET_CODE,
      },
    });

    if (response.status === 404) {
      console.log('No existing user data found for this user.');
      return null;
    }

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Failed to load user data:', errorData.error);
      throw new Error(errorData.error || 'Failed to load user data');
    }

    const { data } = await response.json();
    // Parse dates back into Date objects if necessary
    if (data.articles) {
      data.articles = data.articles.map((article: any) => ({
        ...article,
        timestamp: new Date(article.timestamp),
      }));
    }
    if (data.knowledgeProfile && data.knowledgeProfile.lastUpdated) {
      data.knowledgeProfile.lastUpdated = new Date(data.knowledgeProfile.lastUpdated);
      data.knowledgeProfile.entries = data.knowledgeProfile.entries.map((entry: any) => ({
        ...entry,
        lastInteracted: new Date(entry.lastInteracted),
      }));
    }
    if (data.studyList) {
      data.studyList = data.studyList.map((entry: any) => ({
        ...entry,
        timestamp: new Date(entry.timestamp),
      }));
    }
    if (data.vocabulary) {
      data.vocabulary = data.vocabulary.map((entry: any) => ({
        ...entry,
        timestamp: new Date(entry.timestamp),
      }));
    }

    console.log('User data loaded successfully.');
    return data as UserData;
  } catch (error) {
    console.error('Error loading user data:', error);
    throw error;
  }
};
