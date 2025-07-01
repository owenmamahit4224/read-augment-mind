
import { useState, useEffect } from 'react';
import { SavedArticle } from '@/types/article';
import { getSavedArticles, deleteArticle } from '@/utils/localStorage';
import { useToast } from '@/hooks/use-toast';

export const useArticlesList = (refreshTrigger: number) => {
  const [articles, setArticles] = useState<SavedArticle[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<SavedArticle[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<SavedArticle | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadArticles();
  }, [refreshTrigger]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredArticles(articles);
    } else {
      const filtered = articles.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredArticles(filtered);
    }
  }, [articles, searchTerm]);

  const loadArticles = () => {
    const savedArticles = getSavedArticles();
    setArticles(savedArticles);
  };

  const handleDelete = (id: string) => {
    deleteArticle(id);
    loadArticles();
    toast({
      title: "Article Deleted",
      description: "The article has been removed.",
    });
  };

  const handleViewArticle = (article: SavedArticle) => {
    setSelectedArticle(article);
  };

  const handleBackToList = () => {
    setSelectedArticle(null);
  };

  const handleNextArticle = () => {
    if (!selectedArticle) return;
    const currentIndex = filteredArticles.findIndex(a => a.id === selectedArticle.id);
    if (currentIndex < filteredArticles.length - 1) {
      setSelectedArticle(filteredArticles[currentIndex + 1]);
    }
  };

  const handlePreviousArticle = () => {
    if (!selectedArticle) return;
    const currentIndex = filteredArticles.findIndex(a => a.id === selectedArticle.id);
    if (currentIndex > 0) {
      setSelectedArticle(filteredArticles[currentIndex - 1]);
    }
  };

  return {
    articles,
    filteredArticles,
    searchTerm,
    setSearchTerm,
    selectedArticle,
    handleDelete,
    handleViewArticle,
    handleBackToList,
    handleNextArticle,
    handlePreviousArticle,
  };
};
