
import { useState, useEffect } from 'react';
import { KnowledgeProfile, ContextualInsight, LearningGap } from '@/types/knowledgeProfile';
import { 
  getKnowledgeProfile, 
  saveKnowledgeProfile 
} from '@/utils/knowledgeProfileStorage';
import { generateKnowledgeProfile } from '@/utils/knowledgeProfileGenerator';
import { 
  generateContextualInsights, 
  detectLearningGaps, 
  suggestLearningPath 
} from '@/utils/contextualInsights';
import { useToast } from '@/hooks/use-toast';

export const useKnowledgeProfile = () => {
  const [profile, setProfile] = useState<KnowledgeProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [insights, setInsights] = useState<ContextualInsight[]>([]);
  const [learningGaps, setLearningGaps] = useState<LearningGap[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = () => {
    const storedProfile = getKnowledgeProfile();
    setProfile(storedProfile);
    
    if (storedProfile) {
      const gaps = detectLearningGaps();
      setLearningGaps(gaps);
    }
  };

  const generateProfile = async () => {
    setIsLoading(true);
    try {
      generateKnowledgeProfile();
      loadProfile();
      toast({
        title: "Knowledge Profile Generated",
        description: "Your knowledge profile has been updated based on your vocabulary and study entries.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate knowledge profile.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateInsights = (contentTitle: string, contentText: string) => {
    const newInsights = generateContextualInsights(contentTitle, contentText);
    setInsights(newInsights);
    return newInsights;
  };

  const getLearningPath = (topic: string) => {
    return suggestLearningPath(topic);
  };

  const refreshProfile = () => {
    loadProfile();
  };

  return {
    profile,
    insights,
    learningGaps,
    isLoading,
    generateProfile,
    generateInsights,
    getLearningPath,
    refreshProfile,
  };
};
