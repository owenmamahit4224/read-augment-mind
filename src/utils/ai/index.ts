
import { getApiSettings } from '../localStorage';
import { AIAnalysisResult, AIInsight } from './types';
import { analyzeWithOpenAI, generateInsightsWithOpenAI } from './openaiService';
import { analyzeWithAnthropic, generateInsightsWithAnthropic } from './anthropicService';

export type { AIAnalysisResult, AIInsight };

export const analyzeArticle = async (title: string, content: string): Promise<AIAnalysisResult> => {
  const settings = getApiSettings();
  
  if (settings.selectedProvider === 'openai' && settings.openaiApiKey) {
    return analyzeWithOpenAI(title, content, settings.openaiApiKey);
  } else if (settings.selectedProvider === 'anthropic' && settings.anthropicApiKey) {
    return analyzeWithAnthropic(title, content, settings.anthropicApiKey);
  } else {
    throw new Error('No API key configured for the selected provider');
  }
};

export const generateInsights = async (title: string, content: string): Promise<AIInsight[]> => {
  const settings = getApiSettings();
  
  if (settings.selectedProvider === 'openai' && settings.openaiApiKey) {
    return generateInsightsWithOpenAI(title, content, settings.openaiApiKey);
  } else if (settings.selectedProvider === 'anthropic' && settings.anthropicApiKey) {
    return generateInsightsWithAnthropic(title, content, settings.anthropicApiKey);
  } else {
    throw new Error('No API key configured for the selected provider');
  }
};
