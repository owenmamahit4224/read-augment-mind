
export interface SavedArticle {
  id: string;
  title: string;
  author?: string;
  content: string;
  sourceUrl?: string;
  timestamp: Date;
  tags?: string[];
}

export interface StudyListEntry {
  id: string;
  articleId: string;
  articleTitle: string;
  properNoun: string;
  context: string;
  notes?: string;
  timestamp: Date;
}

export interface VocabularyEntry {
  id: string;
  word: string;
  sourceMaterialId: string;
  sourceMaterialTitle: string;
  context: string;
  definition?: string;
  timestamp: Date;
  notes?: string;
}

export interface ApiSettings {
  openaiApiKey?: string;
  anthropicApiKey?: string;
  geminiApiKey?: string;
  lmstudioEndpoint?: string;
  selectedProvider: 'openai' | 'anthropic' | 'gemini' | 'lmstudio';
}
