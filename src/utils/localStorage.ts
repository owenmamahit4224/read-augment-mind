
import { SavedArticle, ApiSettings } from '@/types/article';

const ARTICLES_KEY = 'saved_articles';
const API_SETTINGS_KEY = 'api_settings';

export const saveArticle = (article: Omit<SavedArticle, 'id' | 'timestamp'>): SavedArticle => {
  const newArticle: SavedArticle = {
    ...article,
    id: crypto.randomUUID(),
    timestamp: new Date(),
  };

  const existingArticles = getSavedArticles();
  const updatedArticles = [newArticle, ...existingArticles];
  
  localStorage.setItem(ARTICLES_KEY, JSON.stringify(updatedArticles));
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
};

export const saveApiSettings = (settings: ApiSettings): void => {
  localStorage.setItem(API_SETTINGS_KEY, JSON.stringify(settings));
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
