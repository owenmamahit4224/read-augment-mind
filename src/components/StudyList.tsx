
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { BookOpen, Trash2, Edit3, Search, ExternalLink } from 'lucide-react';
import { useStudyList } from '@/hooks/useStudyList';
import { StudyListEntry } from '@/types/article';
import EmptyState from './EmptyState';

const StudyList = () => {
  const { studyList, updateNotes, removeFromStudyList } = useStudyList();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [notesText, setNotesText] = useState('');

  const filteredEntries = studyList.filter(entry =>
    entry.properNoun.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.articleTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.notes?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditNotes = (entry: StudyListEntry) => {
    setEditingNotes(entry.id);
    setNotesText(entry.notes || '');
  };

  const handleSaveNotes = (id: string) => {
    updateNotes(id, notesText);
    setEditingNotes(null);
    setNotesText('');
  };

  const handleCancelEdit = () => {
    setEditingNotes(null);
    setNotesText('');
  };

  if (studyList.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Study List</h2>
          <p className="text-muted-foreground">
            Your collected proper nouns and study terms will appear here
          </p>
        </div>
        <EmptyState message="No study terms yet. Start by reading articles and adding proper nouns to your study list!" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Study List</h2>
          <p className="text-muted-foreground">
            {studyList.length} term{studyList.length !== 1 ? 's' : ''} in your study list
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search study terms, articles, or notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Study List Entries */}
      <div className="grid gap-4">
        {filteredEntries.map((entry) => (
          <Card key={entry.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{entry.properNoun}</CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>from</span>
                    <Badge variant="outline">{entry.articleTitle}</Badge>
                    <span>•</span>
                    <span>{entry.timestamp.toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>{entry.properNoun}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Context</h4>
                          <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
                            ...{entry.context}...
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">From Article</h4>
                          <Badge variant="outline">{entry.articleTitle}</Badge>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditNotes(entry)}
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFromStudyList(entry.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Context:</span> ...{entry.context}...
                </p>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Notes</span>
                </div>
                
                {editingNotes === entry.id ? (
                  <div className="space-y-2">
                    <Textarea
                      value={notesText}
                      onChange={(e) => setNotesText(e.target.value)}
                      placeholder="Add your notes about this term..."
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleSaveNotes(entry.id)}
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div
                    className="text-sm text-muted-foreground bg-muted/50 p-3 rounded cursor-pointer hover:bg-muted/70 transition-colors"
                    onClick={() => handleEditNotes(entry)}
                  >
                    {entry.notes || "Click to add notes..."}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEntries.length === 0 && searchTerm && (
        <EmptyState message={`No study terms found matching "${searchTerm}"`} />
      )}
    </div>
  );
};

export default StudyList;
