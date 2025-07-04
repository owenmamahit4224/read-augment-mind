import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { X, Plus, Save, Loader2 } from 'lucide-react';
import { saveArticle } from '@/utils/localStorage';
import { useToast } from '@/hooks/use-toast';
import { useKnowledgeProfile } from '@/hooks/useKnowledgeProfile';
import { ContextualInsight } from '@/types/knowledgeProfile';
import ContextualInsights from './ContextualInsights';

interface ArticleSaverProps {
  // You can define props here if needed
}

const ArticleSaver = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const { generateInsights } = useKnowledgeProfile();
  const [contextualInsights, setContextualInsights] = useState<ContextualInsight[]>([]);

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both title and content.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const savedArticle = saveArticle({
        title: title.trim(),
        author: author.trim() || undefined,
        content: content.trim(),
        sourceUrl: sourceUrl.trim() || undefined,
        tags: tags.filter(tag => tag.trim() !== ''),
      });

      // Generate contextual insights for the new content
      const insights = generateInsights(title.trim(), content.trim());
      setContextualInsights(insights);

      toast({
        title: "Article Saved",
        description: "Your article has been saved successfully!",
      });

      // Reset form
      setTitle('');
      setAuthor('');
      setContent('');
      setSourceUrl('');
      setTags([]);
      setCurrentTag('');

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save article. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

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
          <div className="grid gap-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Article Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="author">Author (optional)</Label>
              <Input
                id="author"
                placeholder="Author Name"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                placeholder="Article Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[120px]"
              />
            </div>

            <div>
              <Label htmlFor="sourceUrl">Source URL (optional)</Label>
              <Input
                id="sourceUrl"
                placeholder="Article Source URL"
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
              />
            </div>

            <div>
              <Label>Tags (optional)</Label>
              <div className="flex items-center space-x-2">
                <Input
                  type="text"
                  placeholder="Add a tag"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddTag();
                    }
                  }}
                />
                <Button type="button" variant="outline" size="sm" onClick={handleAddTag}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Tag
                </Button>
              </div>
              <div className="flex flex-wrap space-x-2 mt-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-x-2">
                    {tag}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="-mr-2 h-5 w-5 rounded-full text-muted-foreground hover:text-foreground"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>

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
