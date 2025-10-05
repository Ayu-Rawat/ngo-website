import { NextRequest, NextResponse } from 'next/server';
import { getCurrentSession } from '@/lib/session';

export async function GET(request: NextRequest) {
  try {
    const { user } = await getCurrentSession();
    
    return NextResponse.json({
      success: true,
      user: user || null
    });

  } catch (error: any) {
    console.error('Error fetching user session:', error);
    return NextResponse.json({
      success: false,
      user: null
    });
  }
}