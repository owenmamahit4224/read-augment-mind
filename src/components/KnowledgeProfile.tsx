
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, BookOpen, TrendingUp, AlertCircle, Loader2 } from 'lucide-react';
import { useKnowledgeProfile } from '@/hooks/useKnowledgeProfile';

const KnowledgeProfile = () => {
  const { 
    profile, 
    learningGaps, 
    isLoading, 
    generateProfile 
  } = useKnowledgeProfile();

  const getProficiencyColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-yellow-500';
      case 'intermediate':
        return 'bg-blue-500';
      case 'advanced':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getProficiencyProgress = (level: string) => {
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

  if (!profile) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Knowledge Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center py-8">
            <Brain className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              No knowledge profile found. Generate one based on your vocabulary and study entries.
            </p>
            <Button onClick={generateProfile} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Generate Knowledge Profile
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Knowledge Profile</h2>
          <p className="text-muted-foreground">
            Based on {profile.totalInteractions} interactions across {profile.entries.length} topics
          </p>
        </div>
        <Button onClick={generateProfile} disabled={isLoading} variant="outline">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            'Refresh Profile'
          )}
        </Button>
      </div>

      {/* Topic Proficiencies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Topic Proficiencies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {profile.entries.slice(0, 8).map((entry) => (
              <div key={entry.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium capitalize">{entry.topic}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="capitalize">
                      {entry.proficiencyLevel}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {entry.interactionCount} interactions
                    </span>
                  </div>
                </div>
                <Progress 
                  value={getProficiencyProgress(entry.proficiencyLevel)} 
                  className="h-2"
                />
                <div className="flex flex-wrap gap-1">
                  {entry.keywords.slice(0, 3).map((keyword, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                  {entry.keywords.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{entry.keywords.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Learning Gaps */}
      {learningGaps.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Learning Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {learningGaps.map((gap, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium capitalize">{gap.topic}</h4>
                    <Badge 
                      variant={gap.priority === 'high' ? 'destructive' : 'secondary'}
                    >
                      {gap.priority} priority
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Consider exploring: {gap.missingConcepts.join(', ')}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {gap.suggestedResources.map((resource, resourceIndex) => (
                      <Badge key={resourceIndex} variant="outline" className="text-xs">
                        {resource}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Profile Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Total Topics</span>
            </div>
            <div className="text-2xl font-bold">{profile.entries.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Advanced Topics</span>
            </div>
            <div className="text-2xl font-bold">
              {profile.entries.filter(e => e.proficiencyLevel === 'advanced').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Total Interactions</span>
            </div>
            <div className="text-2xl font-bold">{profile.totalInteractions}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default KnowledgeProfile;
