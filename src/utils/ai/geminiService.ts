
import { AIAnalysisResult, AIInsight } from './types';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

export const analyzeWithGemini = async (title: string, content: string, apiKey: string): Promise<AIAnalysisResult> => {
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

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 1000,
      }
    }),
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.statusText}`);
  }

  const data = await response.json();
  const textResponse = data.candidates[0].content.parts[0].text;
  return JSON.parse(textResponse);
};

export const generateInsightsWithGemini = async (title: string, content: string, apiKey: string): Promise<AIInsight[]> => {
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

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2000,
      }
    }),
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.statusText}`);
  }

  const data = await response.json();
  const textResponse = data.candidates[0].content.parts[0].text;
  return JSON.parse(textResponse);
};
