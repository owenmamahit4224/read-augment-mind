import React from 'react';
import { Badge } from '@/components/ui/badge';
import { TrendingUp } from 'lucide-react';
import { AIKnowledgeAnalysis } from '@/types/aiAnalysis';

interface CuriosityAssessmentProps {
  assessment: AIKnowledgeAnalysis['curiosityAssessment'];
}

const CuriosityAssessment: React.FC<CuriosityAssessmentProps> = ({ assessment }) => {
  if (!assessment) {
    return null;
  }

  return (
    <div>
      <h3 className="flex items-center gap-2 font-semibold mb-3">
        <TrendingUp className="h-4 w-4" />
        Your Learning Journey
      </h3>
      <div className="border rounded-lg p-4 space-y-4">
        <div>
          <h4 className="font-medium mb-2">Curiosity Profile</h4>
          <p className="text-sm text-muted-foreground">
            {assessment.profile}
          </p>
        </div>
        
        <div>
          <h4 className="font-medium mb-2">Interest Evolution</h4>
          <p className="text-sm text-muted-foreground">
            {assessment.evolution}
          </p>
        </div>
        
        <div>
          <h4 className="font-medium mb-2">Growth Areas</h4>
          <div className="flex flex-wrap gap-2">
            {assessment.growthAreas.map((area, index) => (
              <Badge key={index} variant="outline">
                {area}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CuriosityAssessment;
