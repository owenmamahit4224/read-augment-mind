import type { VercelRequest, VercelResponse } from '@vercel/node';
import Redis from 'ioredis';

let redis: Redis;

if (process.env.REDIS_URL) {
  redis = new Redis(process.env.REDIS_URL);
} else {
  const port = parseInt(process.env.REDIS_PORT || '6379', 10);
  if (isNaN(port)) {
    console.error('Invalid REDIS_PORT environment variable.');
    // Handle error or throw
  }
  redis = new Redis({
    host: process.env.REDIS_HOST,
    port: port,
    password: process.env.REDIS_PASSWORD,
    username: process.env.REDIS_USERNAME, // Optional, for Redis 6+ ACLs
  });
}

// Define a type for the aggregated user data
interface UserData {
  articles: any[]; // Replace 'any' with actual types if available
  apiSettings: any;
  knowledgeProfile: any;
  studyList: any[];
  vocabulary: any[];
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
  const secretCode = request.headers['x-sync-secret'] || request.body?.secretCode;
  const expectedSecret = process.env.SYNC_SECRET_CODE;

  if (!expectedSecret) {
    console.error('SYNC_SECRET_CODE environment variable is not set.');
    return response.status(500).json({ error: 'Server configuration error: SYNC_SECRET_CODE is missing.' });
  }

  if (secretCode !== expectedSecret) {
    return response.status(401).json({ error: 'Unauthorized: Invalid secret code.' });
  }

  const userId = request.query.userId as string; // Assuming userId is passed as a query parameter
  if (!userId) {
    return response.status(400).json({ error: 'Bad Request: userId is required.' });
  }

  if (request.method === 'POST') {
    try {
      const userData: UserData = request.body.data;
      if (!userData) {
        return response.status(400).json({ error: 'Bad Request: Data to sync is missing.' });
      }

      await redis.set(`user:${userId}`, JSON.stringify(userData));
      return response.status(200).json({ message: 'User data synced successfully.' });
    } catch (error) {
      console.error('Error syncing user data:', error);
      return response.status(500).json({ error: 'Failed to sync user data.' });
    }
  } else if (request.method === 'GET') {
    try {
      const userData = await redis.get(`user:${userId}`);
      if (userData) {
        return response.status(200).json({ data: JSON.parse(userData as string) });
      } else {
        return response.status(404).json({ message: 'User data not found.' });
      }
    } catch (error) {
      console.error('Error retrieving user data:', error);
      return response.status(500).json({ error: 'Failed to retrieve user data.' });
    }
  } else {
    response.setHeader('Allow', ['POST', 'GET']);
    return response.status(405).end(`Method ${request.method} Not Allowed`);
  }
}
