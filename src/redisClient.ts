import Redis from 'ioredis';
import { config } from './config';

const redis = new Redis(config.redisUrl, {
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3,
});

redis.on('error', (err) => {
  console.error('Redis connection error:', err);
});

redis.on('connect', () => {
  console.log('Connected to Redis');
});

export { redis };

const USERNAME_SET_KEY = 'usernames';

export async function addUsernameToBloom(username: string) {
  try {
    await redis.sadd(USERNAME_SET_KEY, username);
  } catch (error) {
    console.error('Error adding username to Redis:', error);
    throw new Error('Failed to add username');
  }
}

export async function checkUsernameBloom(username: string): Promise<boolean> {
  try {
    const exists = await redis.sismember(USERNAME_SET_KEY, username);
    return exists === 1;
  } catch (error) {
    console.error('Error checking username in Redis:', error);
    throw new Error('Failed to check username');
  }
}
