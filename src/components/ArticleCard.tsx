
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, ExternalLink, Calendar, Eye, Clock } from 'lucide-react';
import { SavedArticle } from '@/types/article';

interface ArticleCardProps {
  article: SavedArticle;
  onView: (article: SavedArticle) => void;
  onDelete: (id: string) => void;
}

const ArticleCard = ({ article, onView, onDelete }: ArticleCardProps) => {
  const getReadingTime = (content: string) => {
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / 200);
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg hover:text-primary cursor-pointer"
              onClick={() => onView(article)}>
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
              onClick={() => onView(article)}
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
              onClick={() => onDelete(article.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3 cursor-pointer"
          onClick={() => onView(article)}>
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
  );
};

export default ArticleCard;
