import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Lightbulb } from 'lucide-react';
import { AIKnowledgeAnalysis } from '@/types/aiAnalysis';

interface SuggestedProjectsProps {
  projects: AIKnowledgeAnalysis['suggestedProjects'];
}

const SuggestedProjects: React.FC<SuggestedProjectsProps> = ({ projects }) => {
  if (!projects || projects.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 className="flex items-center gap-2 font-semibold mb-3">
        <Lightbulb className="h-4 w-4" />
        Suggested Creative Projects
      </h3>
      <div className="grid gap-3">
        {projects.map((project, index) => (
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
  );
};

export default SuggestedProjects;
