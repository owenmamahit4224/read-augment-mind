
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, ExternalLink, Calendar } from 'lucide-react';
import { SavedArticle } from '@/types/article';
import { getSavedArticles, deleteArticle } from '@/utils/localStorage';
import { useToast } from '@/hooks/use-toast';

interface SavedArticlesListProps {
  refreshTrigger: number;
}

const SavedArticlesList = ({ refreshTrigger }: SavedArticlesListProps) => {
  const [articles, setArticles] = useState<SavedArticle[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadArticles();
  }, [refreshTrigger]);

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
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Saved Articles ({articles.length})</h2>
      <div className="grid gap-4">
        {articles.map((article) => (
          <Card key={article.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg">{article.title}</CardTitle>
                  <CardDescription className="flex items-center gap-4 mt-2">
                    {article.author && (
                      <span>By {article.author}</span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {article.timestamp.toLocaleDateString()}
                    </span>
                  </CardDescription>
                </div>
                <div className="flex gap-2">
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
              <p className="text-sm text-muted-foreground line-clamp-3">
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
