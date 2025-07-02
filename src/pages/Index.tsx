
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ArticleSaver from '@/components/ArticleSaver';
import SavedArticlesList from '@/components/SavedArticlesList';
import ApiSettings from '@/components/ApiSettings';
import StudyList from '@/components/StudyList';
import VocabularyList from '@/components/VocabularyList';

const Index = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleArticleSaved = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Reading Augmentation App</h1>
          <p className="text-xl text-muted-foreground">
            Save, organize, and enhance your reading with AI-powered insights
          </p>
        </div>

        <Tabs defaultValue="save" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="save">Save Article</TabsTrigger>
            <TabsTrigger value="library">My Library</TabsTrigger>
            <TabsTrigger value="study">Study List</TabsTrigger>
            <TabsTrigger value="vocabulary">Vocabulary</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="save" className="mt-6">
            <ArticleSaver onArticleSaved={handleArticleSaved} />
          </TabsContent>

          <TabsContent value="library" className="mt-6">
            <SavedArticlesList refreshTrigger={refreshTrigger} />
          </TabsContent>

          <TabsContent value="study" className="mt-6">
            <StudyList />
          </TabsContent>

          <TabsContent value="vocabulary" className="mt-6">
            <VocabularyList />
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <ApiSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
