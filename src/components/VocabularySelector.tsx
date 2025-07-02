
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { BookOpen, Plus, Loader2 } from 'lucide-react';
import { useVocabulary } from '@/hooks/useVocabulary';
import { isValidDictionaryWord } from '@/utils/dictionaryService';

interface VocabularySelectorProps {
  articleId: string;
  articleTitle: string;
  content: string;
}

const VocabularySelector = ({ articleId, articleTitle, content }: VocabularySelectorProps) => {
  const [selectedText, setSelectedText] = useState('');
  const [isCheckingWord, setIsCheckingWord] = useState(false);
  const { addToVocabulary, isLoading } = useVocabulary();

  const handleTextSelection = async () => {
    const selection = window.getSelection();
    const text = selection?.toString().trim();
    
    if (text && text.length > 0) {
      setSelectedText(text);
      
      // Check if it's a valid dictionary word
      setIsCheckingWord(true);
      const isValid = await isValidDictionaryWord(text);
      setIsCheckingWord(false);
      
      if (!isValid) {
        setSelectedText('');
      }
    } else {
      setSelectedText('');
    }
  };

  const handleAddToVocabulary = async () => {
    if (!selectedText) return;

    // Get context around the selected word
    const selection = window.getSelection();
    let context = '';
    
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const container = range.commonAncestorContainer;
      const textContent = container?.textContent || '';
      const wordIndex = textContent.toLowerCase().indexOf(selectedText.toLowerCase());
      
      if (wordIndex !== -1) {
        const start = Math.max(0, wordIndex - 50);
        const end = Math.min(textContent.length, wordIndex + selectedText.length + 50);
        context = textContent.substring(start, end);
      }
    }

    const success = await addToVocabulary(selectedText, articleId, articleTitle, context);
    if (success) {
      setSelectedText('');
      // Clear selection
      window.getSelection()?.removeAllRanges();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          New Vocabulary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Select text in the article to check if it's a valid dictionary word and add it to your vocabulary list.
        </div>

        <div 
          className="prose prose-sm max-w-none cursor-text select-text"
          onMouseUp={handleTextSelection}
          onTouchEnd={handleTextSelection}
        >
          <div className="max-h-60 overflow-y-auto p-3 bg-muted/30 rounded-md text-sm leading-relaxed">
            {content.substring(0, 500)}...
          </div>
        </div>

        {isCheckingWord && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Checking dictionary...
          </div>
        )}

        {selectedText && !isCheckingWord && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Selected word:</span>
              <Badge variant="outline">{selectedText}</Badge>
            </div>
            
            <Button 
              onClick={handleAddToVocabulary}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adding to Vocabulary...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add to Vocabulary
                </>
              )}
            </Button>
          </div>
        )}

        {!selectedText && !isCheckingWord && (
          <div className="text-sm text-muted-foreground text-center py-4">
            Select a word from the article text above to add it to your vocabulary list.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VocabularySelector;
