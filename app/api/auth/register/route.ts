import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/database';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// POST /api/auth/register - Register new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, email, password, full_name } = body;
    
    if (!username || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Username, email and password are required' },
        { status: 400 }
      );
    }
    
    // Check if user already exists
    const [existingUsers] = await pool.execute(
      'SELECT user_id FROM users WHERE email = ? OR username = ?',
      [email, username]
    );
    
    if (existingUsers.length > 0) {
      return NextResponse.json(
        { success: false, error: 'User with this email or username already exists' },
        { status: 400 }
      );
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const [result] = await pool.execute(
      'INSERT INTO users (username, email, password, full_name, nama) VALUES (?, ?, ?, ?, ?)',
      [username, email, hashedPassword, full_name, full_name || username]
    );
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: (result as any).insertId, email: email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    
    return NextResponse.json({
      success: true,
      message: 'User registered successfully',
      data: {
        user_id: (result as any).insertId,
        username,
        email,
        full_name
      },
      token
    }, { status: 201 });
  } catch (error) {
    console.error('Error during registration:', error);
    return NextResponse.json(
      { success: false, error: 'Registration failed' },
      { status: 500 }
    );
  }
}
