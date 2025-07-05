
import React from 'react';
import { CardContent } from '@/components/ui/card';
import AdaptiveRibbonMenu from './AdaptiveRibbonMenu';

interface ArticleContentProps {
  content: string;
  articleId?: string;
  articleTitle?: string;
}

const ArticleContent = ({ content, articleId, articleTitle }: ArticleContentProps) => {
  // If we have article context, wrap with adaptive menu
  if (articleId && articleTitle) {
    return (
      <AdaptiveRibbonMenu 
        articleId={articleId} 
        articleTitle={articleTitle} 
        articleContent={content}
      >
        <CardContent className="prose prose-sm max-w-none p-6">
          <div className="whitespace-pre-wrap text-sm leading-relaxed">
            {content}
          </div>
        </CardContent>
      </AdaptiveRibbonMenu>
    );
  }

  // Fallback without adaptive menu
  return (
    <CardContent className="prose prose-sm max-w-none p-6">
      <div className="whitespace-pre-wrap text-sm leading-relaxed">
        {content}
      </div>
    </CardContent>
  );
};

export default ArticleContent;
