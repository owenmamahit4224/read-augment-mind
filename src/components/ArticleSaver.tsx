
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Save, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useArticleForm } from '@/hooks/useArticleForm';
import ContextualInsights from './ContextualInsights';
import ArticleFormFields from './ArticleFormFields';

interface ArticleSaverProps {
  onArticleSaved?: () => void;
}

const ArticleSaver = ({ onArticleSaved }: ArticleSaverProps) => {
  const { toast } = useToast();
  const {
    title,
    setTitle,
    author,
    setAuthor,
    content,
    setContent,
    sourceUrl,
    setSourceUrl,
    tags,
    setTags,
    isLoading,
    contextualInsights,
    handleSave,
  } = useArticleForm(onArticleSaved);

  return (
    <div className="space-y-6">
      {/* Show contextual insights if available */}
      {contextualInsights.length > 0 && (
        <ContextualInsights 
          insights={contextualInsights}
          onActionClick={() => {
            // Could navigate to knowledge profile or vocabulary
            toast({
              title: "Insight Noted",
              description: "Check your Knowledge Profile for more details.",
            });
          }}
        />
      )}

      <Card>
        <CardHeader>
          <CardTitle>Save New Article</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ArticleFormFields
            title={title}
            setTitle={setTitle}
            author={author}
            setAuthor={setAuthor}
            content={content}
            setContent={setContent}
            sourceUrl={sourceUrl}
            setSourceUrl={setSourceUrl}
            tags={tags}
            setTags={setTags}
          />

          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Article
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ArticleSaver;
