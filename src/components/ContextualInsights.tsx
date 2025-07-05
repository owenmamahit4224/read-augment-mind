
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
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="flex items-center gap-2 text-blue-800 text-lg sm:text-xl">
          <Brain className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="text-sm sm:text-base">Contextual Insights</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4">
        {insights.map((insight) => {
          const Icon = getInsightIcon(insight.type);
          return (
            <div 
              key={insight.id} 
              className="border rounded-lg p-3 sm:p-4 bg-white"
            >
              <div className="flex items-start justify-between mb-2 gap-2">
                <div className="flex items-start gap-2 flex-1 min-w-0">
                  <div className={`p-1.5 sm:p-2 rounded-full flex-shrink-0 ${getInsightColor(insight.type)}`}>
                    <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium text-sm sm:text-base leading-tight">{insight.title}</h4>
                    <Badge variant="outline" className="text-xs capitalize mt-1">
                      {insight.type}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {Math.round(insight.confidence * 100)}%
                  </span>
                </div>
              </div>
              
              <p className="text-xs sm:text-sm text-muted-foreground mb-3 leading-relaxed">
                {insight.description}
              </p>
              
              {insight.relatedTopics.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {insight.relatedTopics.slice(0, 3).map((topic, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {topic}
                    </Badge>
                  ))}
                  {insight.relatedTopics.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{insight.relatedTopics.length - 3} more
                    </Badge>
                  )}
                </div>
              )}
              
              {insight.actionable && insight.suggestedAction && (
                <div className="flex items-center justify-between pt-2 border-t gap-2">
                  <span className="text-xs text-muted-foreground flex-1 min-w-0">
                    💡 {insight.suggestedAction}
                  </span>
                  {onActionClick && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onActionClick(insight)}
                      className="text-xs flex-shrink-0"
                    >
                      <span className="hidden sm:inline">Take Action</span>
                      <span className="sm:hidden">Act</span>
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
