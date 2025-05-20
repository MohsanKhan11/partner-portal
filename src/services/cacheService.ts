import { redis } from '../redisClient';

export enum CacheKey {
  USER = 'user',
  ALL_USERS = 'users:all',
  USERNAME_BLOOM = 'username:bloom'
}

export class CacheService {
  private static instance: CacheService;
  private readonly defaultTTL = 3600; 

  private constructor() {}

  public static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  private generateKey(type: CacheKey, identifier?: string): string {
    return identifier ? `${type}:${identifier}` : type;
  }
 
  public async set<T>(type: CacheKey, data: T, identifier?: string, ttl?: number): Promise<void> {
    const key = this.generateKey(type, identifier);
    const serializedData = JSON.stringify(data);
    await redis.set(key, serializedData, 'EX', ttl || this.defaultTTL);
  }

  public async get<T>(type: CacheKey, identifier?: string): Promise<T | null> {
    const key = this.generateKey(type, identifier);
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  }


  public async delete(type: CacheKey, identifier?: string): Promise<void> {
    const key = this.generateKey(type, identifier);
    await redis.del(key);
  }


  public async invalidateUserCaches(username?: string): Promise<void> {
    if (username) {
      await this.delete(CacheKey.USER, username);
    }
    await this.delete(CacheKey.ALL_USERS);
  }


} 