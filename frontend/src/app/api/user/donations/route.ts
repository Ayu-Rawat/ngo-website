import { NextRequest, NextResponse } from 'next/server';
import sql from '@/database/db';
import { getCurrentSession } from '@/lib/session';

export async function GET(request: NextRequest) {
  try {
    // Get current user session
    const { user } = await getCurrentSession();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get user's donation history
    const donations = await sql`
      SELECT 
        id,
        razorpay_order_id,
        razorpay_payment_id,
        amount,
        currency,
        donor_name,
        donor_email,
        donor_phone,
        status,
        payment_method,
        created_at
      FROM user_donations 
      WHERE user_id = ${user.id}
      ORDER BY created_at DESC
    `;

    // Convert amount from paise to rupees
    const formattedDonations = donations.map(donation => ({
      ...donation,
      amount: donation.amount / 100, // Convert paise to rupees
      created_at: new Date(donation.created_at).toISOString()
    }));

    return NextResponse.json({
      success: true,
      donations: formattedDonations,
      total_donations: formattedDonations.length,
      total_amount: formattedDonations.reduce((sum, d) => sum + d.amount, 0)
    });

  } catch (error: any) {
    console.error('Error fetching donation history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch donation history', details: error.message },
      { status: 500 }
    );
  }
}