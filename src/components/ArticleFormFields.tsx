
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import TagManager from './TagManager';

interface ArticleFormFieldsProps {
  title: string;
  setTitle: (title: string) => void;
  author: string;
  setAuthor: (author: string) => void;
  content: string;
  setContent: (content: string) => void;
  sourceUrl: string;
  setSourceUrl: (sourceUrl: string) => void;
  tags: string[];
  setTags: (tags: string[]) => void;
}

const ArticleFormFields = ({
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
}: ArticleFormFieldsProps) => {
  return (
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

      <TagManager tags={tags} onTagsChange={setTags} />
    </div>
  );
};

export default ArticleFormFields;
