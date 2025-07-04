
import { useState } from 'react';
import { useKnowledgeProfile } from './useKnowledgeProfile';
import { useToast } from './use-toast';

interface SuggestedProject {
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  requiredTopics: string[];
  estimatedTime: string;
}

interface ReadingRecommendation {
  title: string;
  category: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  topicGap: string;
  estimatedReadingTime: string;
}

interface CuriosityAssessment {
  profile: string;
  evolution: string;
  growthAreas: string[];
  curiosityScore: number;
}

interface AIKnowledgeAnalysis {
  suggestedProjects: SuggestedProject[];
  readingRecommendations: ReadingRecommendation[];
  curiosityAssessment: CuriosityAssessment;
  generatedAt: Date;
}

export const useAIKnowledgeAnalysis = () => {
  const [analysis, setAnalysis] = useState<AIKnowledgeAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { profile } = useKnowledgeProfile();
  const { toast } = useToast();

  const analyzeKnowledge = async () => {
    if (!profile) {
      toast({
        title: "No Knowledge Profile",
        description: "Please generate a knowledge profile first.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      // Simulate AI analysis - in a real app, this would call an AI service
      await new Promise(resolve => setTimeout(resolve, 2000));

      const topTopics = profile.entries
        .sort((a, b) => b.interactionCount - a.interactionCount)
        .slice(0, 5);

      const beginnerTopics = profile.entries.filter(e => e.proficiencyLevel === 'beginner');
      const advancedTopics = profile.entries.filter(e => e.proficiencyLevel === 'advanced');

      // Generate creative projects based on user's advanced topics
      const suggestedProjects: SuggestedProject[] = advancedTopics.slice(0, 3).map(topic => ({
        title: `${topic.topic.charAt(0).toUpperCase() + topic.topic.slice(1)} Innovation Challenge`,
        description: `Create a comprehensive project that combines your expertise in ${topic.topic} with emerging trends and practical applications.`,
        difficulty: 'advanced' as const,
        requiredTopics: [topic.topic, ...topic.relatedTerms.slice(0, 2)],
        estimatedTime: '2-4 weeks',
      }));

      // Add cross-topic project if user has multiple advanced areas
      if (advancedTopics.length >= 2) {
        suggestedProjects.push({
          title: `Cross-Disciplinary Research Project`,
          description: `Explore the intersection between ${advancedTopics[0].topic} and ${advancedTopics[1].topic} to discover novel insights.`,
          difficulty: 'advanced' as const,
          requiredTopics: [advancedTopics[0].topic, advancedTopics[1].topic],
          estimatedTime: '3-6 weeks',
        });
      }

      // Generate reading recommendations based on knowledge gaps
      const readingRecommendations: ReadingRecommendation[] = beginnerTopics.slice(0, 4).map(topic => ({
        title: `Foundations of ${topic.topic.charAt(0).toUpperCase() + topic.topic.slice(1)}`,
        category: 'Foundation Building',
        reason: `Strengthen your understanding of ${topic.topic} to build a more solid knowledge base.`,
        priority: topic.interactionCount <= 2 ? 'high' as const : 'medium' as const,
        topicGap: topic.topic,
        estimatedReadingTime: '2-3 hours',
      }));

      // Add advanced reading for strong topics
      if (advancedTopics.length > 0) {
        readingRecommendations.push({
          title: `Advanced Perspectives in ${advancedTopics[0].topic.charAt(0).toUpperCase() + advancedTopics[0].topic.slice(1)}`,
          category: 'Advanced Study',
          reason: `Deepen your already strong knowledge in ${advancedTopics[0].topic} with cutting-edge research and perspectives.`,
          priority: 'medium' as const,
          topicGap: 'advanced concepts',
          estimatedReadingTime: '4-5 hours',
        });
      }

      // Generate curiosity assessment
      const totalInteractions = profile.totalInteractions;
      const topicDiversity = profile.entries.length;
      const advancedRatio = advancedTopics.length / profile.entries.length;

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

      const curiosityAssessment: CuriosityAssessment = {
        profile: curiosityProfile,
        evolution,
        growthAreas,
        curiosityScore: Math.min((topicDiversity * 10 + totalInteractions) / 10, 100),
      };

      const newAnalysis: AIKnowledgeAnalysis = {
        suggestedProjects,
        readingRecommendations,
        curiosityAssessment,
        generatedAt: new Date(),
      };

      setAnalysis(newAnalysis);

      toast({
        title: "Analysis Complete",
        description: "Your knowledge profile has been analyzed with personalized insights.",
      });

    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze your knowledge profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    analysis,
    isAnalyzing,
    analyzeKnowledge,
  };
};
