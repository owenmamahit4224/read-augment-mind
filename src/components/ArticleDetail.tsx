
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft } from 'lucide-react';
import { SavedArticle } from '@/types/article';
import { useReadingProgress } from '@/hooks/useReadingProgress';
import ArticleHeader from './ArticleHeader';
import ArticleContent from './ArticleContent';
import ArticleNavigation from './ArticleNavigation';
import ArticleSidebar from './ArticleSidebar';

interface ArticleDetailProps {
  article: SavedArticle;
  onBack: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

const ArticleDetail = ({ article, onBack, onNext, onPrevious }: ArticleDetailProps) => {
  const { readingProgress, readingTime } = useReadingProgress(article.content);

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Library
            </Button>
            <div className="flex items-center gap-2">
              {onPrevious && (
                <Button variant="outline" size="sm" onClick={onPrevious}>
                  Previous
                </Button>
              )}
              {onNext && (
                <Button variant="outline" size="sm" onClick={onNext}>
                  Next
                </Button>
              )}
            </div>
          </div>
          <Progress value={readingProgress} className="mt-2 h-1" />
        </div>
      </div>

      {/* Article Content */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Article Content */}
          <div className="lg:col-span-2">
            <Card>
              <ArticleHeader 
                article={article}
                readingTime={readingTime}
                readingProgress={readingProgress}
              />
              <ArticleContent 
                content={article.content} 
                articleId={article.id}
                articleTitle={article.title}
              />
            </Card>

            <ArticleNavigation onPrevious={onPrevious} onNext={onNext} />
          </div>

          {/* AI Enhancement Sidebar */}
          <div className="lg:col-span-1">
            <ArticleSidebar 
              articleId={article.id}
              articleTitle={article.title}
              content={article.content}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;
