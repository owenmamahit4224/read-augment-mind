
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Sparkles,
  Loader2
} from 'lucide-react';
import { useKnowledgeProfile } from '@/hooks/useKnowledgeProfile';
import { useAIKnowledgeAnalysis } from '@/hooks/useAIKnowledgeAnalysis';
import SuggestedProjects from './SuggestedProjects';
import RecommendedReading from './RecommendedReading';
import CuriosityAssessment from './CuriosityAssessment';

const AIKnowledgeAnalyzer = () => {
  const { profile } = useKnowledgeProfile();
  const { 
    analysis, 
    isAnalyzing, 
    analyzeKnowledge 
  } = useAIKnowledgeAnalysis();

  if (!profile || profile.entries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Knowledge Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Brain className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            Build your knowledge profile first to unlock AI-powered insights about your learning journey.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            AI Knowledge Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!analysis ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground mb-4">
                Get AI-powered insights about your knowledge profile, suggested projects, and learning recommendations.
              </p>
              <Button onClick={analyzeKnowledge} disabled={isAnalyzing}>
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    Analyze My Knowledge
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <SuggestedProjects projects={analysis.suggestedProjects} />
              <RecommendedReading recommendations={analysis.readingRecommendations} />
              <CuriosityAssessment assessment={analysis.curiosityAssessment} />

              <div className="pt-4 border-t">
                <Button 
                  onClick={analyzeKnowledge} 
                  disabled={isAnalyzing} 
                  variant="outline"
                  size="sm"
                >
                  {isAnalyzing ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    'Refresh Analysis'
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AIKnowledgeAnalyzer;
