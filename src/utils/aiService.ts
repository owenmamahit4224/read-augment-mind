
import { getApiSettings } from './localStorage';

export interface AIAnalysisResult {
  summary: string;
  keyPoints: string[];
  readingLevel: 'beginner' | 'intermediate' | 'advanced';
  estimatedReadingTime: number;
  tags: string[];
}

export interface AIInsight {
  type: 'summary' | 'key-points' | 'questions' | 'related-topics';
  title: string;
  content: string | string[];
}

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

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

const analyzeWithOpenAI = async (title: string, content: string, apiKey: string): Promise<AIAnalysisResult> => {
  const prompt = `Analyze this article and provide a structured analysis:

Title: ${title}
Content: ${content}

Please respond with a JSON object containing:
- summary: A 2-3 sentence summary
- keyPoints: Array of 3-5 key points
- readingLevel: "beginner", "intermediate", or "advanced"
- estimatedReadingTime: Number of minutes (based on 200 words per minute)
- tags: Array of 3-5 relevant tags

Respond only with valid JSON.`;

  const response = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
};

const analyzeWithAnthropic = async (title: string, content: string, apiKey: string): Promise<AIAnalysisResult> => {
  const prompt = `Analyze this article and provide a structured analysis:

Title: ${title}
Content: ${content}

Please respond with a JSON object containing:
- summary: A 2-3 sentence summary
- keyPoints: Array of 3-5 key points
- readingLevel: "beginner", "intermediate", or "advanced"
- estimatedReadingTime: Number of minutes (based on 200 words per minute)
- tags: Array of 3-5 relevant tags

Respond only with valid JSON.`;

  const response = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    throw new Error(`Anthropic API error: ${response.statusText}`);
  }

  const data = await response.json();
  return JSON.parse(data.content[0].text);
};

const generateInsightsWithOpenAI = async (title: string, content: string, apiKey: string): Promise<AIInsight[]> => {
  const prompt = `Generate reading insights for this article:

Title: ${title}
Content: ${content}

Provide insights in the following format as a JSON array:
[
  {
    "type": "summary",
    "title": "Article Summary",
    "content": "Brief summary"
  },
  {
    "type": "key-points", 
    "title": "Key Takeaways",
    "content": ["point 1", "point 2", "point 3"]
  },
  {
    "type": "questions",
    "title": "Discussion Questions", 
    "content": ["question 1", "question 2", "question 3"]
  },
  {
    "type": "related-topics",
    "title": "Related Topics",
    "content": ["topic 1", "topic 2", "topic 3"]
  }
]`;

  const response = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
};

const generateInsightsWithAnthropic = async (title: string, content: string, apiKey: string): Promise<AIInsight[]> => {
  const prompt = `Generate reading insights for this article:

Title: ${title}
Content: ${content}

Provide insights in the following format as a JSON array:
[
  {
    "type": "summary",
    "title": "Article Summary",
    "content": "Brief summary"
  },
  {
    "type": "key-points", 
    "title": "Key Takeaways",
    "content": ["point 1", "point 2", "point 3"]
  },
  {
    "type": "questions",
    "title": "Discussion Questions", 
    "content": ["question 1", "question 2", "question 3"]
  },
  {
    "type": "related-topics",
    "title": "Related Topics",
    "content": ["topic 1", "topic 2", "topic 3"]
  }
]`;

  const response = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-haiku-20240307',
      max_tokens: 2000,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    throw new Error(`Anthropic API error: ${response.statusText}`);
  }

  const data = await response.json();
  return JSON.parse(data.content[0].text);
};
