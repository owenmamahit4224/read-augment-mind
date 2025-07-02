
import { useState, useEffect } from 'react';
import { StudyListEntry } from '@/types/article';
import { 
  getStudyListEntries, 
  saveStudyListEntry, 
  updateStudyListEntry, 
  deleteStudyListEntry 
} from '@/utils/studyListStorage';
import { useToast } from '@/hooks/use-toast';

export const useStudyList = () => {
  const [studyList, setStudyList] = useState<StudyListEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadStudyList();
  }, []);

  const loadStudyList = () => {
    const entries = getStudyListEntries();
    setStudyList(entries);
  };

  const addToStudyList = async (
    articleId: string,
    articleTitle: string,
    properNoun: string,
    context: string,
    notes?: string
  ) => {
    setIsLoading(true);
    try {
      // Check if this proper noun from this article is already in the study list
      const existingEntry = studyList.find(
        entry => entry.articleId === articleId && entry.properNoun === properNoun
      );

      if (existingEntry) {
        toast({
          title: "Already in Study List",
          description: `"${properNoun}" is already in your study list.`,
          variant: "default",
        });
        return;
      }

      const newEntry = saveStudyListEntry({
        articleId,
        articleTitle,
        properNoun,
        context,
        notes,
      });

      setStudyList(prev => [newEntry, ...prev]);
      
      toast({
        title: "Added to Study List",
        description: `"${properNoun}" has been added to your study list.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add to study list.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateNotes = (id: string, notes: string) => {
    updateStudyListEntry(id, { notes });
    loadStudyList();
    toast({
      title: "Notes Updated",
      description: "Your notes have been saved.",
    });
  };

  const removeFromStudyList = (id: string) => {
    deleteStudyListEntry(id);
    loadStudyList();
    toast({
      title: "Removed from Study List",
      description: "The entry has been removed from your study list.",
    });
  };

  return {
    studyList,
    isLoading,
    addToStudyList,
    updateNotes,
    removeFromStudyList,
    refreshStudyList: loadStudyList,
  };
};
