
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  BookOpen, 
  Lightbulb, 
  TrendingUp, 
  Sparkles,
  Clock,
  Target,
  Loader2
} from 'lucide-react';
import { useKnowledgeProfile } from '@/hooks/useKnowledgeProfile';
import { useAIKnowledgeAnalysis } from '@/hooks/useAIKnowledgeAnalysis';

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
              {/* Creative Projects */}
              <div>
                <h3 className="flex items-center gap-2 font-semibold mb-3">
                  <Lightbulb className="h-4 w-4" />
                  Suggested Creative Projects
                </h3>
                <div className="grid gap-3">
                  {analysis.suggestedProjects.map((project, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium">{project.title}</h4>
                        <Badge variant="outline">{project.difficulty}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {project.requiredTopics.map((topic, topicIndex) => (
                          <Badge key={topicIndex} variant="secondary" className="text-xs">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reading Recommendations */}
              <div>
                <h3 className="flex items-center gap-2 font-semibold mb-3">
                  <BookOpen className="h-4 w-4" />
                  Recommended Reading
                </h3>
                <div className="grid gap-3">
                  {analysis.readingRecommendations.map((rec, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium">{rec.title}</h4>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{rec.category}</Badge>
                          <Badge variant="secondary">{rec.priority}</Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {rec.reason}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {rec.estimatedReadingTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <Target className="h-3 w-3" />
                          Fills gap in {rec.topicGap}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Curiosity Assessment */}
              <div>
                <h3 className="flex items-center gap-2 font-semibold mb-3">
                  <TrendingUp className="h-4 w-4" />
                  Your Learning Journey
                </h3>
                <div className="border rounded-lg p-4 space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Curiosity Profile</h4>
                    <p className="text-sm text-muted-foreground">
                      {analysis.curiosityAssessment.profile}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Interest Evolution</h4>
                    <p className="text-sm text-muted-foreground">
                      {analysis.curiosityAssessment.evolution}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Growth Areas</h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.curiosityAssessment.growthAreas.map((area, index) => (
                        <Badge key={index} variant="outline">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

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
