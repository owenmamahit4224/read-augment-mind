
import { useState, useEffect } from 'react';

interface UseReadingProgressReturn {
  readingProgress: number;
  readingTime: number;
}

export const useReadingProgress = (content: string): UseReadingProgressReturn => {
  const [readingProgress, setReadingProgress] = useState(0);
  const [readingTime, setReadingTime] = useState(0);

  useEffect(() => {
    // Calculate estimated reading time (average 200 words per minute)
    const wordCount = content.split(/\s+/).length;
    const estimatedMinutes = Math.ceil(wordCount / 200);
    setReadingTime(estimatedMinutes);

    // Track reading progress
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
  }, [content]);

  return { readingProgress, readingTime };
};
