import memjs from 'memjs';
import dotenv from 'dotenv';

dotenv.config();

// Create a Memcached client using environment variables or defaults
const client = memjs.Client.create(process.env.MEMCACHIER_SERVERS || 'localhost:11211', {
  username: process.env.MEMCACHIER_USERNAME || '',
  password: process.env.MEMCACHIER_PASSWORD || '',
  failover: true,
  timeout: 1,
  keepAlive: true
});

export const DEFAULT_TTL = 60 * 5; // 5 minutes in seconds

export const cache = {
  /**
   * Get value from cache
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const { value } = await client.get(key);
      if (!value) return null;
      return JSON.parse(value.toString()) as T;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  },

  /**
   * Set value in cache
   */
  async set(key: string, value: any, ttl: number = DEFAULT_TTL): Promise<boolean> {
    try {
      const serialized = JSON.stringify(value);
      await client.set(key, serialized, { expires: ttl });
      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  },

  /**
   * Delete value from cache
   */
  async delete(key: string): Promise<boolean> {
    try {
      await client.delete(key);
      return true;
    } catch (error) {
      console.error('Cache delete error:', error);
      return false;
    }
  },

  /**
   * Flush all cache
   */
  async flush(): Promise<boolean> {
    try {
      await client.flush();
      return true;
    } catch (error) {
      console.error('Cache flush error:', error);
      return false;
    }
  }
};