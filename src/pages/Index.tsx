
import React, { Suspense, lazy, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ArticleSaver from '@/components/ArticleSaver';

// Lazy-loaded components
const SavedArticlesList = lazy(() => import('@/components/SavedArticlesList'));
const ApiSettings = lazy(() => import('@/components/ApiSettings'));
const DataManagement = lazy(() => import('@/components/DataManagement').then(module => ({ default: module.DataManagement })));
const StudyList = lazy(() => import('@/components/StudyList'));
const VocabularyList = lazy(() => import('@/components/VocabularyList'));
const KnowledgeProfile = lazy(() => import('@/components/KnowledgeProfile'));
const AIKnowledgeAnalyzer = lazy(() => import('@/components/AIKnowledgeAnalyzer'));

const TabContentFallback = () => (
  <div className="p-4 text-center">Loading...</div>
);

const Index = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleArticleSaved = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-4">Reading Augmentation App</h1>
          <p className="text-lg sm:text-xl text-muted-foreground px-4">
            Save, organize, and enhance your reading with AI-powered insights
          </p>
        </div>

        <Tabs defaultValue="save" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1 h-auto p-1">
            <TabsTrigger value="save" className="text-xs sm:text-sm px-2 py-2">Save Article</TabsTrigger>
            <TabsTrigger value="library" className="text-xs sm:text-sm px-2 py-2">My Library</TabsTrigger>
            <TabsTrigger value="study" className="text-xs sm:text-sm px-2 py-2">Study List</TabsTrigger>
            <TabsTrigger value="vocabulary" className="text-xs sm:text-sm px-2 py-2">Vocabulary</TabsTrigger>
            <TabsTrigger value="knowledge" className="text-xs sm:text-sm px-2 py-2">Knowledge</TabsTrigger>
            <TabsTrigger value="ai-insights" className="text-xs sm:text-sm px-2 py-2">AI Insights</TabsTrigger>
            <TabsTrigger value="settings" className="text-xs sm:text-sm px-2 py-2">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="save" className="mt-4 sm:mt-6">
            <ArticleSaver onArticleSaved={handleArticleSaved} />
          </TabsContent>

          <TabsContent value="library" className="mt-4 sm:mt-6">
            <Suspense fallback={<TabContentFallback />}>
              <SavedArticlesList refreshTrigger={refreshTrigger} />
            </Suspense>
          </TabsContent>

          <TabsContent value="study" className="mt-4 sm:mt-6">
            <Suspense fallback={<TabContentFallback />}>
              <StudyList />
            </Suspense>
          </TabsContent>

          <TabsContent value="vocabulary" className="mt-4 sm:mt-6">
            <Suspense fallback={<TabContentFallback />}>
              <VocabularyList />
            </Suspense>
          </TabsContent>

          <TabsContent value="knowledge" className="mt-4 sm:mt-6">
            <Suspense fallback={<TabContentFallback />}>
              <KnowledgeProfile />
            </Suspense>
          </TabsContent>

          <TabsContent value="ai-insights" className="mt-4 sm:mt-6">
            <Suspense fallback={<TabContentFallback />}>
              <AIKnowledgeAnalyzer />
            </Suspense>
          </TabsContent>

          <TabsContent value="settings" className="mt-4 sm:mt-6">
            <Suspense fallback={<TabContentFallback />}>
              <div className="space-y-6">
                <ApiSettings />
                <DataManagement />
              </div>
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
