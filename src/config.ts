import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGO_URI || '',
  jwtSecret: process.env.JWT_SECRET || '',
  redisUrl: process.env.REDIS_URL || '',
  nodeEnv: process.env.NODE_ENV || '',
  adminKey: process.env.ADMIN_KEY || '',
} as const; 