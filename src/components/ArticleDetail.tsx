
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, ExternalLink, Calendar, User, Clock, BookOpen } from 'lucide-react';
import { SavedArticle } from '@/types/article';
import AIInsights from './AIInsights';
import ArticleAnalysis from './ArticleAnalysis';
import ProperNounSelector from './ProperNounSelector';

interface ArticleDetailProps {
  article: SavedArticle;
  onBack: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

const ArticleDetail = ({ article, onBack, onNext, onPrevious }: ArticleDetailProps) => {
  const [readingProgress, setReadingProgress] = useState(0);
  const [readingTime, setReadingTime] = useState(0);

  useEffect(() => {
    // Calculate estimated reading time (average 200 words per minute)
    const wordCount = article.content.split(/\s+/).length;
    const estimatedMinutes = Math.ceil(wordCount / 200);
    setReadingTime(estimatedMinutes);

    // Track reading progress
    let startTime = Date.now();
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const scrollTop = window.scrollY;
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = Math.min((scrollTop / documentHeight) * 100, 100);
        setReadingProgress(progress);
      }, 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [article.content]);

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

              <CardContent>
                <div className="prose prose-lg max-w-none dark:prose-invert">
                  <div className="whitespace-pre-wrap leading-relaxed text-foreground">
                    {article.content}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Navigation Footer */}
            <div className="flex justify-between items-center mt-8 pt-8 border-t">
              <div>
                {onPrevious && (
                  <Button variant="outline" onClick={onPrevious}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous Article
                  </Button>
                )}
              </div>
              <div>
                {onNext && (
                  <Button variant="outline" onClick={onNext}>
                    Next Article
                    <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* AI Enhancement Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <Tabs defaultValue="insights" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="insights">Insights</TabsTrigger>
                  <TabsTrigger value="analysis">Analysis</TabsTrigger>
                  <TabsTrigger value="study">Study</TabsTrigger>
                </TabsList>

                <TabsContent value="insights" className="mt-6">
                  <AIInsights title={article.title} content={article.content} />
                </TabsContent>

                <TabsContent value="analysis" className="mt-6">
                  <ArticleAnalysis title={article.title} content={article.content} />
                </TabsContent>

                <TabsContent value="study" className="mt-6">
                  <ProperNounSelector 
                    articleId={article.id}
                    articleTitle={article.title}
                    content={article.content}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;
