
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
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <Button variant="ghost" onClick={onBack} className="flex items-center gap-2 text-sm sm:text-base">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to Library</span>
              <span className="sm:hidden">Back</span>
            </Button>
            <div className="flex items-center gap-1 sm:gap-2">
              {onPrevious && (
                <Button variant="outline" size="sm" onClick={onPrevious} className="text-xs sm:text-sm">
                  <span className="hidden sm:inline">Previous</span>
                  <span className="sm:hidden">Prev</span>
                </Button>
              )}
              {onNext && (
                <Button variant="outline" size="sm" onClick={onNext} className="text-xs sm:text-sm">
                  Next
                </Button>
              )}
            </div>
          </div>
          <Progress value={readingProgress} className="mt-2 h-1" />
        </div>
      </div>

      {/* Article Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 max-w-7xl">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Main Article Content */}
          <div className="xl:col-span-2 order-2 xl:order-1">
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

            <div className="hidden xl:block">
              <ArticleNavigation onPrevious={onPrevious} onNext={onNext} />
            </div>
          </div>

          {/* AI Enhancement Sidebar */}
          <div className="xl:col-span-1 order-1 xl:order-2">
            <div className="sticky top-20">
              <ArticleSidebar 
                articleId={article.id}
                articleTitle={article.title}
                content={article.content}
              />
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="xl:hidden mt-6">
          <ArticleNavigation onPrevious={onPrevious} onNext={onNext} />
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;
