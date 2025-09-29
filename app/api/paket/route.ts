import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/database';
import { CacheService, CACHE_TTL } from '@/lib/cache';

// GET /api/paket - Get all paket with search
export async function GET(request: NextRequest) {
  // Cache headers for 1 hour (3600 seconds)
  const cacheHeaders = {
    'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=7200',
    'CDN-Cache-Control': 'max-age=3600',
    'Vercel-CDN-Cache-Control': 'max-age=3600'
  }

  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    // Generate cache key based on parameters
    const hpsMin = searchParams.get('hps_min');
    const hpsMax = searchParams.get('hps_max');
    const todayOnly = searchParams.get('today_only');
    const last30Days = searchParams.get('last_30_days');
    
    // Validate that min is not greater than max
    if (hpsMin && hpsMax) {
      const minValue = parseFloat(hpsMin);
      const maxValue = parseFloat(hpsMax);
      if (!isNaN(minValue) && !isNaN(maxValue) && minValue > maxValue) {
        // Return empty result if min > max
        const emptyResult = {
          success: true,
          data: [],
          pagination: {
            total: 0,
            page,
            limit,
            totalPages: 0
          }
        };
        return NextResponse.json(emptyResult, { headers: cacheHeaders });
      }
    }
    
    const cacheKey = CacheService.generatePaketKey(q, page, limit, hpsMin || undefined, hpsMax || undefined, todayOnly || undefined, last30Days || undefined);
    const countCacheKey = CacheService.generatePaketCountKey(q, hpsMin || undefined, hpsMax || undefined, todayOnly || undefined, last30Days || undefined);
    
    // Try to get from cache first
    const cacheResult = await CacheService.getOrSet(
      cacheKey,
      async () => {
        console.log('🔄 [CACHE MISS] Fetching fresh tender data from database...')
        
        const offset = (page - 1) * limit;
        
        let whereClause = '';
        let params: any[] = [];
        
        // Build WHERE clause based on search parameters
        const conditions: string[] = [];
        
        if (q) {
          conditions.push(`(nama_paket LIKE ? OR kode_paket LIKE ?)`);
          params.push(`%${q}%`, `%${q}%`);
        }
        
        const hpsMin = searchParams.get('hps_min');
        const hpsMax = searchParams.get('hps_max');
        
        if (hpsMin) {
          const minValue = parseFloat(hpsMin);
          // Only add condition if value is valid and non-negative
          if (!isNaN(minValue) && minValue >= 0) {
            conditions.push(`nilai_hps_paket >= ?`);
            params.push(minValue);
          }
        }
        
        if (hpsMax) {
          const maxValue = parseFloat(hpsMax);
          // Only add condition if value is valid and non-negative
          if (!isNaN(maxValue) && maxValue >= 0) {
            conditions.push(`nilai_hps_paket <= ?`);
            params.push(maxValue);
          }
        }
        
        
        const todayOnly = searchParams.get('today_only');
        const last30Days = searchParams.get('last_30_days');
        
        if (todayOnly === 'true') {
          const today = new Date().toISOString().split('T')[0];
          conditions.push(`DATE(tanggal_pembuatan) = ?`);
          params.push(today);
        }
        
        if (last30Days === 'true') {
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split('T')[0];
          conditions.push(`DATE(tanggal_pembuatan) >= ?`);
          params.push(thirtyDaysAgoStr);
        }
        
        if (conditions.length > 0) {
          whereClause = `WHERE ${conditions.join(' AND ')}`;
        }
        
        // Get total count (try cache first)
        let total: number;
        const cachedCount = CacheService.get<number>(countCacheKey);
        
        if (cachedCount !== undefined) {
          total = cachedCount;
          console.log('✅ [CACHE HIT] Using cached count:', total);
        } else {
          const [countResult] = await pool.execute(
            `SELECT COUNT(*) as total FROM paket_pengadaan ${whereClause}`,
            params
          );
          total = (countResult as any)[0].total;
          
          // Cache the count separately
          CacheService.set(countCacheKey, total, CACHE_TTL.PAKET_COUNT);
          console.log('💾 [CACHE SET] Count cached:', total);
        }
        
        // Get paginated data
        const [rows] = await pool.execute(
          `SELECT * FROM paket_pengadaan ${whereClause} ORDER BY id DESC LIMIT ? OFFSET ?`,
          [...params, limit, offset]
        ) as [any[], any];
        
        return {
          success: true, 
          data: rows,
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
          }
        };
      },
      q ? CACHE_TTL.PAKET_SEARCH : CACHE_TTL.PAKET_LIST // Shorter TTL for search results
    );
    
    const response = cacheResult.data;
    const fromCache = cacheResult.fromCache;
    
    console.log(`✅ [PAKET] Data ${fromCache ? 'served from cache' : 'generated fresh'}:`, {
      totalRecords: response.pagination.total,
      returnedRecords: response.data.length,
      query: q || 'all',
      page,
      fromCache
    });
    
    // Add cache info to response headers for debugging
    const responseHeaders = {
      ...cacheHeaders,
      'X-Cache-Status': fromCache ? 'HIT' : 'MISS',
      'X-Cache-Key': cacheResult.cacheKey,
      'X-Cache-TTL': cacheResult.ttl?.toString() || 'unknown'
    };
    
    return NextResponse.json(response, { headers: responseHeaders });
  } catch (error) {
    console.error('❌ [ERROR] Failed to fetch paket data:', error);
    // Don't cache error responses
    return NextResponse.json(
      { success: false, error: 'Failed to fetch data' },
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      }
    );
  }
}

// POST /api/paket - Create new paket
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      file_name,
      md5_hash,
      nama_paket,
      kode_paket,
      tanggal_pembuatan,
      tanggal_penutupan,
      kl_pd_instansi,
      satuan_kerja,
      jenis_pengadaan,
      metode_pengadaan,
      nilai_pagu_paket,
      nilai_hps_paket,
      lokasi_pekerjaan,
      syarat_kualifikasi,
      peserta_non_tender,
      html_content
    } = body;
    
    const [result] = await pool.execute(
      'INSERT INTO paket_pengadaan (file_name, md5_hash, nama_paket, kode_paket, tanggal_pembuatan, tanggal_penutupan, kl_pd_instansi, satuan_kerja, jenis_pengadaan, metode_pengadaan, nilai_pagu_paket, nilai_hps_paket, lokasi_pekerjaan, syarat_kualifikasi, peserta_non_tender, html_content) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [file_name, md5_hash, nama_paket, kode_paket, tanggal_pembuatan, tanggal_penutupan, kl_pd_instansi, satuan_kerja, jenis_pengadaan, metode_pengadaan, nilai_pagu_paket, nilai_hps_paket, lokasi_pekerjaan, syarat_kualifikasi, peserta_non_tender, html_content]
    );
    
    return NextResponse.json({
      success: true,
      data: { id: (result as any).insertId, ...body },
      message: 'Created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating paket:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create paket' },
      { status: 500 }
    );
  }
}
