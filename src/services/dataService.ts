import { getSavedArticles, saveArticle } from '@/utils/localStorage';
import { getKnowledgeProfile, saveKnowledgeProfile } from '@/utils/knowledgeProfileStorage';
import { getStudyListEntries, saveStudyListEntry } from '@/utils/studyListStorage';
import { getVocabularyEntries, saveVocabularyEntry } from '@/utils/vocabularyStorage';
import { SavedArticle } from '@/types/article';
import { KnowledgeProfile } from '@/types/knowledgeProfile';
import { StudyListEntry } from '@/types/article';
import { VocabularyEntry } from '@/types/article';

interface ExportedData {
  articles: SavedArticle[];
  knowledgeProfile: KnowledgeProfile | null;
  studyList: StudyListEntry[];
  vocabulary: VocabularyEntry[];
}

export const exportData = (): void => {
  const data: ExportedData = {
    articles: getSavedArticles(),
    knowledgeProfile: getKnowledgeProfile(),
    studyList: getStudyListEntries(),
    vocabulary: getVocabularyEntries(),
  };

  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.]/g, '-'); // Format: YYYY-MM-DDTHH-mm-ss.sssZ
  const filename = `read-augment-mind-data-${timestamp}.json`;

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const importData = (file: File): Promise<void> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonString = event.target?.result as string;
        const data: ExportedData = JSON.parse(jsonString);

        // Clear existing data
        localStorage.removeItem('saved_articles');
        localStorage.removeItem('knowledge_profile');
        localStorage.removeItem('study_list');
        localStorage.removeItem('new_vocabulary_list');

        // Import new data
        if (data.articles) {
          data.articles.forEach(article => saveArticle(article));
        }
        if (data.knowledgeProfile) {
          saveKnowledgeProfile(data.knowledgeProfile);
        }
        if (data.studyList) {
          data.studyList.forEach(entry => saveStudyListEntry(entry));
        }
        if (data.vocabulary) {
          data.vocabulary.forEach(entry => saveVocabularyEntry(entry));
        }

        resolve();
      } catch (error) {
        console.error('Error importing data:', error);
        reject(error);
      }
    };
    reader.onerror = (error) => {
      console.error('Error reading file:', error);
      reject(error);
    };
    reader.readAsText(file);
  });
};
