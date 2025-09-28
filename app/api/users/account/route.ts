import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/database';
import { authenticateToken } from '@/lib/auth';

// DELETE /api/users/account - Delete user account
export async function DELETE(request: NextRequest) {
  try {
    const authResult = authenticateToken(request);
    if (authResult.error) return authResult.error;
    
    const userId = authResult.user.userId;
    
    const [result] = await pool.execute(
      'DELETE FROM users WHERE user_id = ?',
      [userId]
    );
    
    if ((result as any).affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting account:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete account' },
      { status: 500 }
    );
  }
}
