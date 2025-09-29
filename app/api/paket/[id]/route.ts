import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/database';

// GET /api/paket/[id] - Get paket by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const [rows] = await pool.execute(
      'SELECT * FROM paket_pengadaan WHERE id = ?',
      [id]
    );
    
    if ((rows as any[]).length === 0) {
      return NextResponse.json(
        { success: false, error: 'Not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: (rows as any[])[0] });
  } catch (error) {
    console.error('Error fetching paket by ID:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch paket' },
      { status: 500 }
    );
  }
}

// PUT /api/paket/[id] - Update paket
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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
    
    // Build dynamic update query with only provided fields
    const updateFields: string[] = [];
    const updateValues: any[] = [];
    
    if (file_name !== undefined) {
      updateFields.push('file_name = ?');
      updateValues.push(file_name);
    }
    if (md5_hash !== undefined) {
      updateFields.push('md5_hash = ?');
      updateValues.push(md5_hash);
    }
    if (nama_paket !== undefined) {
      updateFields.push('nama_paket = ?');
      updateValues.push(nama_paket);
    }
    if (kode_paket !== undefined) {
      updateFields.push('kode_paket = ?');
      updateValues.push(kode_paket);
    }
    if (tanggal_pembuatan !== undefined) {
      updateFields.push('tanggal_pembuatan = ?');
      updateValues.push(tanggal_pembuatan);
    }
    if (tanggal_penutupan !== undefined) {
      updateFields.push('tanggal_penutupan = ?');
      updateValues.push(tanggal_penutupan);
    }
    if (kl_pd_instansi !== undefined) {
      updateFields.push('kl_pd_instansi = ?');
      updateValues.push(kl_pd_instansi);
    }
    if (satuan_kerja !== undefined) {
      updateFields.push('satuan_kerja = ?');
      updateValues.push(satuan_kerja);
    }
    if (jenis_pengadaan !== undefined) {
      updateFields.push('jenis_pengadaan = ?');
      updateValues.push(jenis_pengadaan);
    }
    if (metode_pengadaan !== undefined) {
      updateFields.push('metode_pengadaan = ?');
      updateValues.push(metode_pengadaan);
    }
    if (nilai_pagu_paket !== undefined) {
      updateFields.push('nilai_pagu_paket = ?');
      updateValues.push(nilai_pagu_paket);
    }
    if (nilai_hps_paket !== undefined) {
      updateFields.push('nilai_hps_paket = ?');
      updateValues.push(nilai_hps_paket);
    }
    if (lokasi_pekerjaan !== undefined) {
      updateFields.push('lokasi_pekerjaan = ?');
      updateValues.push(lokasi_pekerjaan);
    }
    if (syarat_kualifikasi !== undefined) {
      updateFields.push('syarat_kualifikasi = ?');
      updateValues.push(syarat_kualifikasi);
    }
    if (peserta_non_tender !== undefined) {
      updateFields.push('peserta_non_tender = ?');
      updateValues.push(peserta_non_tender);
    }
    if (html_content !== undefined) {
      updateFields.push('html_content = ?');
      updateValues.push(html_content);
    }
    
    if (updateFields.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No fields provided for update' },
        { status: 400 }
      );
    }
    
    updateValues.push(id);
    
    const [result] = await pool.execute(
      `UPDATE paket_pengadaan SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );
    
    if ((result as any).affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: 'Not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, message: 'Updated successfully' });
  } catch (error) {
    console.error('Error updating paket:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update paket' },
      { status: 500 }
    );
  }
}

// DELETE /api/paket/[id] - Delete paket
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const [result] = await pool.execute(
      'DELETE FROM paket_pengadaan WHERE id = ?',
      [id]
    );
    
    if ((result as any).affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: 'Not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    console.error('Error deleting paket:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete paket' },
      { status: 500 }
    );
  }
}
