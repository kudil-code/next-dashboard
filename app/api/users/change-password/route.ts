import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/database';
import { authenticateToken } from '@/lib/auth';
import bcrypt from 'bcrypt';

// PUT /api/users/change-password - Change password
export async function PUT(request: NextRequest) {
  try {
    const authResult = authenticateToken(request);
    if (authResult.error) return authResult.error;
    
    const userId = authResult.user.userId;
    const body = await request.json();
    const { currentPassword, newPassword } = body;
    
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, error: 'Current password and new password are required' },
        { status: 400 }
      );
    }
    
    // Get current password
    const [users] = await pool.execute(
      'SELECT password FROM users WHERE user_id = ?',
      [userId]
    );
    
    if ((users as any[]).length === 0) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, (users as any[])[0].password);
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: 'Current password is incorrect' },
        { status: 400 }
      );
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update password
    await pool.execute(
      'UPDATE users SET password = ? WHERE user_id = ?',
      [hashedPassword, userId]
    );
    
    return NextResponse.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Error changing password:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to change password' },
      { status: 500 }
    );
  }
}
