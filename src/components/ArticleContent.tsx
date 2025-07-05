
import React from 'react';
import { CardContent } from '@/components/ui/card';
import ProperNounHighlighter from './ProperNounHighlighter';

interface ArticleContentProps {
  content: string;
  articleId?: string;
  articleTitle?: string;
}

const ArticleContent = ({ content }: ArticleContentProps) => {
  return (
    <CardContent className="prose prose-sm max-w-none p-6">
      <ProperNounHighlighter content={content} />
    </CardContent>
  );
};

export default ArticleContent;
