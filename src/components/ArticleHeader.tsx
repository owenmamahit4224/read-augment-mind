
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Calendar, User, Clock, BookOpen } from 'lucide-react';
import { SavedArticle } from '@/types/article';

interface ArticleHeaderProps {
  article: SavedArticle;
  readingTime: number;
  readingProgress: number;
}

const ArticleHeader = ({ article, readingTime, readingProgress }: ArticleHeaderProps) => {
  return (
    <CardHeader className="space-y-4">
      <CardTitle className="text-3xl font-bold leading-tight">
        {article.title}
      </CardTitle>
      
      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        {article.author && (
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>{article.author}</span>
          </div>
        )}
        <div className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          <span>{article.timestamp.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          <span>{readingTime} min read</span>
        </div>
        <div className="flex items-center gap-1">
          <BookOpen className="h-4 w-4" />
          <span>{Math.round(readingProgress)}% read</span>
        </div>
      </div>

      {article.sourceUrl && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open(article.sourceUrl, '_blank')}
          className="w-fit"
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          View Original Source
        </Button>
      )}

      {article.tags && article.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {article.tags.map((tag, index) => (
            <Badge key={index} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </CardHeader>
  );
};

export default ArticleHeader;
