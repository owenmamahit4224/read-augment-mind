
import { getApiSettings } from '../localStorage';
import { AIAnalysisResult, AIInsight } from './types';
import { analyzeWithOpenAI, generateInsightsWithOpenAI } from './openaiService';
import { analyzeWithAnthropic, generateInsightsWithAnthropic } from './anthropicService';
import { analyzeWithGemini, generateInsightsWithGemini } from './geminiService';
import { analyzeWithLMStudio, generateInsightsWithLMStudio } from './lmstudioService';
import { ErrorService, ErrorType } from '@/services/errorService';
import { ValidationService } from '@/services/validationService';
import { configService } from '@/services/configService';

export type { AIAnalysisResult, AIInsight };

export const analyzeArticle = async (title: string, content: string): Promise<AIAnalysisResult> => {
  // Validate inputs
  const titleValidation = ValidationService.validateArticle(title, content);
  if (!titleValidation.isValid) {
    throw ErrorService.createError(
      ErrorType.VALIDATION,
      'Invalid article data',
      titleValidation.errors.join(', ')
    );
  }

  const settings = getApiSettings();
  const config = configService.get('ai');
  
  try {
    if (settings.selectedProvider === 'openai' && settings.openaiApiKey) {
      const keyValidation = ValidationService.validateApiKey('openai', settings.openaiApiKey);
      if (!keyValidation.isValid) {
        throw ErrorService.createError(ErrorType.VALIDATION, 'Invalid API key', keyValidation.errors.join(', '));
      }
      return analyzeWithOpenAI(title, content, settings.openaiApiKey);
    } else if (settings.selectedProvider === 'anthropic' && settings.anthropicApiKey) {
      const keyValidation = ValidationService.validateApiKey('anthropic', settings.anthropicApiKey);
      if (!keyValidation.isValid) {
        throw ErrorService.createError(ErrorType.VALIDATION, 'Invalid API key', keyValidation.errors.join(', '));
      }
      return analyzeWithAnthropic(title, content, settings.anthropicApiKey);
    } else if (settings.selectedProvider === 'gemini' && settings.geminiApiKey) {
      const keyValidation = ValidationService.validateApiKey('gemini', settings.geminiApiKey);
      if (!keyValidation.isValid) {
        throw ErrorService.createError(ErrorType.VALIDATION, 'Invalid API key', keyValidation.errors.join(', '));
      }
      return analyzeWithGemini(title, content, settings.geminiApiKey);
    } else if (settings.selectedProvider === 'lmstudio' && settings.lmstudioEndpoint) {
      return analyzeWithLMStudio(title, content, settings.lmstudioEndpoint);
    } else {
      throw ErrorService.createError(
        ErrorType.VALIDATION,
        'No API configuration found',
        `No API key or endpoint configured for ${settings.selectedProvider}`
      );
    }
  } catch (error) {
    if (error.type) {
      // Already an AppError
      throw error;
    }
    throw ErrorService.handleApiError(error);
  }
};

export const generateInsights = async (title: string, content: string): Promise<AIInsight[]> => {
  // Validate inputs
  const titleValidation = ValidationService.validateArticle(title, content);
  if (!titleValidation.isValid) {
    throw ErrorService.createError(
      ErrorType.VALIDATION,
      'Invalid article data',
      titleValidation.errors.join(', ')
    );
  }

  const settings = getApiSettings();
  
  try {
    if (settings.selectedProvider === 'openai' && settings.openaiApiKey) {
      return generateInsightsWithOpenAI(title, content, settings.openaiApiKey);
    } else if (settings.selectedProvider === 'anthropic' && settings.anthropicApiKey) {
      return generateInsightsWithAnthropic(title, content, settings.anthropicApiKey);
    } else if (settings.selectedProvider === 'gemini' && settings.geminiApiKey) {
      return generateInsightsWithGemini(title, content, settings.geminiApiKey);
    } else if (settings.selectedProvider === 'lmstudio' && settings.lmstudioEndpoint) {
      return generateInsightsWithLMStudio(title, content, settings.lmstudioEndpoint);
    } else {
      throw ErrorService.createError(
        ErrorType.VALIDATION,
        'No API configuration found',
        `No API key or endpoint configured for ${settings.selectedProvider}`
      );
    }
  } catch (error) {
    if (error.type) {
      // Already an AppError
      throw error;
    }
    throw ErrorService.handleApiError(error);
  }
};
