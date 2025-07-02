
import { useState, useEffect } from 'react';
import { VocabularyEntry } from '@/types/article';
import { 
  getVocabularyEntries, 
  saveVocabularyEntry, 
  updateVocabularyEntry, 
  deleteVocabularyEntry 
} from '@/utils/vocabularyStorage';
import { useToast } from '@/hooks/use-toast';
import { checkWordInDictionary } from '@/utils/dictionaryService';

export const useVocabulary = () => {
  const [vocabularyList, setVocabularyList] = useState<VocabularyEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadVocabularyList();
  }, []);

  const loadVocabularyList = () => {
    const entries = getVocabularyEntries();
    setVocabularyList(entries);
  };

  const addToVocabulary = async (
    word: string,
    sourceMaterialId: string,
    sourceMaterialTitle: string,
    context: string
  ) => {
    setIsLoading(true);
    try {
      // Check if word already exists in vocabulary
      const existingEntry = vocabularyList.find(
        entry => entry.word.toLowerCase() === word.toLowerCase() && 
                 entry.sourceMaterialId === sourceMaterialId
      );

      if (existingEntry) {
        toast({
          title: "Already in Vocabulary",
          description: `"${word}" is already in your vocabulary list.`,
          variant: "default",
        });
        return false;
      }

      // Get dictionary definition
      const dictionaryResult = await checkWordInDictionary(word);
      
      if (!dictionaryResult) {
        toast({
          title: "Word Not Found",
          description: `"${word}" was not found in the dictionary.`,
          variant: "destructive",
        });
        return false;
      }

      const newEntry = saveVocabularyEntry({
        word: dictionaryResult.word,
        sourceMaterialId,
        sourceMaterialTitle,
        context,
        definition: dictionaryResult.definition,
      });

      setVocabularyList(prev => [newEntry, ...prev]);
      
      toast({
        title: "Added to Vocabulary",
        description: `"${word}" has been added to your vocabulary list.`,
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add word to vocabulary.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateNotes = (id: string, notes: string) => {
    updateVocabularyEntry(id, { notes });
    loadVocabularyList();
    toast({
      title: "Notes Updated",
      description: "Your vocabulary notes have been saved.",
    });
  };

  const removeFromVocabulary = (id: string) => {
    deleteVocabularyEntry(id);
    loadVocabularyList();
    toast({
      title: "Removed from Vocabulary",
      description: "The word has been removed from your vocabulary list.",
    });
  };

  return {
    vocabularyList,
    isLoading,
    addToVocabulary,
    updateNotes,
    removeFromVocabulary,
    refreshVocabulary: loadVocabularyList,
  };
};
