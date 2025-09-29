import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/database';
import { authenticateToken } from '@/lib/auth';

// GET /api/users/subscription - Get user subscription
export async function GET(request: NextRequest) {
  try {
    const authResult = authenticateToken(request);
    if (authResult.error) return authResult.error;
    
    const userId = authResult.user.userId;
    
    // Get user's active subscription with plan details
    const [subscriptions] = await pool.execute(`
      SELECT 
        us.id,
        us.user_id,
        us.plan_id,
        us.start_date,
        us.end_date,
        us.is_active,
        us.auto_renew,
        us.created_at,
        us.updated_at,
        sp.plan_name,
        sp.plan_display_name,
        sp.duration_months,
        sp.price,
        sp.max_favorites,
        sp.max_daily_views,
        sp.features
      FROM user_subscriptions us
      JOIN subscription_plans sp ON us.plan_id = sp.plan_id
      WHERE us.user_id = ? AND us.is_active = 1
      ORDER BY us.end_date DESC
      LIMIT 1
    `, [userId]);
    
    if ((subscriptions as any[]).length === 0) {
      return NextResponse.json(
        { success: false, error: 'No active subscription found' },
        { status: 404 }
      );
    }
    
    const subscription = (subscriptions as any[])[0];
    
    return NextResponse.json({
      success: true,
      data: subscription
    });
  } catch (error) {
    console.error('Error fetching user subscription:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch subscription' },
      { status: 500 }
    );
  }
}
