import { FastifyRequest, FastifyReply } from 'fastify';
import { redis } from '../redisClient';

const WINDOW_SIZE = 60; 
const MAX_REQUESTS = 10;

export async function rateLimit(request: FastifyRequest, reply: FastifyReply) {
  const ip = request.ip;
  const key = `ratelimit:${ip}`;

  const current = await redis.incr(key);
  if (current === 1) {
    await redis.expire(key, WINDOW_SIZE);
  }

  if (current > MAX_REQUESTS) {
    return reply.status(429).send({
      error: 'Too Many Requests',
      message: 'Please try again later',
      retryAfter: await redis.ttl(key),
    });
  }
} 