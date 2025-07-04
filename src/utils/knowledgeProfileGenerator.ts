
import { VocabularyEntry, StudyListEntry } from '@/types/article';
import { KnowledgeProfileEntry } from '@/types/knowledgeProfile';
import { 
  getVocabularyEntries, 
  getStudyListEntries 
} from '@/utils/vocabularyStorage';
import { getStudyListEntries as getStudyEntries } from '@/utils/studyListStorage';

export const extractTopicsFromText = (text: string): string[] => {
  // Simple topic extraction - can be enhanced with AI in the future
  const commonTopics = [
    'technology', 'science', 'business', 'politics', 'health', 
    'education', 'environment', 'culture', 'history', 'economics',
    'literature', 'art', 'sports', 'travel', 'food'
  ];
  
  const words = text.toLowerCase().split(/\s+/);
  return commonTopics.filter(topic => 
    words.some(word => word.includes(topic) || topic.includes(word))
  );
};

export const generateKnowledgeFromVocabulary = (
  vocabularyEntries: VocabularyEntry[]
): KnowledgeProfileEntry[] => {
  const topicMap = new Map<string, {
    keywords: Set<string>;
    relatedTerms: Set<string>;
    sources: Set<string>;
    interactionCount: number;
  }>();

  vocabularyEntries.forEach(entry => {
    const topics = extractTopicsFromText(entry.context + ' ' + entry.definition);
    
    topics.forEach(topic => {
      if (!topicMap.has(topic)) {
        topicMap.set(topic, {
          keywords: new Set(),
          relatedTerms: new Set(),
          sources: new Set(),
          interactionCount: 0,
        });
      }
      
      const topicData = topicMap.get(topic)!;
      topicData.keywords.add(entry.word);
      topicData.sources.add(entry.sourceMaterialId);
      topicData.interactionCount++;
      
      // Extract related terms from context
      const contextWords = entry.context.split(/\s+/)
        .filter(word => word.length > 3)
        .slice(0, 5);
      contextWords.forEach(word => topicData.relatedTerms.add(word));
    });
  });

  return Array.from(topicMap.entries()).map(([topic, data]) => ({
    id: crypto.randomUUID(),
    topic,
    keywords: Array.from(data.keywords),
    relatedTerms: Array.from(data.relatedTerms),
    proficiencyLevel: data.interactionCount > 10 ? 'advanced' : 
                     data.interactionCount > 5 ? 'intermediate' : 'beginner',
    interactionCount: data.interactionCount,
    lastInteracted: new Date(),
    sources: Array.from(data.sources),
  }));
};

export const generateKnowledgeFromStudyList = (
  studyEntries: StudyListEntry[]
): KnowledgeProfileEntry[] => {
  const topicMap = new Map<string, {
    keywords: Set<string>;
    relatedTerms: Set<string>;
    sources: Set<string>;
    interactionCount: number;
  }>();

  studyEntries.forEach(entry => {
    const topics = extractTopicsFromText(entry.context + ' ' + entry.properNoun);
    
    topics.forEach(topic => {
      if (!topicMap.has(topic)) {
        topicMap.set(topic, {
          keywords: new Set(),
          relatedTerms: new Set(),
          sources: new Set(),
          interactionCount: 0,
        });
      }
      
      const topicData = topicMap.get(topic)!;
      topicData.keywords.add(entry.properNoun);
      topicData.sources.add(entry.articleId);
      topicData.interactionCount++;
      
      // Extract related terms from context
      const contextWords = entry.context.split(/\s+/)
        .filter(word => word.length > 3)
        .slice(0, 5);
      contextWords.forEach(word => topicData.relatedTerms.add(word));
    });
  });

  return Array.from(topicMap.entries()).map(([topic, data]) => ({
    id: crypto.randomUUID(),
    topic,
    keywords: Array.from(data.keywords),
    relatedTerms: Array.from(data.relatedTerms),
    proficiencyLevel: data.interactionCount > 8 ? 'advanced' : 
                     data.interactionCount > 4 ? 'intermediate' : 'beginner',
    interactionCount: data.interactionCount,
    lastInteracted: new Date(),
    sources: Array.from(data.sources),
  }));
};

export const generateKnowledgeProfile = (): void => {
  const vocabularyEntries = getVocabularyEntries();
  const studyEntries = getStudyEntries();
  
  const vocabKnowledge = generateKnowledgeFromVocabulary(vocabularyEntries);
  const studyKnowledge = generateKnowledgeFromStudyList(studyEntries);
  
  // Merge and deduplicate knowledge entries
  const allKnowledge = [...vocabKnowledge, ...studyKnowledge];
  const mergedKnowledge = new Map<string, KnowledgeProfileEntry>();
  
  allKnowledge.forEach(entry => {
    if (mergedKnowledge.has(entry.topic)) {
      const existing = mergedKnowledge.get(entry.topic)!;
      const mergedEntry: KnowledgeProfileEntry = {
        ...existing,
        keywords: [...new Set([...existing.keywords, ...entry.keywords])],
        relatedTerms: [...new Set([...existing.relatedTerms, ...entry.relatedTerms])],
        sources: [...new Set([...existing.sources, ...entry.sources])],
        interactionCount: existing.interactionCount + entry.interactionCount,
        proficiencyLevel: existing.interactionCount + entry.interactionCount > 15 ? 'advanced' : 
                         existing.interactionCount + entry.interactionCount > 8 ? 'intermediate' : 'beginner',
      };
      mergedKnowledge.set(entry.topic, mergedEntry);
    } else {
      mergedKnowledge.set(entry.topic, entry);
    }
  });
  
  // Save the generated profile
  const profile = {
    id: crypto.randomUUID(),
    entries: Array.from(mergedKnowledge.values()),
    lastUpdated: new Date(),
    totalInteractions: allKnowledge.reduce((sum, entry) => sum + entry.interactionCount, 0),
  };
  
  const { saveKnowledgeProfile } = require('./knowledgeProfileStorage');
  saveKnowledgeProfile(profile);
};
