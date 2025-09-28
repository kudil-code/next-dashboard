import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/database';
import { authenticateToken } from '@/lib/auth';

// GET /api/users/profile - Get user profile
export async function GET(request: NextRequest) {
  try {
    const authResult = authenticateToken(request);
    if (authResult.error) return authResult.error;
    
    const userId = authResult.user.userId;
    
    const [users] = await pool.execute(
      'SELECT user_id, username, email, full_name, nama, created_at FROM users WHERE user_id = ?',
      [userId]
    );
    
    if ((users as any[]).length === 0) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: (users as any[])[0]
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch user profile' },
      { status: 500 }
    );
  }
}

// PUT /api/users/profile - Update user profile
export async function PUT(request: NextRequest) {
  try {
    const authResult = authenticateToken(request);
    if (authResult.error) return authResult.error;
    
    const userId = authResult.user.userId;
    const body = await request.json();
    const { username, full_name } = body;
    
    const [result] = await pool.execute(
      'UPDATE users SET username = ?, full_name = ?, nama = ? WHERE user_id = ?',
      [username, full_name, full_name || username, userId]
    );
    
    if ((result as any).affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update user profile' },
      { status: 500 }
    );
  }
}
