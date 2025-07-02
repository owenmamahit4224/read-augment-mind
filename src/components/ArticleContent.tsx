
import React from 'react';
import { CardContent } from '@/components/ui/card';

interface ArticleContentProps {
  content: string;
}

const ArticleContent = ({ content }: ArticleContentProps) => {
  return (
    <CardContent>
      <div className="prose prose-lg max-w-none dark:prose-invert">
        <div className="whitespace-pre-wrap leading-relaxed text-foreground">
          {content}
        </div>
      </div>
    </CardContent>
  );
};

export default ArticleContent;
