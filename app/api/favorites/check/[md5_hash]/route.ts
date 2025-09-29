import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/database';
import { authenticateToken } from '@/lib/auth';

// GET /api/favorites/check/[md5_hash] - Check if paket is in favorites
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ md5_hash: string }> }
) {
  try {
    const authResult = authenticateToken(request);
    if (authResult.error) return authResult.error;
    
    const userId = authResult.user.userId;
    const { md5_hash: md5Hash } = await params;
    
    if (!md5Hash) {
      return NextResponse.json(
        { success: false, error: 'MD5 hash parameter is required' },
        { status: 400 }
      );
    }
    
    const [favorite] = await pool.execute(
      'SELECT id, notes, created_at FROM user_favorites WHERE user_id = ? AND md5_hash = ?',
      [userId, md5Hash]
    );
    
    return NextResponse.json({
      success: true,
      data: {
        is_favorite: (favorite as any[]).length > 0,
        favorite_id: (favorite as any[]).length > 0 ? (favorite as any[])[0].id : null,
        notes: (favorite as any[]).length > 0 ? (favorite as any[])[0].notes : null,
        favorited_at: (favorite as any[]).length > 0 ? (favorite as any[])[0].created_at : null
      }
    });
  } catch (error) {
    console.error('Error checking favorite status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to check favorite status' },
      { status: 500 }
    );
  }
}
