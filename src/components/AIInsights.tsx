import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Brain, Lightbulb, MessageSquare, Link, Loader2, AlertCircle } from 'lucide-react';
import { AIInsight, generateInsights } from '@/utils/ai';
import { useToast } from '@/hooks/use-toast';

interface AIInsightsProps {
  title: string;
  content: string;
}

const AIInsights = ({ title, content }: AIInsightsProps) => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const generateAIInsights = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await generateInsights(title, content);
      setInsights(result);
      toast({
        title: "AI Insights Generated",
        description: "Reading insights have been generated successfully!",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate insights';
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

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'summary':
        return <Brain className="h-4 w-4" />;
      case 'key-points':
        return <Lightbulb className="h-4 w-4" />;
      case 'questions':
        return <MessageSquare className="h-4 w-4" />;
      case 'related-topics':
        return <Link className="h-4 w-4" />;
      default:
        return <Brain className="h-4 w-4" />;
    }
  };

  const renderInsightContent = (insight: AIInsight) => {
    if (Array.isArray(insight.content)) {
      return (
        <ul className="space-y-2">
          {insight.content.map((item, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-muted-foreground text-sm mt-1">•</span>
              <span className="text-sm">{item}</span>
            </li>
          ))}
        </ul>
      );
    }
    
    return <p className="text-sm leading-relaxed">{insight.content}</p>;
  };

  if (error) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <AlertCircle className="h-8 w-8 text-destructive mb-4" />
          <p className="text-center text-muted-foreground mb-4">{error}</p>
          <Button onClick={generateAIInsights} variant="outline">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (insights.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Brain className="h-8 w-8 text-muted-foreground mb-4" />
          <p className="text-center text-muted-foreground mb-4">
            Generate AI-powered insights to enhance your reading experience
          </p>
          <Button onClick={generateAIInsights} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating Insights...
              </>
            ) : (
              <>
                <Brain className="h-4 w-4 mr-2" />
                Generate AI Insights
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
        <h3 className="text-lg font-semibold">AI Reading Insights</h3>
        <Button onClick={generateAIInsights} disabled={isLoading} variant="outline" size="sm">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            'Regenerate'
          )}
        </Button>
      </div>

      <div className="grid gap-4">
        {insights.map((insight, index) => (
          <Card key={index}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                {getInsightIcon(insight.type)}
                {insight.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderInsightContent(insight)}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AIInsights;
