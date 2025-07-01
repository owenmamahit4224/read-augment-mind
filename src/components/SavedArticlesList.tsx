
import React from 'react';
import ArticleDetail from './ArticleDetail';
import ArticleSearchBar from './ArticleSearchBar';
import ArticleCard from './ArticleCard';
import EmptyState from './EmptyState';
import { useArticlesList } from '@/hooks/useArticlesList';

interface SavedArticlesListProps {
  refreshTrigger: number;
}

const SavedArticlesList = ({ refreshTrigger }: SavedArticlesListProps) => {
  const {
    articles,
    filteredArticles,
    searchTerm,
    setSearchTerm,
    selectedArticle,
    handleDelete,
    handleViewArticle,
    handleBackToList,
    handleNextArticle,
    handlePreviousArticle,
  } = useArticlesList(refreshTrigger);

  // Show article detail view if an article is selected
  if (selectedArticle) {
    const currentIndex = filteredArticles.findIndex(a => a.id === selectedArticle.id);
    return (
      <ArticleDetail
        article={selectedArticle}
        onBack={handleBackToList}
        onNext={currentIndex < filteredArticles.length - 1 ? handleNextArticle : undefined}
        onPrevious={currentIndex > 0 ? handlePreviousArticle : undefined}
      />
    );
  }

  if (articles.length === 0) {
    return <EmptyState message="No saved articles yet. Start by saving your first article above!" />;
  }

  return (
    <div className="space-y-6">
      <ArticleSearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        totalCount={articles.length}
      />

      {filteredArticles.length === 0 && searchTerm && (
        <EmptyState message={`No articles found matching "${searchTerm}"`} />
      )}

      <div className="grid gap-4">
        {filteredArticles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            onView={handleViewArticle}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default SavedArticlesList;
