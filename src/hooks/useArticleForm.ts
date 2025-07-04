
import { useState } from 'react';
import { saveArticle } from '@/utils/localStorage';
import { useToast } from '@/hooks/use-toast';
import { useKnowledgeProfile } from '@/hooks/useKnowledgeProfile';
import { ContextualInsight } from '@/types/knowledgeProfile';

export const useArticleForm = (onArticleSaved?: () => void) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [contextualInsights, setContextualInsights] = useState<ContextualInsight[]>([]);
  
  const { toast } = useToast();
  const { generateInsights } = useKnowledgeProfile();

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both title and content.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const savedArticle = saveArticle({
        title: title.trim(),
        author: author.trim() || undefined,
        content: content.trim(),
        sourceUrl: sourceUrl.trim() || undefined,
        tags: tags.filter(tag => tag.trim() !== ''),
      });

      // Generate contextual insights for the new content
      const insights = generateInsights(title.trim(), content.trim());
      setContextualInsights(insights);

      toast({
        title: "Article Saved",
        description: "Your article has been saved successfully!",
      });

      // Call the callback if provided
      if (onArticleSaved) {
        onArticleSaved();
      }

      // Reset form
      resetForm();

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save article. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setAuthor('');
    setContent('');
    setSourceUrl('');
    setTags([]);
  };

  return {
    title,
    setTitle,
    author,
    setAuthor,
    content,
    setContent,
    sourceUrl,
    setSourceUrl,
    tags,
    setTags,
    isLoading,
    contextualInsights,
    handleSave,
  };
};
