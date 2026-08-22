import { Redis } from 'ioredis';

export const redis = new Redis(
  process.env.REDIS_URL || 'redis://localhost:6379',
  {
    //BullMQ requires this behavior for blocking Redis commands used by workers.
    maxRetriesPerRequest: null,
  },
);
