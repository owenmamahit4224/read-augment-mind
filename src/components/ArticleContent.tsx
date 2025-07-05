
import React from 'react';
import { CardContent } from '@/components/ui/card';
import AdaptiveRibbonMenu from './AdaptiveRibbonMenu';
import { detectProperNouns } from '@/utils/properNounDetection';

interface ArticleContentProps {
  content: string;
  articleId?: string;
  articleTitle?: string;
}

const ArticleContent = ({ content, articleId, articleTitle }: ArticleContentProps) => {
  const highlightProperNouns = (text: string) => {
    const properNouns = detectProperNouns(text);
    
    if (properNouns.length === 0) {
      return <div className="whitespace-pre-wrap text-sm leading-relaxed">{text}</div>;
    }

    let lastIndex = 0;
    const elements: React.ReactNode[] = [];

    properNouns.forEach((noun, index) => {
      // Add text before the proper noun
      if (noun.startIndex > lastIndex) {
        elements.push(
          <span key={`text-${index}`}>
            {text.slice(lastIndex, noun.startIndex)}
          </span>
        );
      }

      // Add the highlighted proper noun
      elements.push(
        <span
          key={`noun-${index}`}
          className="underline decoration-teal-500 decoration-2 underline-offset-2"
          title={`Proper noun: ${noun.text}`}
        >
          {noun.text}
        </span>
      );

      lastIndex = noun.endIndex;
    });

    // Add remaining text after the last proper noun
    if (lastIndex < text.length) {
      elements.push(
        <span key="text-end">
          {text.slice(lastIndex)}
        </span>
      );
    }

    return (
      <div className="whitespace-pre-wrap text-sm leading-relaxed">
        {elements}
      </div>
    );
  };

  const contentElement = (
    <CardContent className="prose prose-sm max-w-none p-6">
      {highlightProperNouns(content)}
    </CardContent>
  );

  // If we have article context, wrap with adaptive menu
  if (articleId && articleTitle) {
    return (
      <AdaptiveRibbonMenu 
        articleId={articleId} 
        articleTitle={articleTitle} 
        articleContent={content}
      >
        {contentElement}
      </AdaptiveRibbonMenu>
    );
  }

  // Fallback without adaptive menu
  return contentElement;
};

export default ArticleContent;
