import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/database';
import { authenticateToken } from '@/lib/auth';

// GET /api/favorites - Get all user favorites
export async function GET(request: NextRequest) {
  try {
    const authResult = authenticateToken(request);
    if (authResult.error) return authResult.error;
    
    const userId = authResult.user.userId;
    
    const [favorites] = await pool.execute(
      'SELECT f.id as favorite_id, f.notes, f.created_at as favorited_at, p.id, p.md5_hash, p.nama_paket, p.kode_paket, p.nilai_pagu_paket, p.kl_pd_instansi, p.satuan_kerja, p.jenis_pengadaan, p.metode_pengadaan, p.lokasi_pekerjaan, p.peserta_non_tender, p.tanggal_pembuatan, p.created_at, p.updated_at FROM user_favorites f JOIN paket_pengadaan p ON f.md5_hash = p.md5_hash WHERE f.user_id = ? ORDER BY f.created_at DESC',
      [userId]
    );
    
    return NextResponse.json({
      success: true,
      data: favorites,
      count: (favorites as any[]).length
    });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch favorites' },
      { status: 500 }
    );
  }
}

// POST /api/favorites - Add paket to favorites
export async function POST(request: NextRequest) {
  try {
    const authResult = authenticateToken(request);
    if (authResult.error) return authResult.error;
    
    const userId = authResult.user.userId;
    const body = await request.json();
    const { md5_hash, notes } = body;
    
    if (!md5_hash) {
      return NextResponse.json(
        { success: false, error: 'md5_hash is required' },
        { status: 400 }
      );
    }
    
    // Check if paket exists
    const [paket] = await pool.execute(
      'SELECT id, md5_hash FROM paket_pengadaan WHERE md5_hash = ?',
      [md5_hash]
    );
    
    if ((paket as any[]).length === 0) {
      return NextResponse.json(
        { success: false, error: 'Paket not found' },
        { status: 404 }
      );
    }
    
    // Check if already in favorites
    const [existing] = await pool.execute(
      'SELECT id FROM user_favorites WHERE user_id = ? AND md5_hash = ?',
      [userId, md5_hash]
    );
    
    if ((existing as any[]).length > 0) {
      return NextResponse.json(
        { success: false, error: 'Paket already in favorites' },
        { status: 400 }
      );
    }
    
    // Add to favorites
    const [result] = await pool.execute(
      'INSERT INTO user_favorites (user_id, md5_hash, notes) VALUES (?, ?, ?)',
      [userId, md5_hash, notes]
    );
    
    // Get the paket details
    const [paketDetails] = await pool.execute(
      'SELECT p.id, p.md5_hash, p.nama_paket, p.kode_paket, p.nilai_pagu_paket, p.kl_pd_instansi, p.satuan_kerja, p.jenis_pengadaan, p.metode_pengadaan, p.lokasi_pekerjaan, p.peserta_non_tender, p.tanggal_pembuatan, p.created_at, p.updated_at FROM paket_pengadaan p WHERE p.md5_hash = ?',
      [md5_hash]
    );
    
    return NextResponse.json({
      success: true,
      message: 'Added to favorites successfully',
      data: {
        favorite_id: (result as any).insertId,
        paket: (paketDetails as any[])[0],
        favorited_at: new Date().toISOString()
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Error adding to favorites:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add to favorites' },
      { status: 500 }
    );
  }
}

// DELETE /api/favorites - Clear all favorites
export async function DELETE(request: NextRequest) {
  try {
    const authResult = authenticateToken(request);
    if (authResult.error) return authResult.error;
    
    const userId = authResult.user.userId;
    
    const [result] = await pool.execute(
      'DELETE FROM user_favorites WHERE user_id = ?',
      [userId]
    );
    
    return NextResponse.json({
      success: true,
      message: 'Cleared ' + (result as any).affectedRows + ' favorites successfully'
    });
  } catch (error) {
    console.error('Error clearing favorites:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to clear favorites' },
      { status: 500 }
    );
  }
}
