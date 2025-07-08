export interface SuggestedProject {
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  requiredTopics: string[];
  estimatedTime: string;
}

export interface ReadingRecommendation {
  title: string;
  category: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  topicGap: string;
  estimatedReadingTime: string;
}

export interface CuriosityAssessment {
  profile: string;
  evolution: string;
  growthAreas: string[];
  curiosityScore: number;
}

export interface AIKnowledgeAnalysis {
  suggestedProjects: SuggestedProject[];
  readingRecommendations: ReadingRecommendation[];
  curiosityAssessment: CuriosityAssessment;
  generatedAt: Date;
}
