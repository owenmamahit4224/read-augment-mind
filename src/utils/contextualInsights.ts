
import { ContextualInsight, LearningGap } from '@/types/knowledgeProfile';
import { getKnowledgeProfile } from './localStorage';
import { extractTopicsFromText } from './knowledgeProfileGenerator';

export const generateContextualInsights = (
  newContentTitle: string,
  newContentText: string
): ContextualInsight[] => {
  const profile = getKnowledgeProfile();
  if (!profile) return [];

  const insights: ContextualInsight[] = [];
  const contentTopics = extractTopicsFromText(newContentTitle + ' ' + newContentText);
  
  // Find connections to existing knowledge
  contentTopics.forEach(topic => {
    const existingEntry = profile.entries.find(entry => entry.topic === topic);
    if (existingEntry) {
      insights.push({
        id: crypto.randomUUID(),
        type: 'connection',
        title: `Connection to ${topic}`,
        description: `This content relates to your existing knowledge about ${topic}. You've encountered ${existingEntry.interactionCount} related terms before.`,
        relatedTopics: [topic],
        confidence: Math.min(existingEntry.interactionCount / 10, 1),
        actionable: true,
        suggestedAction: `Review your notes on ${existingEntry.keywords.slice(0, 3).join(', ')} to strengthen connections.`,
      });
    } else {
      insights.push({
        id: crypto.randomUUID(),
        type: 'expansion',
        title: `New topic: ${topic}`,
        description: `This introduces you to ${topic}, which appears to be new to your knowledge profile.`,
        relatedTopics: [topic],
        confidence: 0.8,
        actionable: true,
        suggestedAction: `Consider adding key terms from this ${topic} content to your vocabulary.`,
      });
    }
  });

  // Look for reinforcement opportunities
  const strongTopics = profile.entries.filter(entry => entry.proficiencyLevel === 'advanced');
  contentTopics.forEach(topic => {
    const strongTopic = strongTopics.find(entry => entry.topic === topic);
    if (strongTopic) {
      insights.push({
        id: crypto.randomUUID(),
        type: 'reinforcement',
        title: `Reinforcing ${topic} expertise`,
        description: `This content can help reinforce your advanced understanding of ${topic}.`,
        relatedTopics: [topic],
        confidence: 0.9,
        actionable: false,
      });
    }
  });

  return insights.sort((a, b) => b.confidence - a.confidence).slice(0, 5);
};

export const detectLearningGaps = (): LearningGap[] => {
  const profile = getKnowledgeProfile();
  if (!profile) return [];

  const gaps: LearningGap[] = [];
  
  // Find topics with low interaction counts
  const weakTopics = profile.entries.filter(entry => 
    entry.proficiencyLevel === 'beginner' && entry.interactionCount < 3
  );

  weakTopics.forEach(entry => {
    gaps.push({
      topic: entry.topic,
      missingConcepts: [`Advanced concepts in ${entry.topic}`, `Practical applications of ${entry.topic}`],
      suggestedResources: [`Articles about ${entry.topic}`, `Case studies in ${entry.topic}`],
      priority: entry.interactionCount === 1 ? 'high' : 'medium',
    });
  });

  return gaps.slice(0, 3);
};

export const suggestLearningPath = (targetTopic: string): string[] => {
  const profile = getKnowledgeProfile();
  if (!profile) return [];

  const relatedEntries = profile.entries.filter(entry => 
    entry.relatedTerms.some(term => 
      term.toLowerCase().includes(targetTopic.toLowerCase()) ||
      targetTopic.toLowerCase().includes(term.toLowerCase())
    )
  );

  const path = relatedEntries
    .sort((a, b) => a.proficiencyLevel === 'beginner' ? -1 : 1)
    .map(entry => `Study ${entry.topic} (${entry.proficiencyLevel} level)`)
    .slice(0, 4);

  return path;
};
