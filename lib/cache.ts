// Simple in-memory cache implementation
interface CacheItem<T> {
  data: T;
  expires: number;
}

class SimpleCache {
  private cache = new Map<string, CacheItem<any>>();
  private stats = { hits: 0, misses: 0 };

  get<T>(key: string): T | undefined {
    const item = this.cache.get(key);
    
    if (!item) {
      this.stats.misses++;
      console.log(`❌ [CACHE MISS] Key: ${key}`);
      return undefined;
    }
    
    if (Date.now() > item.expires) {
      this.cache.delete(key);
      this.stats.misses++;
      console.log(`❌ [CACHE EXPIRED] Key: ${key}`);
      return undefined;
    }
    
    this.stats.hits++;
    console.log(`✅ [CACHE HIT] Key: ${key}`);
    return item.data;
  }

  set<T>(key: string, data: T, ttl: number = 3600): boolean {
    const expires = Date.now() + (ttl * 1000);
    this.cache.set(key, { data, expires });
    console.log(`💾 [CACHE SET] Key: ${key}, TTL: ${ttl}s, Expires: ${new Date(expires).toISOString()}`);
    console.log(`🔍 [CACHE DEBUG] Total keys: ${this.cache.size}`);
    return true;
  }

  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    console.log(`🗑️ [CACHE DELETE] Key: ${key}, Deleted: ${deleted}`);
    return deleted;
  }

  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  getStats() {
    const total = this.stats.hits + this.stats.misses;
    return {
      hits: this.stats.hits,
      misses: this.stats.misses,
      hitRate: total > 0 ? (this.stats.hits / total) * 100 : 0,
      keys: this.cache.size,
      ksize: this.cache.size,
      vsize: this.cache.size
    };
  }

  flushAll(): void {
    this.cache.clear();
    this.stats = { hits: 0, misses: 0 };
    console.log('🗑️ [CACHE FLUSH] All cache cleared');
  }

  delPattern(pattern: string): number {
    let deleted = 0;
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
        deleted++;
      }
    }
    console.log(`🗑️ [CACHE DELETE PATTERN] Pattern: ${pattern}, Deleted: ${deleted} keys`);
    return deleted;
  }
}

// Create cache instance
const cache = new SimpleCache();

console.log('🚀 [CACHE INIT] Simple cache instance created');

// Cache key prefixes for different data types
export const CACHE_KEYS = {
  PAKET_LIST: 'paket:list',
  PAKET_SEARCH: 'paket:search',
  PAKET_COUNT: 'paket:count',
  STATS: 'stats:all',
  STATS_TOTAL: 'stats:total',
  STATS_MONTHLY: 'stats:monthly',
} as const;

// Cache TTL configurations (in seconds) - can be overridden by environment variables
export const CACHE_TTL = {
  PAKET_LIST: parseInt(process.env.CACHE_TTL_PAKET || '1800'), // 30 minutes - more frequent updates
  PAKET_SEARCH: parseInt(process.env.CACHE_TTL_SEARCH || '900'), // 15 minutes - search results change more often
  PAKET_COUNT: parseInt(process.env.CACHE_TTL_PAKET || '1800'), // 30 minutes
  STATS: parseInt(process.env.CACHE_TTL_STATS || '3600'), // 1 hour - stats change less frequently
  STATS_TOTAL: parseInt(process.env.CACHE_TTL_STATS || '3600'), // 1 hour
  STATS_MONTHLY: parseInt(process.env.CACHE_TTL_STATS || '3600'), // 1 hour
} as const;

export interface CacheResult<T> {
  data: T;
  fromCache: boolean;
  cacheKey: string;
  ttl?: number;
}

export class CacheService {
  /**
   * Get data from cache
   */
  static get<T>(key: string): T | undefined {
    const startTime = Date.now();
    const data = cache.get<T>(key);
    const endTime = Date.now();
    
    if (data !== undefined) {
      console.log(`✅ [CACHE HIT] Key: ${key} (${endTime - startTime}ms)`);
    } else {
      console.log(`❌ [CACHE MISS] Key: ${key} (${endTime - startTime}ms)`);
    }
    
    return data;
  }

  /**
   * Set data in cache with TTL
   */
  static set<T>(key: string, data: T, ttl?: number): boolean {
    const startTime = Date.now();
    const success = cache.set(key, data, ttl);
    const endTime = Date.now();
    
    console.log(`💾 [CACHE SET] Key: ${key}, TTL: ${ttl || 'default'}s, Success: ${success} (${endTime - startTime}ms)`);
    console.log(`🔍 [CACHE DEBUG] Cache keys after set:`, cache.keys());
    return success;
  }

  /**
   * Delete specific key from cache
   */
  static del(key: string): number {
    const deleted = cache.del(key);
    console.log(`🗑️ [CACHE DELETE] Key: ${key}, Deleted: ${deleted} keys`);
    return deleted;
  }

  /**
   * Delete multiple keys matching pattern
   */
  static delPattern(pattern: string): number {
    const keys = cache.keys().filter(key => key.includes(pattern));
    const deleted = cache.del(keys);
    console.log(`🗑️ [CACHE DELETE PATTERN] Pattern: ${pattern}, Deleted: ${deleted} keys`);
    return deleted;
  }

  /**
   * Get or set data with automatic caching
   */
  static async getOrSet<T>(
    key: string, 
    fetchFn: () => Promise<T>, 
    ttl?: number
  ): Promise<CacheResult<T>> {
    // Try to get from cache first
    const cachedData = this.get<T>(key);
    
    if (cachedData !== undefined) {
      return {
        data: cachedData,
        fromCache: true,
        cacheKey: key,
        ttl: ttl || 3600
      };
    }

    // Cache miss - fetch from source
    console.log(`🔄 [CACHE MISS] Fetching fresh data for key: ${key}`);
    const startTime = Date.now();
    
    try {
      const freshData = await fetchFn();
      const endTime = Date.now();
      
      // Store in cache
      this.set(key, freshData, ttl);
      
      console.log(`✅ [CACHE SET] Fresh data fetched and cached for key: ${key} (${endTime - startTime}ms)`);
      
      return {
        data: freshData,
        fromCache: false,
        cacheKey: key,
        ttl: ttl || 3600
      };
    } catch (error) {
      console.error(`❌ [CACHE ERROR] Failed to fetch data for key: ${key}`, error);
      throw error;
    }
  }

  /**
   * Generate cache key for paket list with parameters
   */
  static generatePaketKey(q?: string, page?: number, limit?: number): string {
    const search = q ? `:search:${q}` : '';
    const pagination = `:page:${page || 1}:limit:${limit || 10}`;
    return `${CACHE_KEYS.PAKET_LIST}${search}${pagination}`;
  }

  /**
   * Generate cache key for paket count with search
   */
  static generatePaketCountKey(q?: string): string {
    const search = q ? `:search:${q}` : '';
    return `${CACHE_KEYS.PAKET_COUNT}${search}`;
  }

  /**
   * Invalidate all paket-related cache
   */
  static invalidatePaketCache(): void {
    this.delPattern('paket:');
    console.log('🔄 [CACHE INVALIDATE] All paket cache cleared');
  }

  /**
   * Invalidate stats cache
   */
  static invalidateStatsCache(): void {
    this.delPattern('stats:');
    console.log('🔄 [CACHE INVALIDATE] All stats cache cleared');
  }

  /**
   * Get cache statistics
   */
  static getStats() {
    const keys = cache.keys();
    const stats = cache.getStats();
    
    console.log('🔍 [CACHE DEBUG] Current cache state:', {
      keys: keys,
      stats: stats,
      cacheInstance: !!cache
    });
    
    return {
      keys: keys.length,
      keysList: keys,
      hits: stats.hits,
      misses: stats.misses,
      ksize: stats.ksize,
      vsize: stats.vsize,
      hitRate: (stats.hits + stats.misses) > 0 ? stats.hits / (stats.hits + stats.misses) * 100 : 0
    };
  }

  /**
   * Clear all cache
   */
  static flushAll(): void {
    cache.flushAll();
    console.log('🗑️ [CACHE FLUSH] All cache cleared');
  }
}

export default CacheService;
