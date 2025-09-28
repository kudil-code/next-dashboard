import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Simple authentication middleware for Next.js API routes
 */
export function authenticateToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return {
      error: NextResponse.json({
        success: false,
        error: 'Access token required'
      }, { status: 401 })
    };
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    return { user };
  } catch (err) {
    return {
      error: NextResponse.json({
        success: false,
        error: 'Invalid or expired token'
      }, { status: 403 })
    };
  }
}
