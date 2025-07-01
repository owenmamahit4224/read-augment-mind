
import { getApiSettings } from '../localStorage';
import { AIAnalysisResult, AIInsight } from './types';
import { analyzeWithOpenAI, generateInsightsWithOpenAI } from './openaiService';
import { analyzeWithAnthropic, generateInsightsWithAnthropic } from './anthropicService';
import { analyzeWithGemini, generateInsightsWithGemini } from './geminiService';
import { analyzeWithLMStudio, generateInsightsWithLMStudio } from './lmstudioService';

export type { AIAnalysisResult, AIInsight };

export const analyzeArticle = async (title: string, content: string): Promise<AIAnalysisResult> => {
  const settings = getApiSettings();
  
  if (settings.selectedProvider === 'openai' && settings.openaiApiKey) {
    return analyzeWithOpenAI(title, content, settings.openaiApiKey);
  } else if (settings.selectedProvider === 'anthropic' && settings.anthropicApiKey) {
    return analyzeWithAnthropic(title, content, settings.anthropicApiKey);
  } else if (settings.selectedProvider === 'gemini' && settings.geminiApiKey) {
    return analyzeWithGemini(title, content, settings.geminiApiKey);
  } else if (settings.selectedProvider === 'lmstudio' && settings.lmstudioEndpoint) {
    return analyzeWithLMStudio(title, content, settings.lmstudioEndpoint);
  } else {
    throw new Error('No API key or endpoint configured for the selected provider');
  }
};

export const generateInsights = async (title: string, content: string): Promise<AIInsight[]> => {
  const settings = getApiSettings();
  
  if (settings.selectedProvider === 'openai' && settings.openaiApiKey) {
    return generateInsightsWithOpenAI(title, content, settings.openaiApiKey);
  } else if (settings.selectedProvider === 'anthropic' && settings.anthropicApiKey) {
    return generateInsightsWithAnthropic(title, content, settings.anthropicApiKey);
  } else if (settings.selectedProvider === 'gemini' && settings.geminiApiKey) {
    return generateInsightsWithGemini(title, content, settings.geminiApiKey);
  } else if (settings.selectedProvider === 'lmstudio' && settings.lmstudioEndpoint) {
    return generateInsightsWithLMStudio(title, content, settings.lmstudioEndpoint);
  } else {
    throw new Error('No API key or endpoint configured for the selected provider');
  }
};
