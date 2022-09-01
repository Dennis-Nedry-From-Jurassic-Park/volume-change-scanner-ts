import * as redisStore from 'cache-manager-redis-store';

export const REDIS_CACHE_TTL = 60 * 60 * 24;
export const REDIS_HOST = 'redis://localhost:6379';
export const REDIS_PORT = 6379;

export const REDIS_CONFIG = {
  host: REDIS_HOST,
  port: REDIS_PORT,
  password: '',
};

export const REDIS_CACHE_OPTIONS = {
    ...REDIS_CONFIG,
    //store: redisStore.create({}),
    ttl: REDIS_CACHE_TTL,
    max: 100,
    isGlobal: true,
};
