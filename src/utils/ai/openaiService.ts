
import { AIAnalysisResult, AIInsight } from './types';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export const analyzeWithOpenAI = async (title: string, content: string, apiKey: string): Promise<AIAnalysisResult> => {
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

export const generateInsightsWithOpenAI = async (title: string, content: string, apiKey: string): Promise<AIInsight[]> => {
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
