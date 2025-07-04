
export interface KnowledgeProfileEntry {
  id: string;
  topic: string;
  keywords: string[];
  relatedTerms: string[];
  proficiencyLevel: 'beginner' | 'intermediate' | 'advanced';
  interactionCount: number;
  lastInteracted: Date;
  sources: string[]; // Article IDs where this knowledge was encountered
}

export interface KnowledgeProfile {
  id: string;
  userId?: string;
  entries: KnowledgeProfileEntry[];
  lastUpdated: Date;
  totalInteractions: number;
}

export interface ContextualInsight {
  id: string;
  type: 'connection' | 'gap' | 'reinforcement' | 'expansion';
  title: string;
  description: string;
  relatedTopics: string[];
  confidence: number; // 0-1
  actionable: boolean;
  suggestedAction?: string;
}

export interface LearningGap {
  topic: string;
  missingConcepts: string[];
  suggestedResources: string[];
  priority: 'low' | 'medium' | 'high';
}
