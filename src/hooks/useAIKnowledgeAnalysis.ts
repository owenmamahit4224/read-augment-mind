
import { useState } from 'react';
import { useKnowledgeProfile } from './useKnowledgeProfile';
import { useToast } from './use-toast';
import { 
  KnowledgeAnalysisService, 
  SuggestedProject, 
  ReadingRecommendation, 
  CuriosityAssessment 
} from '@/services/knowledgeAnalysisService';
import { ErrorService, ErrorType } from '@/services/errorService';

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
      const error = ErrorService.createError(
        ErrorType.VALIDATION,
        'No Knowledge Profile',
        'Please generate a knowledge profile first.'
      );
      
      toast({
        title: error.message,
        description: error.details,
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      // Simulate AI analysis delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      const metrics = KnowledgeAnalysisService.calculateMetrics(profile);
      const suggestedProjects = KnowledgeAnalysisService.generateProjects(profile, metrics);
      const readingRecommendations = KnowledgeAnalysisService.generateReadingRecommendations(profile, metrics);
      const curiosityAssessment = KnowledgeAnalysisService.generateCuriosityAssessment(profile, metrics);

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
      const appError = ErrorService.handleApiError(error);
      ErrorService.logError(appError);
      
      toast({
        title: "Analysis Failed",
        description: ErrorService.getErrorMessage(appError),
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
