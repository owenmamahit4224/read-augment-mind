
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Trash2, ExternalLink, Calendar, Search, Eye, Clock } from 'lucide-react';
import { SavedArticle } from '@/types/article';
import { getSavedArticles, deleteArticle } from '@/utils/localStorage';
import { useToast } from '@/hooks/use-toast';
import ArticleDetail from './ArticleDetail';

interface SavedArticlesListProps {
  refreshTrigger: number;
}

const SavedArticlesList = ({ refreshTrigger }: SavedArticlesListProps) => {
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

  const getReadingTime = (content: string) => {
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / 200);
  };

  // Show article detail view if an article is selected
  if (selectedArticle) {
    const currentIndex = filteredArticles.findIndex(a => a.id === selectedArticle.id);
    return (
      <ArticleDetail
        article={selectedArticle}
        onBack={handleBackToList}
        onNext={currentIndex < filteredArticles.length - 1 ? handleNextArticle : undefined}
        onPrevious={currentIndex > 0 ? handlePreviousArticle : undefined}
      />
    );
  }

  if (articles.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">No saved articles yet. Start by saving your first article above!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Saved Articles ({articles.length})</h2>
        
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {filteredArticles.length === 0 && searchTerm && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No articles found matching "{searchTerm}"</p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {filteredArticles.map((article) => (
          <Card key={article.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg hover:text-primary cursor-pointer"
                    onClick={() => handleViewArticle(article)}>
                    {article.title}
                  </CardTitle>
                  <CardDescription className="flex flex-wrap items-center gap-4 mt-2">
                    {article.author && (
                      <span>By {article.author}</span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {article.timestamp.toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {getReadingTime(article.content)} min read
                    </span>
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewArticle(article)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {article.sourceUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(article.sourceUrl, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(article.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-3 cursor-pointer"
                onClick={() => handleViewArticle(article)}>
                {article.content.substring(0, 200)}...
              </p>
              {article.tags && article.tags.length > 0 && (
                <div className="flex gap-2 mt-3">
                  {article.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SavedArticlesList;
