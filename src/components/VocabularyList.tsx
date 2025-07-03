import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { BookOpen, Calendar, FileText, Trash2, Edit3, Save, X } from 'lucide-react';
import { useVocabulary } from '@/hooks/useVocabulary';
import { useNotesReminder } from '@/hooks/useNotesReminder';
import { VocabularyEntry } from '@/types/article';

const VocabularyList = () => {
  const { vocabularyList, updateNotes, removeFromVocabulary } = useVocabulary();
  const { trackEntry, untrackEntry } = useNotesReminder();
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [notesText, setNotesText] = useState('');

  // Track entries for reminder system
  useEffect(() => {
    vocabularyList.forEach(entry => {
      trackEntry(entry.id, 'vocabulary', entry.word, !!entry.notes?.trim());
    });
  }, [vocabularyList, trackEntry]);

  const handleEditNotes = (entry: VocabularyEntry) => {
    setEditingNotes(entry.id);
    setNotesText(entry.notes || '');
    // Track interaction when user starts editing
    trackEntry(entry.id, 'vocabulary', entry.word, !!entry.notes?.trim());
  };

  const handleSaveNotes = (id: string) => {
    updateNotes(id, notesText);
    setEditingNotes(null);
    
    // Update tracking after saving notes
    const entry = vocabularyList.find(e => e.id === id);
    if (entry) {
      trackEntry(id, 'vocabulary', entry.word, !!notesText.trim());
    }
    
    setNotesText('');
  };

  const handleCancelEdit = () => {
    setEditingNotes(null);
    setNotesText('');
  };

  const handleRemoveEntry = (id: string) => {
    removeFromVocabulary(id);
    untrackEntry(id);
  };

  if (vocabularyList.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            New Vocabulary
          </CardTitle>
          <CardDescription>
            Your vocabulary list is empty. Start reading articles and select words to build your vocabulary!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              Select words from articles to add them to your vocabulary list.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">New Vocabulary</h2>
          <p className="text-muted-foreground">
            {vocabularyList.length} word{vocabularyList.length !== 1 ? 's' : ''} in your vocabulary
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {vocabularyList.map((entry) => (
          <Card key={entry.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <CardTitle className="text-xl">{entry.word}</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      <span>{entry.sourceMaterialTitle}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{entry.timestamp.toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveEntry(entry.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {entry.definition && (
                <div>
                  <h4 className="font-medium text-sm mb-2">Definition:</h4>
                  <p className="text-sm text-muted-foreground">{entry.definition}</p>
                </div>
              )}

              {entry.context && (
                <div>
                  <h4 className="font-medium text-sm mb-2">Context:</h4>
                  <p className="text-sm text-muted-foreground italic bg-muted/30 p-2 rounded">
                    "{entry.context}"
                  </p>
                </div>
              )}

              <Separator />

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm">Notes:</h4>
                    {!entry.notes?.trim() && (
                      <Badge variant="secondary" className="text-xs">
                        Add notes to remember better!
                      </Badge>
                    )}
                  </div>
                  {editingNotes !== entry.id && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditNotes(entry)}
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {editingNotes === entry.id ? (
                  <div className="space-y-2">
                    <Textarea
                      value={notesText}
                      onChange={(e) => setNotesText(e.target.value)}
                      placeholder="Add your notes about this word..."
                      className="min-h-[80px]"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleSaveNotes(entry.id)}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancelEdit}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div 
                    className={`text-sm cursor-pointer transition-colors p-3 rounded ${
                      entry.notes?.trim()
                        ? 'text-muted-foreground bg-muted/50 hover:bg-muted/70'
                        : 'text-muted-foreground bg-yellow-50 hover:bg-yellow-100 border border-yellow-200'
                    }`}
                    onClick={() => handleEditNotes(entry)}
                  >
                    {entry.notes || 'Click to add notes...'}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default VocabularyList;
