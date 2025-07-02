
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, BookOpen } from 'lucide-react';
import { detectProperNouns, ProperNoun } from '@/utils/properNounDetection';
import { useStudyList } from '@/hooks/useStudyList';

interface ProperNounSelectorProps {
  articleId: string;
  articleTitle: string;
  content: string;
}

const ProperNounSelector = ({ articleId, articleTitle, content }: ProperNounSelectorProps) => {
  const [properNouns, setProperNouns] = useState<ProperNoun[]>([]);
  const [selectedNouns, setSelectedNouns] = useState<Set<string>>(new Set());
  const { addToStudyList, studyList, isLoading } = useStudyList();

  useEffect(() => {
    const detected = detectProperNouns(content);
    setProperNouns(detected);
    
    // Mark already added proper nouns as selected
    const alreadyAdded = new Set(
      studyList
        .filter(entry => entry.articleId === articleId)
        .map(entry => entry.properNoun)
    );
    setSelectedNouns(alreadyAdded);
  }, [content, studyList, articleId]);

  const handleAddToStudyList = async (properNoun: ProperNoun) => {
    await addToStudyList(
      articleId,
      articleTitle,
      properNoun.text,
      properNoun.context
    );
    setSelectedNouns(prev => new Set([...prev, properNoun.text]));
  };

  const isAlreadyAdded = (properNoun: string) => selectedNouns.has(properNoun);

  if (properNouns.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Study Terms
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No proper nouns detected in this article.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Study Terms
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Click to add proper nouns to your study list
        </p>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-3">
            {properNouns.map((properNoun, index) => (
              <div
                key={`${properNoun.text}-${index}`}
                className="p-3 border rounded-lg space-y-2"
              >
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="font-medium">
                    {properNoun.text}
                  </Badge>
                  {isAlreadyAdded(properNoun.text) ? (
                    <Badge variant="secondary">Added</Badge>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAddToStudyList(properNoun)}
                      disabled={isLoading}
                      className="flex items-center gap-1"
                    >
                      <Plus className="h-3 w-3" />
                      Add
                    </Button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium">Context:</span> ...{properNoun.context}...
                </p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ProperNounSelector;
