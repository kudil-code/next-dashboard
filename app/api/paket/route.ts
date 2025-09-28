import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/database';

// GET /api/paket - Get all paket with search
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;
    
    let whereClause = '';
    let params: any[] = [];
    
    if (q) {
      whereClause = `WHERE nama_paket LIKE ? OR kode_paket LIKE ?`;
      params = [`%${q}%`, `%${q}%`];
    }
    
    // Get total count
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM paket_pengadaan ${whereClause}`,
      params
    );
    const total = (countResult as any)[0].total;
    
    // Get paginated data
    const [rows] = await pool.execute(
      `SELECT * FROM paket_pengadaan ${whereClause} ORDER BY id DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );
    
    return NextResponse.json({ 
      success: true, 
      data: rows,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching paket data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch data' },
      { status: 500 }
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
