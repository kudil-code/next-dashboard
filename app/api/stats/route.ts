import { NextResponse } from 'next/server'
import { pool } from '@/lib/database'

export async function GET() {
  // Cache response for 1 hour (3600 seconds)
  const cacheHeaders = {
    'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=7200',
    'CDN-Cache-Control': 'max-age=3600',
    'Vercel-CDN-Cache-Control': 'max-age=3600'
  }
  try {
    // Get total tender count
    const startTime = Date.now()
    console.log('🔄 [CACHE MISS] Fetching fresh tender stats from database...')
    
    const [totalTenderRows] = await pool.execute(
      'SELECT COUNT(*) as total FROM paket_pengadaan'
    )
    console.log('Total tender query result:', totalTenderRows)
    
    // Get tender count from last month for comparison
    const [lastMonthRows] = await pool.execute(`
      SELECT COUNT(*) as total 
      FROM paket_pengadaan 
      WHERE tanggal_pembuatan >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)
    `)
    console.log('Last month query result:', lastMonthRows)
    
    // Get tender count from this month
    const [thisMonthRows] = await pool.execute(`
      SELECT COUNT(*) as total 
      FROM paket_pengadaan 
      WHERE tanggal_pembuatan >= DATE_SUB(CURDATE(), INTERVAL DAY(CURDATE())-1 DAY)
    `)
    console.log('This month query result:', thisMonthRows)

    const totalTender = Number((totalTenderRows as any)[0]?.total) || 0
    const lastMonthCount = Number((lastMonthRows as any)[0]?.total) || 0
    const thisMonthCount = Number((thisMonthRows as any)[0]?.total) || 0
    
    console.log('Processed values:', { totalTender, lastMonthCount, thisMonthCount })
    
    // Calculate percentage change
    const percentageChange = lastMonthCount > 0 
      ? ((thisMonthCount - lastMonthCount) / lastMonthCount * 100)
      : 0

    const result = {
      totalTender,
      thisMonthCount,
      lastMonthCount,
      percentageChange: Math.round(percentageChange * 10) / 10
    }
    
    const endTime = Date.now()
    const queryTime = endTime - startTime
    
    console.log('✅ [CACHE] Fresh data generated:', result)
    console.log(`⏱️ [PERFORMANCE] Database queries took: ${queryTime}ms`)
    
    return NextResponse.json(result, { headers: cacheHeaders })
  } catch (error) {
    console.error('Error fetching tender stats:', error)
    // Return default values instead of error to prevent frontend crashes
    // Don't cache error responses
    return NextResponse.json({
      totalTender: 0,
      thisMonthCount: 0,
      lastMonthCount: 0,
      percentageChange: 0
    }, { 
      status: 500,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    })
  }
}
