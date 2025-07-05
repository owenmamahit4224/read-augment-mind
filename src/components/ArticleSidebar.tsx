
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AIInsights from './AIInsights';
import ArticleAnalysis from './ArticleAnalysis';
import ProperNounSelector from './ProperNounSelector';
import VocabularySelector from './VocabularySelector';
import KnowledgeProfile from './KnowledgeProfile';

interface ArticleSidebarProps {
  articleId: string;
  articleTitle: string;
  content: string;
}

const ArticleSidebar = ({ articleId, articleTitle, content }: ArticleSidebarProps) => {
  return (
    <div className="sticky top-24 space-y-6">
      <Tabs defaultValue="insights" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="study">Study</TabsTrigger>
          <TabsTrigger value="vocabulary">Vocab</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="mt-6">
          <AIInsights title={articleTitle} content={content} />
        </TabsContent>

        <TabsContent value="analysis" className="mt-6">
          <ArticleAnalysis title={articleTitle} content={content} />
        </TabsContent>

        <TabsContent value="study" className="mt-6">
          <ProperNounSelector 
            articleId={articleId}
            articleTitle={articleTitle}
            content={content}
          />
        </TabsContent>

        <TabsContent value="vocabulary" className="mt-6">
          <VocabularySelector 
            articleId={articleId}
            articleTitle={articleTitle}
            content={content}
          />
        </TabsContent>

        <TabsContent value="profile" className="mt-6">
          <KnowledgeProfile />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ArticleSidebar;
