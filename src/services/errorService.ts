
export enum ErrorType {
  VALIDATION = 'VALIDATION',
  API = 'API',
  NETWORK = 'NETWORK',
  STORAGE = 'STORAGE',
  UNKNOWN = 'UNKNOWN',
}

export interface AppError {
  type: ErrorType;
  message: string;
  details?: string;
  timestamp: Date;
}

export class ErrorService {
  static createError(type: ErrorType, message: string, details?: string): AppError {
    return {
      type,
      message,
      details,
      timestamp: new Date(),
    };
  }

  static handleApiError(error: any): AppError {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return this.createError(
        ErrorType.NETWORK,
        'Network connection failed',
        'Please check your internet connection'
      );
    }

    if (error.status) {
      switch (error.status) {
        case 401:
          return this.createError(
            ErrorType.API,
            'Authentication failed',
            'Please check your API key'
          );
        case 429:
          return this.createError(
            ErrorType.API,
            'Rate limit exceeded',
            'Please wait before making more requests'
          );
        case 500:
          return this.createError(
            ErrorType.API,
            'Server error',
            'The service is temporarily unavailable'
          );
        default:
          return this.createError(
            ErrorType.API,
            `API error (${error.status})`,
            error.message
          );
      }
    }

    return this.createError(
      ErrorType.UNKNOWN,
      'An unexpected error occurred',
      error.message
    );
  }

  static handleStorageError(error: any): AppError {
    return this.createError(
      ErrorType.STORAGE,
      'Storage operation failed',
      error.message
    );
  }

  static getErrorMessage(error: AppError): string {
    return error.details ? `${error.message}: ${error.details}` : error.message;
  }

  static logError(error: AppError): void {
    console.error(`[${error.type}] ${error.message}`, {
      details: error.details,
      timestamp: error.timestamp,
    });
  }
}
