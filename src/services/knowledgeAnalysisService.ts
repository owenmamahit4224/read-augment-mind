
import { KnowledgeProfile, KnowledgeProfileEntry } from '@/types/knowledgeProfile';
import { configService } from './configService';

export interface AnalysisMetrics {
  topicDiversity: number;
  advancedRatio: number;
  totalInteractions: number;
  curiosityScore: number;
}

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

export class KnowledgeAnalysisService {
  static calculateMetrics(profile: KnowledgeProfile): AnalysisMetrics {
    const config = configService.get('knowledge');
    const topicDiversity = profile.entries.length;
    const advancedTopics = profile.entries.filter(
      e => e.proficiencyLevel === 'advanced'
    );
    const advancedRatio = advancedTopics.length / profile.entries.length;
    const totalInteractions = profile.totalInteractions;
    const curiosityScore = Math.min(
      (topicDiversity * config.curiosityScoreMultiplier + totalInteractions) / 10,
      100
    );

    return {
      topicDiversity,
      advancedRatio,
      totalInteractions,
      curiosityScore,
    };
  }

  static generateProjects(
    profile: KnowledgeProfile,
    metrics: AnalysisMetrics
  ): SuggestedProject[] {
    const config = configService.get('knowledge');
    const advancedTopics = profile.entries.filter(e => e.proficiencyLevel === 'advanced');
    const projects: SuggestedProject[] = [];

    // Generate projects based on advanced topics
    advancedTopics.slice(0, 3).forEach(topic => {
      projects.push({
        title: `${this.capitalizeFirst(topic.topic)} Innovation Challenge`,
        description: `Create a comprehensive project that combines your expertise in ${topic.topic} with emerging trends and practical applications.`,
        difficulty: 'advanced' as const,
        requiredTopics: [topic.topic, ...topic.relatedTerms.slice(0, 2)],
        estimatedTime: '2-4 weeks',
      });
    });

    // Add cross-topic project if user has multiple advanced areas
    if (advancedTopics.length >= 2) {
      projects.push({
        title: 'Cross-Disciplinary Research Project',
        description: `Explore the intersection between ${advancedTopics[0].topic} and ${advancedTopics[1].topic} to discover novel insights.`,
        difficulty: 'advanced' as const,
        requiredTopics: [advancedTopics[0].topic, advancedTopics[1].topic],
        estimatedTime: '3-6 weeks',
      });
    }

    return projects;
  }

  static generateReadingRecommendations(
    profile: KnowledgeProfile,
    metrics: AnalysisMetrics
  ): ReadingRecommendation[] {
    const beginnerTopics = profile.entries.filter(e => e.proficiencyLevel === 'beginner');
    const advancedTopics = profile.entries.filter(e => e.proficiencyLevel === 'advanced');
    const recommendations: ReadingRecommendation[] = [];

    // Foundation building for beginner topics
    beginnerTopics.slice(0, 4).forEach(topic => {
      recommendations.push({
        title: `Foundations of ${this.capitalizeFirst(topic.topic)}`,
        category: 'Foundation Building',
        reason: `Strengthen your understanding of ${topic.topic} to build a more solid knowledge base.`,
        priority: topic.interactionCount <= 2 ? 'high' as const : 'medium' as const,
        topicGap: topic.topic,
        estimatedReadingTime: '2-3 hours',
      });
    });

    // Advanced reading for strong topics
    if (advancedTopics.length > 0) {
      recommendations.push({
        title: `Advanced Perspectives in ${this.capitalizeFirst(advancedTopics[0].topic)}`,
        category: 'Advanced Study',
        reason: `Deepen your already strong knowledge in ${advancedTopics[0].topic} with cutting-edge research and perspectives.`,
        priority: 'medium' as const,
        topicGap: 'advanced concepts',
        estimatedReadingTime: '4-5 hours',
      });
    }

    return recommendations;
  }

  static generateCuriosityAssessment(
    profile: KnowledgeProfile,
    metrics: AnalysisMetrics
  ): CuriosityAssessment {
    const { topicDiversity, advancedRatio, totalInteractions, curiosityScore } = metrics;
    let curiosityProfile = '';
    let evolution = '';
    const growthAreas: string[] = [];

    if (topicDiversity >= 8 && advancedRatio > 0.3) {
      curiosityProfile = 'You demonstrate a Renaissance-style curiosity with deep expertise across multiple domains. Your learning pattern shows both breadth and depth, indicating a mature intellectual approach.';
      evolution = 'Your interests have evolved from exploratory learning to specialized mastery, while maintaining curiosity about new domains. This suggests a healthy balance between deepening existing knowledge and exploring new frontiers.';
      growthAreas.push('Cross-disciplinary synthesis', 'Knowledge application', 'Teaching others');
    } else if (topicDiversity >= 5 && totalInteractions > 50) {
      curiosityProfile = 'You show strong intellectual curiosity with developing expertise in several areas. Your learning approach is systematic and shows good progress across multiple topics.';
      evolution = 'You\'re in an active knowledge-building phase, showing consistent engagement across various topics. Your interests are broadening while certain areas are beginning to show deeper development.';
      growthAreas.push('Specialization focus', 'Practical application', 'Connecting concepts');
    } else {
      curiosityProfile = 'You\'re beginning to build a diverse knowledge foundation. Your curiosity is emerging across different topics, showing potential for future specialization.';
      evolution = 'You\'re in the early stages of knowledge exploration, which is an exciting time for discovering your true interests and potential areas of expertise.';
      growthAreas.push('Consistent engagement', 'Topic exploration', 'Building foundations');
    }

    return {
      profile: curiosityProfile,
      evolution,
      growthAreas,
      curiosityScore,
    };
  }

  private static capitalizeFirst(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
}
