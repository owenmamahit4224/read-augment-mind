import { getSavedArticles, saveArticle } from '@/utils/localStorage';
import { getKnowledgeProfile, saveKnowledgeProfile } from '@/utils/knowledgeProfileStorage';
import { getStudyListEntries, saveStudyListEntry } from '@/utils/studyListStorage';
import { getVocabularyEntries, saveVocabularyEntry } from '@/utils/vocabularyStorage';
import { SavedArticle, StudyListEntry, VocabularyEntry } from '@/types/article';
import { KnowledgeProfile } from '@/types/knowledgeProfile';
import { mergeArticles, mergeKnowledgeProfiles, mergeStudyList, mergeVocabulary } from '@/utils/mergeUtils';

interface ExportedData {
  articles: SavedArticle[];
  knowledgeProfile: KnowledgeProfile | null;
  studyList: StudyListEntry[];
  vocabulary: VocabularyEntry[];
}

export interface MergeStats {
  newArticles: number;
  updatedArticles: number;
  newKnowledgeEntries: number;
  updatedKnowledgeEntries: number;
  newStudyListEntries: number;
  updatedStudyListEntries: number;
  newVocabularyEntries: number;
  updatedVocabularyEntries: number;
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

export const mergeData = async (files: File[]): Promise<MergeStats> => {
  const existingData: ExportedData = {
    articles: getSavedArticles(),
    knowledgeProfile: getKnowledgeProfile(),
    studyList: getStudyListEntries(),
    vocabulary: getVocabularyEntries(),
  };

  let mergedArticles = existingData.articles;
  let mergedKnowledgeProfile = existingData.knowledgeProfile;
  let mergedStudyList = existingData.studyList;
  let mergedVocabulary = existingData.vocabulary;

  for (const file of files) {
    const fileContent = await file.text();
    const data: ExportedData = JSON.parse(fileContent);

    if (data.articles) {
      mergedArticles = mergeArticles(mergedArticles, data.articles);
    }
    if (data.knowledgeProfile) {
      mergedKnowledgeProfile = mergedKnowledgeProfile
        ? mergeKnowledgeProfiles(mergedKnowledgeProfile, [data.knowledgeProfile])
        : data.knowledgeProfile;
    }
    if (data.studyList) {
      mergedStudyList = mergeStudyList(mergedStudyList, data.studyList);
    }
    if (data.vocabulary) {
      mergedVocabulary = mergeVocabulary(mergedVocabulary, data.vocabulary);
    }
  }

  // Clear existing data before saving merged data
  localStorage.removeItem('saved_articles');
  localStorage.removeItem('knowledge_profile');
  localStorage.removeItem('study_list');
  localStorage.removeItem('new_vocabulary_list');

  mergedArticles.forEach(article => saveArticle(article));
  if (mergedKnowledgeProfile) {
    saveKnowledgeProfile(mergedKnowledgeProfile);
  }
  mergedStudyList.forEach(entry => saveStudyListEntry(entry));
  mergedVocabulary.forEach(entry => saveVocabularyEntry(entry));

  // Note: The stats calculation is simplified here. For a real implementation,
  // the merge functions would need to return more detailed information.
  const stats: MergeStats = {
    newArticles: mergedArticles.length - existingData.articles.length,
    updatedArticles: 0, // Simplified
    newKnowledgeEntries: (mergedKnowledgeProfile?.entries.length || 0) - (existingData.knowledgeProfile?.entries.length || 0),
    updatedKnowledgeEntries: 0, // Simplified
    newStudyListEntries: mergedStudyList.length - existingData.studyList.length,
    updatedStudyListEntries: 0, // Simplified
    newVocabularyEntries: mergedVocabulary.length - existingData.vocabulary.length,
    updatedVocabularyEntries: 0, // Simplified
  };

  return stats;
};

export const importData = (file: File, merge = false): Promise<MergeStats | void> => {
  return new Promise((resolve, reject) => {
    if (merge) {
      mergeData([file]).then(resolve).catch(reject);
    } else {
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
    }
  });
};
