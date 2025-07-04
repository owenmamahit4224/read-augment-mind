
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Lightbulb, 
  ArrowRight, 
  Brain, 
  TrendingUp, 
  AlertCircle,
  Plus 
} from 'lucide-react';
import { ContextualInsight } from '@/types/knowledgeProfile';

interface ContextualInsightsProps {
  insights: ContextualInsight[];
  onActionClick?: (insight: ContextualInsight) => void;
}

const ContextualInsights = ({ insights, onActionClick }: ContextualInsightsProps) => {
  if (insights.length === 0) {
    return null;
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'connection':
        return ArrowRight;
      case 'gap':
        return AlertCircle;
      case 'reinforcement':
        return TrendingUp;
      case 'expansion':
        return Plus;
      default:
        return Lightbulb;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'connection':
        return 'text-blue-600 bg-blue-50';
      case 'gap':
        return 'text-orange-600 bg-orange-50';
      case 'reinforcement':
        return 'text-green-600 bg-green-50';
      case 'expansion':
        return 'text-purple-600 bg-purple-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <Card className="border-2 border-blue-200 bg-blue-50/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <Brain className="h-5 w-5" />
          Contextual Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight) => {
          const Icon = getInsightIcon(insight.type);
          return (
            <div 
              key={insight.id} 
              className="border rounded-lg p-4 bg-white"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-full ${getInsightColor(insight.type)}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-medium">{insight.title}</h4>
                    <Badge variant="outline" className="text-xs capitalize">
                      {insight.type}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground">
                    {Math.round(insight.confidence * 100)}% confidence
                  </span>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground mb-3">
                {insight.description}
              </p>
              
              {insight.relatedTopics.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {insight.relatedTopics.map((topic, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {topic}
                    </Badge>
                  ))}
                </div>
              )}
              
              {insight.actionable && insight.suggestedAction && (
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-xs text-muted-foreground">
                    💡 {insight.suggestedAction}
                  </span>
                  {onActionClick && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onActionClick(insight)}
                    >
                      Take Action
                    </Button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default ContextualInsights;
