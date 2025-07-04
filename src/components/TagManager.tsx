
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { X, Plus } from 'lucide-react';

interface TagManagerProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
}

const TagManager = ({ tags, onTagsChange }: TagManagerProps) => {
  const [currentTag, setCurrentTag] = useState('');

  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      onTagsChange([...tags, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove));
  };

  return (
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
  );
};

export default TagManager;
