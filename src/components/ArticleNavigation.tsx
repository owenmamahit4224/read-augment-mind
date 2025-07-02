
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface ArticleNavigationProps {
  onPrevious?: () => void;
  onNext?: () => void;
}

const ArticleNavigation = ({ onPrevious, onNext }: ArticleNavigationProps) => {
  if (!onPrevious && !onNext) {
    return null;
  }

  return (
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
  );
};

export default ArticleNavigation;
