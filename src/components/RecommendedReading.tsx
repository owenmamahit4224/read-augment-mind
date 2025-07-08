import React from 'react';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, Target } from 'lucide-react';
import { AIKnowledgeAnalysis } from '@/types/aiAnalysis';

interface RecommendedReadingProps {
  recommendations: AIKnowledgeAnalysis['readingRecommendations'];
}

const RecommendedReading: React.FC<RecommendedReadingProps> = ({ recommendations }) => {
  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 className="flex items-center gap-2 font-semibold mb-3">
        <BookOpen className="h-4 w-4" />
        Recommended Reading
      </h3>
      <div className="grid gap-3">
        {recommendations.map((rec, index) => (
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
  );
};

export default RecommendedReading;
