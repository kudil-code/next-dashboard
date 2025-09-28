import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/database';
import { authenticateToken } from '@/lib/auth';

// DELETE /api/favorites/[md5_hash] - Remove paket from favorites
export async function DELETE(
  request: NextRequest,
  { params }: { params: { md5_hash: string } }
) {
  try {
    const authResult = authenticateToken(request);
    if (authResult.error) return authResult.error;
    
    const userId = authResult.user.userId;
    const md5Hash = params.md5_hash;
    
    if (!md5Hash) {
      return NextResponse.json(
        { success: false, error: 'MD5 hash parameter is required' },
        { status: 400 }
      );
    }
    
    const [result] = await pool.execute(
      'DELETE FROM user_favorites WHERE user_id = ? AND md5_hash = ?',
      [userId, md5Hash]
    );
    
    if ((result as any).affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: 'Favorite not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Removed from favorites successfully'
    });
  } catch (error) {
    console.error('Error removing from favorites:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove from favorites' },
      { status: 500 }
    );
  }
}
