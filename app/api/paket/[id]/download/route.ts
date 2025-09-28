import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/database'

// GET /api/paket/[id]/download - Download HTML content
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const [rows] = await pool.execute(
      'SELECT html_content, nama_paket, kode_paket FROM paket_pengadaan WHERE id = ?',
      [id]
    )

    const paket = (rows as any)[0]
    
    if (!paket) {
      return NextResponse.json(
        { success: false, error: 'Paket not found' },
        { status: 404 }
      )
    }

    if (!paket.html_content) {
      return NextResponse.json(
        { success: false, error: 'No HTML content available for this paket' },
        { status: 404 }
      )
    }

    // Create filename from paket data
    const filename = `${paket.kode_paket}_${paket.nama_paket.replace(/[^a-zA-Z0-9]/g, '_')}.html`
    
    // Return HTML content as downloadable file
    return new NextResponse(paket.html_content, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch (error) {
    console.error('Error downloading HTML content:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to download HTML content' },
      { status: 500 }
    )
  }
}
