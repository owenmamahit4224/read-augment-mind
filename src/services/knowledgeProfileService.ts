
import { KnowledgeProfile, KnowledgeProfileEntry } from '@/types/knowledgeProfile';
import { VocabularyEntry, StudyListEntry } from '@/types/article';
import { configService } from './configService';
import { ErrorService, ErrorType } from './errorService';

export class KnowledgeProfileService {
  static extractTopicsFromText(text: string): string[] {
    const commonTopics = [
      'technology', 'science', 'business', 'politics', 'health', 
      'education', 'environment', 'culture', 'history', 'economics',
      'literature', 'art', 'sports', 'travel', 'food'
    ];
    
    const words = text.toLowerCase().split(/\s+/);
    return commonTopics.filter(topic => 
      words.some(word => word.includes(topic) || topic.includes(word))
    );
  }

  static generateFromVocabulary(vocabularyEntries: VocabularyEntry[]): KnowledgeProfileEntry[] {
    const config = configService.get('knowledge');
    const topicMap = new Map<string, {
      keywords: Set<string>;
      relatedTerms: Set<string>;
      sources: Set<string>;
      interactionCount: number;
    }>();

    vocabularyEntries.forEach(entry => {
      const topics = this.extractTopicsFromText(entry.context + ' ' + entry.definition);
      
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
          .slice(0, configService.get('vocabulary').contextWordLimit);
        contextWords.forEach(word => topicData.relatedTerms.add(word));
      });
    });

    return Array.from(topicMap.entries()).map(([topic, data]) => ({
      id: crypto.randomUUID(),
      topic,
      keywords: Array.from(data.keywords),
      relatedTerms: Array.from(data.relatedTerms),
      proficiencyLevel: this.determineProficiencyLevel(data.interactionCount, config),
      interactionCount: data.interactionCount,
      lastInteracted: new Date(),
      sources: Array.from(data.sources),
    }));
  }

  static generateFromStudyList(studyEntries: StudyListEntry[]): KnowledgeProfileEntry[] {
    const config = configService.get('knowledge');
    const topicMap = new Map<string, {
      keywords: Set<string>;
      relatedTerms: Set<string>;
      sources: Set<string>;
      interactionCount: number;
    }>();

    studyEntries.forEach(entry => {
      const topics = this.extractTopicsFromText(entry.context + ' ' + entry.properNoun);
      
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
          .slice(0, configService.get('vocabulary').contextWordLimit);
        contextWords.forEach(word => topicData.relatedTerms.add(word));
      });
    });

    return Array.from(topicMap.entries()).map(([topic, data]) => ({
      id: crypto.randomUUID(),
      topic,
      keywords: Array.from(data.keywords),
      relatedTerms: Array.from(data.relatedTerms),
      proficiencyLevel: this.determineProficiencyLevel(data.interactionCount, config, 'study'),
      interactionCount: data.interactionCount,
      lastInteracted: new Date(),
      sources: Array.from(data.sources),
    }));
  }

  static mergeKnowledgeEntries(entries: KnowledgeProfileEntry[]): KnowledgeProfileEntry[] {
    const config = configService.get('knowledge');
    const mergedKnowledge = new Map<string, KnowledgeProfileEntry>();
    
    entries.forEach(entry => {
      if (mergedKnowledge.has(entry.topic)) {
        const existing = mergedKnowledge.get(entry.topic)!;
        const totalInteractions = existing.interactionCount + entry.interactionCount;
        
        const mergedEntry: KnowledgeProfileEntry = {
          ...existing,
          keywords: [...new Set([...existing.keywords, ...entry.keywords])],
          relatedTerms: [...new Set([...existing.relatedTerms, ...entry.relatedTerms])],
          sources: [...new Set([...existing.sources, ...entry.sources])],
          interactionCount: totalInteractions,
          proficiencyLevel: this.determineProficiencyLevel(totalInteractions, config),
        };
        mergedKnowledge.set(entry.topic, mergedEntry);
      } else {
        mergedKnowledge.set(entry.topic, entry);
      }
    });
    
    return Array.from(mergedKnowledge.values());
  }

  static createProfile(
    vocabEntries: VocabularyEntry[], 
    studyEntries: StudyListEntry[]
  ): KnowledgeProfile {
    try {
      const vocabKnowledge = this.generateFromVocabulary(vocabEntries);
      const studyKnowledge = this.generateFromStudyList(studyEntries);
      
      const allKnowledge = [...vocabKnowledge, ...studyKnowledge];
      const mergedEntries = this.mergeKnowledgeEntries(allKnowledge);
      
      return {
        id: crypto.randomUUID(),
        entries: mergedEntries,
        lastUpdated: new Date(),
        totalInteractions: allKnowledge.reduce((sum, entry) => sum + entry.interactionCount, 0),
      };
    } catch (error) {
      throw ErrorService.createError(
        ErrorType.UNKNOWN,
        'Failed to create knowledge profile',
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }

  private static determineProficiencyLevel(
    interactionCount: number, 
    config: any, 
    source: 'vocabulary' | 'study' = 'vocabulary'
  ): 'beginner' | 'intermediate' | 'advanced' {
    const thresholds = source === 'vocabulary' 
      ? { advanced: 10, intermediate: 5 }
      : { advanced: 8, intermediate: 4 };

    if (interactionCount > thresholds.advanced) return 'advanced';
    if (interactionCount > thresholds.intermediate) return 'intermediate';
    return 'beginner';
  }
}
