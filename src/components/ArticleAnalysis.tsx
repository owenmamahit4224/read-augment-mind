import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, Target, BookOpen, Tags, Loader2, AlertCircle } from 'lucide-react';
import { AIAnalysisResult, analyzeArticle } from '@/utils/ai';
import { useToast } from '@/hooks/use-toast';

interface ArticleAnalysisProps {
  title: string;
  content: string;
}

const ArticleAnalysis = ({ title, content }: ArticleAnalysisProps) => {
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const generateAnalysis = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await analyzeArticle(title, content);
      setAnalysis(result);
      toast({
        title: "Analysis Complete",
        description: "Article analysis has been generated successfully!",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze article';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getReadingLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-500';
      case 'intermediate':
        return 'bg-yellow-500';
      case 'advanced':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getReadingLevelProgress = (level: string) => {
    switch (level) {
      case 'beginner':
        return 33;
      case 'intermediate':
        return 66;
      case 'advanced':
        return 100;
      default:
        return 0;
    }
  };

  if (error) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <AlertCircle className="h-8 w-8 text-destructive mb-4" />
          <p className="text-center text-muted-foreground mb-4">{error}</p>
          <Button onClick={generateAnalysis} variant="outline">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!analysis) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Target className="h-8 w-8 text-muted-foreground mb-4" />
          <p className="text-center text-muted-foreground mb-4">
            Get AI-powered analysis of this article's complexity and key insights
          </p>
          <Button onClick={generateAnalysis} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing Article...
              </>
            ) : (
              <>
                <Target className="h-4 w-4 mr-2" />
                Analyze Article
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Article Analysis</h3>
        <Button onClick={generateAnalysis} disabled={isLoading} variant="outline" size="sm">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            'Re-analyze'
          )}
        </Button>
      </div>

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {analysis.summary}
          </p>
        </CardContent>
      </Card>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Reading Time</span>
            </div>
            <div className="text-2xl font-bold">{analysis.estimatedReadingTime} min</div>
            <p className="text-xs text-muted-foreground">Estimated reading time</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Reading Level</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="capitalize">
                  {analysis.readingLevel}
                </Badge>
              </div>
              <Progress 
                value={getReadingLevelProgress(analysis.readingLevel)} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Points */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Key Points</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {analysis.keyPoints.map((point, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-muted-foreground text-sm mt-1">•</span>
                <span className="text-sm">{point}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Tags */}
      {analysis.tags && analysis.tags.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Tags className="h-4 w-4" />
              Suggested Tags
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {analysis.tags.map((tag, index) => (
                <Badge key={index} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ArticleAnalysis;
