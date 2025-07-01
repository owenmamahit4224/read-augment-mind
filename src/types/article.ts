
export interface SavedArticle {
  id: string;
  title: string;
  author?: string;
  content: string;
  sourceUrl?: string;
  timestamp: Date;
  tags?: string[];
}

export interface ApiSettings {
  openaiApiKey?: string;
  anthropicApiKey?: string;
  geminiApiKey?: string;
  lmstudioEndpoint?: string;
  selectedProvider: 'openai' | 'anthropic' | 'gemini' | 'lmstudio';
}
