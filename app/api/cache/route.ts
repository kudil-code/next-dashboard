import { NextRequest, NextResponse } from 'next/server';
import { CacheService } from '@/lib/cache';

// GET /api/cache - Get cache statistics and status
export async function GET() {
  try {
    const stats = CacheService.getStats();
    
    return NextResponse.json({
      success: true,
      data: {
        cache: {
          keys: stats.keys,
          hitRate: Math.round(stats.hitRate * 100) / 100,
          hits: stats.hits,
          misses: stats.misses,
          memory: {
            keys: stats.ksize,
            values: stats.vsize
          }
        },
        keys: stats.keysList,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Error getting cache stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get cache statistics' },
      { status: 500 }
    );
  }
}

// DELETE /api/cache - Clear all cache
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'all', 'paket', 'stats'
    
    switch (type) {
      case 'paket':
        CacheService.invalidatePaketCache();
        break;
      case 'stats':
        CacheService.invalidateStatsCache();
        break;
      case 'all':
      default:
        CacheService.flushAll();
        break;
    }
    
    return NextResponse.json({
      success: true,
      message: `Cache cleared: ${type || 'all'}`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error clearing cache:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to clear cache' },
      { status: 500 }
    );
  }
}
