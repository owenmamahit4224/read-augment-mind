
export interface AIAnalysisResult {
  summary: string;
  keyPoints: string[];
  readingLevel: 'beginner' | 'intermediate' | 'advanced';
  estimatedReadingTime: number;
  tags: string[];
}

export interface AIInsight {
  type: 'summary' | 'key-points' | 'questions' | 'related-topics';
  title: string;
  content: string | string[];
}
