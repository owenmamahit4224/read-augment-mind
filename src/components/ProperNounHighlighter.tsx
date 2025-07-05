
import React from 'react';
import { detectProperNouns } from '@/utils/properNounDetection';

interface ProperNounHighlighterProps {
  content: string;
}

const ProperNounHighlighter = ({ content }: ProperNounHighlighterProps) => {
  const properNouns = detectProperNouns(content);
  
  if (properNouns.length === 0) {
    return <div className="whitespace-pre-wrap text-sm leading-relaxed">{content}</div>;
  }

  // Sort proper nouns by start index in descending order to avoid index shifts
  const sortedProperNouns = [...properNouns].sort((a, b) => b.startIndex - a.startIndex);
  
  let highlightedContent = content;
  
  // Apply highlighting from end to beginning to maintain correct indices
  sortedProperNouns.forEach(noun => {
    const before = highlightedContent.slice(0, noun.startIndex);
    const highlighted = highlightedContent.slice(noun.startIndex, noun.endIndex);
    const after = highlightedContent.slice(noun.endIndex);
    
    highlightedContent = before + 
      `<span class="border-2 border-teal-400 bg-teal-50 px-1 rounded">${highlighted}</span>` + 
      after;
  });

  return (
    <div 
      className="whitespace-pre-wrap text-sm leading-relaxed"
      dangerouslySetInnerHTML={{ __html: highlightedContent }}
    />
  );
};

export default ProperNounHighlighter;
