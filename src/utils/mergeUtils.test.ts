import { describe, it, expect } from 'vitest';
import { mergeArticles, mergeKnowledgeProfiles, mergeStudyList, mergeVocabulary } from './mergeUtils';
import { SavedArticle, StudyListEntry, VocabularyEntry } from '@/types/article';
import { KnowledgeProfile } from '@/types/knowledgeProfile';

describe('mergeArticles', () => {
  it('should merge new articles and update existing ones', () => {
    const existingArticles: SavedArticle[] = [
      { id: '1', title: 'Article 1', sourceUrl: 'url1', content: '', timestamp: new Date('2023-01-01') },
    ];
    const newArticles: SavedArticle[] = [
      { id: '2', title: 'Article 2', sourceUrl: 'url2', content: '', timestamp: new Date('2023-01-02') },
      { id: '3', title: 'Article 1 Updated', sourceUrl: 'url1', content: '', timestamp: new Date('2023-01-03') },
    ];
    const merged = mergeArticles(existingArticles, newArticles);
    expect(merged).toHaveLength(2);
    expect(merged.find(a => a.sourceUrl === 'url1')?.title).toBe('Article 1 Updated');
  });
});

describe('mergeKnowledgeProfiles', () => {
  it('should merge knowledge profiles', () => {
    const existingProfile: KnowledgeProfile = {
      id: 'kp1',
      entries: [{ id: 'e1', topic: 'T1', keywords: ['k1'], relatedTerms: [], proficiencyLevel: 'beginner', interactionCount: 1, lastInteracted: new Date(), sources: [] }],
      lastUpdated: new Date('2023-01-01'),
      totalInteractions: 1,
    };
    const newProfiles: KnowledgeProfile[] = [{
      id: 'kp2',
      entries: [
        { id: 'e2', topic: 'T2', keywords: ['k2'], relatedTerms: [], proficiencyLevel: 'beginner', interactionCount: 1, lastInteracted: new Date(), sources: [] },
        { id: 'e3', topic: 'T1', keywords: ['k3'], relatedTerms: [], proficiencyLevel: 'intermediate', interactionCount: 2, lastInteracted: new Date(), sources: [] }
      ],
      lastUpdated: new Date('2023-01-02'),
      totalInteractions: 3,
    }];
    const merged = mergeKnowledgeProfiles(existingProfile, newProfiles);
    expect(merged.entries).toHaveLength(2);
    expect(merged.entries.find(e => e.topic === 'T1')?.interactionCount).toBe(3);
    expect(merged.entries.find(e => e.topic === 'T1')?.keywords).toEqual(['k1', 'k3']);
  });
});

describe('mergeStudyList', () => {
  it('should merge study list entries', () => {
    const existingEntries: StudyListEntry[] = [
      { id: 's1', articleId: 'a1', articleTitle: 'Article 1', properNoun: 'PN1', context: '', timestamp: new Date('2023-01-01'), notes: 'note1' },
    ];
    const newEntries: StudyListEntry[] = [
      { id: 's2', articleId: 'a2', articleTitle: 'Article 2', properNoun: 'PN2', context: '', timestamp: new Date('2023-01-02') },
      { id: 's3', articleId: 'a1', articleTitle: 'Article 1', properNoun: 'PN1', context: '', timestamp: new Date('2023-01-03'), notes: 'note2' },
    ];
    const merged = mergeStudyList(existingEntries, newEntries);
    expect(merged).toHaveLength(2);
    expect(merged.find(s => s.articleId === 'a1')?.notes).toBe('note1\nnote2');
  });
});

describe('mergeVocabulary', () => {
  it('should merge vocabulary entries', () => {
    const existingEntries: VocabularyEntry[] = [
      { id: 'v1', word: 'Word1', sourceMaterialId: 'sm1', sourceMaterialTitle: '', context: '', timestamp: new Date('2023-01-01'), definition: 'def1' },
    ];
    const newEntries: VocabularyEntry[] = [
      { id: 'v2', word: 'Word2', sourceMaterialId: 'sm2', sourceMaterialTitle: '', context: '', timestamp: new Date('2023-01-02') },
      { id: 'v3', word: 'word1', sourceMaterialId: 'sm3', sourceMaterialTitle: '', context: '', timestamp: new Date('2023-01-03'), definition: 'def2' },
    ];
    const merged = mergeVocabulary(existingEntries, newEntries);
    expect(merged).toHaveLength(2);
    expect(merged.find(v => v.word.toLowerCase() === 'word1')?.definition).toBe('def1\ndef2');
  });
});
