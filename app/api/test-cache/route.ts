import { NextResponse } from 'next/server';
import { CacheService, CACHE_TTL } from '@/lib/cache';

// GET /api/test-cache - Test cache performance
export async function GET() {
  const startTime = Date.now();
  
  try {
    // Test cache with simple data
    const testKey = 'test:performance';
    const testData = {
      message: 'Hello from cache!',
      timestamp: new Date().toISOString(),
      random: Math.random()
    };
    
    // Try to get from cache first
    const cacheResult = await CacheService.getOrSet(
      testKey,
      async () => {
        // Simulate database delay
        await new Promise(resolve => setTimeout(resolve, 100));
        return testData;
      },
      30 // 30 seconds TTL
    );
    
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    return NextResponse.json({
      success: true,
      data: cacheResult.data,
      performance: {
        responseTime: `${responseTime}ms`,
        fromCache: cacheResult.fromCache,
        cacheKey: cacheResult.cacheKey
      },
      cacheStats: CacheService.getStats()
    });
    
  } catch (error) {
    console.error('Test cache error:', error);
    return NextResponse.json(
      { success: false, error: 'Test failed' },
      { status: 500 }
    );
  }
}
