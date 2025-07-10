import { SavedArticle, StudyListEntry, VocabularyEntry } from '@/types/article';
import { KnowledgeProfile, KnowledgeProfileEntry } from '@/types/knowledgeProfile';

export const mergeArticles = (existingArticles: SavedArticle[], newArticles: SavedArticle[]): SavedArticle[] => {
  const articleMap = new Map<string, SavedArticle>();

  existingArticles.forEach(article => {
    if (article.sourceUrl) {
      articleMap.set(article.sourceUrl, article);
    }
  });

  newArticles.forEach(newArticle => {
    if (newArticle.sourceUrl) {
      const existingArticle = articleMap.get(newArticle.sourceUrl);
      if (existingArticle) {
        if (new Date(newArticle.timestamp) > new Date(existingArticle.timestamp)) {
          articleMap.set(newArticle.sourceUrl, newArticle);
        }
      } else {
        articleMap.set(newArticle.sourceUrl, newArticle);
      }
    }
  });

  return Array.from(articleMap.values());
};

export const mergeKnowledgeProfiles = (existingProfile: KnowledgeProfile, newProfiles: KnowledgeProfile[]): KnowledgeProfile => {
  let mergedProfile = { ...existingProfile };

  newProfiles.forEach(newProfile => {
    mergedProfile.lastUpdated = new Date(Math.max(new Date(mergedProfile.lastUpdated).getTime(), new Date(newProfile.lastUpdated).getTime()));
    mergedProfile.totalInteractions += newProfile.totalInteractions;

    newProfile.entries.forEach(newEntry => {
      const existingEntryIndex = mergedProfile.entries.findIndex(e => e.topic === newEntry.topic);
      if (existingEntryIndex > -1) {
        const existingEntry = mergedProfile.entries[existingEntryIndex];
        const updatedEntry: KnowledgeProfileEntry = {
          ...existingEntry,
          keywords: [...new Set([...existingEntry.keywords, ...newEntry.keywords])],
          relatedTerms: [...new Set([...existingEntry.relatedTerms, ...newEntry.relatedTerms])],
          proficiencyLevel: newEntry.proficiencyLevel, // Keep the newer profile's level
          interactionCount: existingEntry.interactionCount + newEntry.interactionCount,
          lastInteracted: new Date(Math.max(new Date(existingEntry.lastInteracted).getTime(), new Date(newEntry.lastInteracted).getTime())),
          sources: [...new Set([...existingEntry.sources, ...newEntry.sources])]
        };
        mergedProfile.entries[existingEntryIndex] = updatedEntry;
      } else {
        mergedProfile.entries.push(newEntry);
      }
    });
  });

  return mergedProfile;
};

export const mergeStudyList = (existingEntries: StudyListEntry[], newEntries: StudyListEntry[]): StudyListEntry[] => {
  const entryMap = new Map<string, StudyListEntry>();

  existingEntries.forEach(entry => {
    const key = `${entry.articleId}-${entry.properNoun}`;
    entryMap.set(key, entry);
  });

  newEntries.forEach(newEntry => {
    const key = `${newEntry.articleId}-${newEntry.properNoun}`;
    const existingEntry = entryMap.get(key);
    if (existingEntry) {
      if (new Date(newEntry.timestamp) > new Date(existingEntry.timestamp)) {
        const updatedEntry = { ...newEntry };
        if (existingEntry.notes && newEntry.notes) {
          updatedEntry.notes = `${existingEntry.notes}\n${newEntry.notes}`;
        } else if (existingEntry.notes) {
          updatedEntry.notes = existingEntry.notes;
        }
        entryMap.set(key, updatedEntry);
      }
    } else {
      entryMap.set(key, newEntry);
    }
  });

  return Array.from(entryMap.values());
};

export const mergeVocabulary = (existingEntries: VocabularyEntry[], newEntries: VocabularyEntry[]): VocabularyEntry[] => {
  const entryMap = new Map<string, VocabularyEntry>();

  existingEntries.forEach(entry => {
    entryMap.set(entry.word.toLowerCase(), entry);
  });

  newEntries.forEach(newEntry => {
    const key = newEntry.word.toLowerCase();
    const existingEntry = entryMap.get(key);
    if (existingEntry) {
      if (new Date(newEntry.timestamp) > new Date(existingEntry.timestamp)) {
        const updatedEntry = { ...newEntry };
        if (existingEntry.definition && newEntry.definition) {
          updatedEntry.definition = `${existingEntry.definition}\n${newEntry.definition}`;
        } else if (existingEntry.definition) {
          updatedEntry.definition = existingEntry.definition;
        }
        if (existingEntry.notes && newEntry.notes) {
          updatedEntry.notes = `${existingEntry.notes}\n${newEntry.notes}`;
        } else if (existingEntry.notes) {
          updatedEntry.notes = existingEntry.notes;
        }
        entryMap.set(key, updatedEntry);
      }
    } else {
      entryMap.set(key, newEntry);
    }
  });

  return Array.from(entryMap.values());
};
