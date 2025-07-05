
export interface AppConfig {
  ai: {
    providers: string[];
    defaultProvider: string;
    retryAttempts: number;
    timeout: number;
  };
  api: {
    endpoints: {
      openai: string;
      anthropic: string;
      gemini: string;
    };
  };
  knowledge: {
    minInteractionsForAdvanced: number;
    minInteractionsForIntermediate: number;
    maxTopicsForAnalysis: number;
    curiosityScoreMultiplier: number;
  };
  vocabulary: {
    wordsPerMinute: number;
    contextWordLimit: number;
  };
}

const defaultConfig: AppConfig = {
  ai: {
    providers: ['openai', 'anthropic', 'gemini', 'lmstudio'],
    defaultProvider: 'openai',
    retryAttempts: 3,
    timeout: 30000,
  },
  api: {
    endpoints: {
      openai: 'https://api.openai.com/v1/chat/completions',
      anthropic: 'https://api.anthropic.com/v1/messages',
      gemini: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent',
    },
  },
  knowledge: {
    minInteractionsForAdvanced: 15,
    minInteractionsForIntermediate: 8,
    maxTopicsForAnalysis: 5,
    curiosityScoreMultiplier: 10,
  },
  vocabulary: {
    wordsPerMinute: 200,
    contextWordLimit: 5,
  },
};

export class ConfigService {
  private static instance: ConfigService;
  private config: AppConfig;

  private constructor() {
    this.config = { ...defaultConfig };
  }

  public static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

  public get<K extends keyof AppConfig>(key: K): AppConfig[K] {
    return this.config[key];
  }

  public getAll(): AppConfig {
    return { ...this.config };
  }

  public update<K extends keyof AppConfig>(key: K, value: Partial<AppConfig[K]>): void {
    this.config[key] = { ...this.config[key], ...value };
  }
}

export const configService = ConfigService.getInstance();
