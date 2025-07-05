
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export class ValidationService {
  static validateArticle(title: string, content: string): ValidationResult {
    const errors: string[] = [];

    if (!title || title.trim().length === 0) {
      errors.push('Title is required');
    }

    if (title && title.length > 500) {
      errors.push('Title must be less than 500 characters');
    }

    if (!content || content.trim().length === 0) {
      errors.push('Content is required');
    }

    if (content && content.length < 50) {
      errors.push('Content must be at least 50 characters long');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static validateUrl(url: string): ValidationResult {
    const errors: string[] = [];

    if (url && url.trim().length > 0) {
      try {
        new URL(url);
      } catch {
        errors.push('Invalid URL format');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static validateWord(word: string): ValidationResult {
    const errors: string[] = [];

    if (!word || word.trim().length === 0) {
      errors.push('Word is required');
    }

    if (word && word.length > 100) {
      errors.push('Word must be less than 100 characters');
    }

    if (word && !/^[a-zA-Z\s-']+$/.test(word)) {
      errors.push('Word contains invalid characters');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static validateApiKey(provider: string, apiKey: string): ValidationResult {
    const errors: string[] = [];

    if (!apiKey || apiKey.trim().length === 0) {
      errors.push(`${provider} API key is required`);
      return { isValid: false, errors };
    }

    // Basic format validation for different providers
    switch (provider) {
      case 'openai':
        if (!apiKey.startsWith('sk-')) {
          errors.push('OpenAI API key should start with "sk-"');
        }
        break;
      case 'anthropic':
        if (!apiKey.startsWith('sk-ant-')) {
          errors.push('Anthropic API key should start with "sk-ant-"');
        }
        break;
      case 'gemini':
        if (apiKey.length < 20) {
          errors.push('Gemini API key appears to be too short');
        }
        break;
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
