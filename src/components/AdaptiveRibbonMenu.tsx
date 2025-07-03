
import React, { useState, useEffect, useCallback } from 'react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { BookOpen, Brain, Plus } from 'lucide-react';
import { detectProperNouns } from '@/utils/properNounDetection';
import { isValidDictionaryWord } from '@/utils/dictionaryService';
import { useStudyList } from '@/hooks/useStudyList';
import { useVocabulary } from '@/hooks/useVocabulary';
import { useToast } from '@/hooks/use-toast';

interface AdaptiveRibbonMenuProps {
  children: React.ReactNode;
  articleId: string;
  articleTitle: string;
  articleContent: string;
}

interface MenuOptions {
  showSave: boolean;
  showStudy: boolean;
  showVocabulary: boolean;
}

const AdaptiveRibbonMenu = ({ 
  children, 
  articleId, 
  articleTitle, 
  articleContent 
}: AdaptiveRibbonMenuProps) => {
  const [selectedText, setSelectedText] = useState('');
  const [selectionContext, setSelectionContext] = useState('');
  const [menuOptions, setMenuOptions] = useState<MenuOptions>({
    showSave: false,
    showStudy: false,
    showVocabulary: false,
  });
  const [isCheckingWord, setIsCheckingWord] = useState(false);

  const { addToStudyList } = useStudyList();
  const { addToVocabulary } = useVocabulary();
  const { toast } = useToast();

  const handleTextSelection = useCallback(async () => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      setSelectedText('');
      setMenuOptions({ showSave: false, showStudy: false, showVocabulary: false });
      return;
    }

    const text = selection.toString().trim();
    if (!text) {
      setSelectedText('');
      setMenuOptions({ showSave: false, showStudy: false, showVocabulary: false });
      return;
    }

    setSelectedText(text);

    // Get surrounding context
    const range = selection.getRangeAt(0);
    const container = range.commonAncestorContainer;
    const containerText = container.textContent || '';
    const startOffset = range.startOffset;
    const endOffset = range.endOffset;
    
    const contextStart = Math.max(0, startOffset - 50);
    const contextEnd = Math.min(containerText.length, endOffset + 50);
    const context = containerText.slice(contextStart, contextEnd);
    setSelectionContext(context);

    // Determine menu options
    const options: MenuOptions = {
      showSave: true, // Always show save option
      showStudy: false,
      showVocabulary: false,
    };

    // Check if selection contains proper nouns
    const properNouns = detectProperNouns(text);
    options.showStudy = properNouns.length > 0;

    // Check if selection is a single word and valid dictionary word
    const words = text.split(/\s+/).filter(word => word.length > 0);
    if (words.length === 1) {
      setIsCheckingWord(true);
      try {
        const isValid = await isValidDictionaryWord(words[0]);
        options.showVocabulary = isValid;
      } catch (error) {
        console.error('Error checking dictionary word:', error);
        options.showVocabulary = false;
      } finally {
        setIsCheckingWord(false);
      }
    }

    setMenuOptions(options);
  }, []);

  useEffect(() => {
    document.addEventListener('mouseup', handleTextSelection);
    document.addEventListener('keyup', handleTextSelection);

    return () => {
      document.removeEventListener('mouseup', handleTextSelection);
      document.removeEventListener('keyup', handleTextSelection);
    };
  }, [handleTextSelection]);

  const handleSaveSelection = () => {
    if (selectedText) {
      // Copy selected text to clipboard
      navigator.clipboard.writeText(selectedText).then(() => {
        toast({
          title: "Text Saved",
          description: "Selected text has been copied to clipboard.",
        });
      }).catch(() => {
        toast({
          title: "Save Failed",
          description: "Could not copy text to clipboard.",
          variant: "destructive",
        });
      });
    }
  };

  const handleAddToStudy = async () => {
    if (selectedText) {
      const properNouns = detectProperNouns(selectedText);
      if (properNouns.length > 0) {
        // Add the first proper noun found
        const properNoun = properNouns[0];
        await addToStudyList(
          articleId,
          articleTitle,
          properNoun.text,
          selectionContext
        );
      }
    }
  };

  const handleAddToVocabulary = async () => {
    if (selectedText) {
      const words = selectedText.split(/\s+/).filter(word => word.length > 0);
      if (words.length === 1) {
        await addToVocabulary(
          words[0],
          articleId,
          articleTitle,
          selectionContext
        );
      }
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        {(menuOptions.showSave || menuOptions.showStudy || menuOptions.showVocabulary) && (
          <>
            {menuOptions.showSave && (
              <ContextMenuItem onClick={handleSaveSelection}>
                <BookOpen className="mr-2 h-4 w-4" />
                Save Selection
              </ContextMenuItem>
            )}
            
            {menuOptions.showStudy && (
              <ContextMenuItem onClick={handleAddToStudy}>
                <Brain className="mr-2 h-4 w-4" />
                Add to Study List
              </ContextMenuItem>
            )}
            
            {menuOptions.showVocabulary && (
              <ContextMenuItem onClick={handleAddToVocabulary} disabled={isCheckingWord}>
                <Plus className="mr-2 h-4 w-4" />
                {isCheckingWord ? 'Checking...' : 'Add to Vocabulary'}
              </ContextMenuItem>
            )}
          </>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default AdaptiveRibbonMenu;
