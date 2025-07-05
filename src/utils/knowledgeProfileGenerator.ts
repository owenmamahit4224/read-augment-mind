
import { KnowledgeProfileService } from '@/services/knowledgeProfileService';
import { getVocabularyEntries } from '@/utils/vocabularyStorage';
import { getStudyListEntries } from '@/utils/studyListStorage';
import { saveKnowledgeProfile } from './knowledgeProfileStorage';

export const generateKnowledgeProfile = (): void => {
  const vocabularyEntries = getVocabularyEntries();
  const studyEntries = getStudyListEntries();
  
  const profile = KnowledgeProfileService.createProfile(vocabularyEntries, studyEntries);
  saveKnowledgeProfile(profile);
};

// Re-export functions for backward compatibility
export const extractTopicsFromText = KnowledgeProfileService.extractTopicsFromText;
export const generateKnowledgeFromVocabulary = KnowledgeProfileService.generateFromVocabulary;
export const generateKnowledgeFromStudyList = KnowledgeProfileService.generateFromStudyList;
