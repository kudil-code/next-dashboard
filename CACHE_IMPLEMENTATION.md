# Server-Side Caching Implementation

## Overview
This document describes the server-side caching implementation for the Next.js dashboard application using Node.js in-memory cache.

## Architecture

### Cache Service (`lib/cache.ts`)
- **Library**: `node-cache` for in-memory caching
- **TTL Management**: Configurable TTL per data type
- **Key Strategy**: Hierarchical cache keys with parameters
- **Monitoring**: Built-in hit/miss logging and statistics

### Cache Configuration

#### TTL Settings (in seconds)
```typescript
CACHE_TTL = {
  PAKET_LIST: 1800,    // 30 minutes - list data
  PAKET_SEARCH: 900,   // 15 minutes - search results
  PAKET_COUNT: 1800,   // 30 minutes - count queries
  STATS: 3600,         // 1 hour - statistics data
}
```

#### Environment Variables
```env
CACHE_TTL_DEFAULT=3600
CACHE_TTL_PAKET=1800
CACHE_TTL_STATS=3600
CACHE_TTL_SEARCH=900
```

## Implemented Endpoints

### 1. `/api/stats` - Statistics Cache
- **Cache Key**: `stats:all`
- **TTL**: 1 hour (3600 seconds)
- **Strategy**: Full response caching
- **Invalidation**: Manual or TTL expiry

**Cache Headers Added:**
- `X-Cache-Status`: HIT/MISS
- `X-Cache-Key`: Cache key used
- `X-Cache-TTL`: Time to live

### 2. `/api/paket` - Paket List Cache
- **Cache Key**: `paket:list:page:X:limit:Y` or `paket:list:search:QUERY:page:X:limit:Y`
- **TTL**: 30 minutes (list) / 15 minutes (search)
- **Strategy**: 
  - Separate caching for count and data
  - Different TTL for search vs list
  - Parameter-based cache keys

**Cache Headers Added:**
- `X-Cache-Status`: HIT/MISS
- `X-Cache-Key`: Cache key used
- `X-Cache-TTL`: Time to live

### 3. `/api/cache` - Cache Management
- **GET**: Get cache statistics and status
- **DELETE**: Clear cache (all, paket, or stats)

## Cache Key Strategy

### Paket Cache Keys
```typescript
// List without search
paket:list:page:1:limit:10

// List with search
paket:list:search:keyword:page:1:limit:10

// Count without search
paket:count

// Count with search
paket:count:search:keyword
```

### Stats Cache Keys
```typescript
stats:all
```

## Performance Benefits

### Before Caching
- Every request hits MySQL database
- Response time: 100-500ms (depending on data size)
- Database load: High on concurrent requests

### After Caching
- Cache hit: 1-5ms response time
- Cache miss: 100-500ms (first request)
- Database load: Reduced by 80-90% for cached data

## Monitoring & Debugging

### Console Logs
```
✅ [CACHE HIT] Key: paket:list:page:1:limit:10 (2ms)
❌ [CACHE MISS] Key: stats:all (1ms)
💾 [CACHE SET] Key: paket:list:page:1:limit:10, TTL: 1800s (3ms)
🔄 [CACHE INVALIDATE] All paket cache cleared
```

### Cache Statistics
Access via `GET /api/cache`:
```json
{
  "success": true,
  "data": {
    "cache": {
      "keys": 15,
      "hitRate": 85.5,
      "hits": 1234,
      "misses": 210,
      "memory": {
        "keys": 1024,
        "values": 2048
      }
    },
    "keys": ["paket:list:page:1:limit:10", "stats:all", ...],
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

## Cache Invalidation

### Manual Invalidation
```bash
# Clear all cache
DELETE /api/cache

# Clear paket cache only
DELETE /api/cache?type=paket

# Clear stats cache only
DELETE /api/cache?type=stats
```

### Automatic Invalidation
- TTL expiry (automatic)
- Server restart (cache is in-memory)

## Future Enhancements

### 1. Redis Integration
- Shared cache across multiple instances
- Persistent cache (survives restarts)
- Advanced features (pub/sub, clustering)

### 2. Cache Warming
- Pre-populate cache on server start
- Background refresh before expiry

### 3. Smart Invalidation
- Invalidate related cache keys on data updates
- Event-driven cache invalidation

### 4. Cache Analytics
- Detailed performance metrics
- Cache efficiency reports
- Memory usage monitoring

## Usage Examples

### Testing Cache Performance
```bash
# First request (cache miss)
curl -I http://localhost:3000/api/stats
# X-Cache-Status: MISS

# Second request (cache hit)
curl -I http://localhost:3000/api/stats
# X-Cache-Status: HIT

# Check cache statistics
curl http://localhost:3000/api/cache
```

### Monitoring Cache Health
```bash
# Get cache stats
curl http://localhost:3000/api/cache | jq '.data.cache'

# Clear cache if needed
curl -X DELETE http://localhost:3000/api/cache
```

## Best Practices

1. **TTL Selection**: Balance between data freshness and performance
2. **Key Naming**: Use consistent, hierarchical naming
3. **Memory Management**: Monitor memory usage in production
4. **Error Handling**: Always fallback to database on cache errors
5. **Monitoring**: Track hit rates and performance metrics

## Troubleshooting

### High Memory Usage
- Reduce TTL values
- Implement cache size limits
- Monitor with `/api/cache` endpoint

### Low Hit Rates
- Check cache key generation
- Verify TTL settings
- Review request patterns

### Stale Data
- Reduce TTL for frequently changing data
- Implement manual invalidation triggers
- Consider real-time invalidation
