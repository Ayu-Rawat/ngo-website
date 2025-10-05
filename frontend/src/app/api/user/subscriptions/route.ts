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

    // Get user's subscriptions
    const subscriptions = await sql`
      SELECT 
        id,
        razorpay_subscription_id,
        razorpay_plan_id,
        razorpay_customer_id,
        amount,
        currency,
        subscriber_name,
        subscriber_email,
        subscriber_phone,
        status,
        current_start,
        current_end,
        charge_at,
        total_count,
        paid_count,
        remaining_count,
        short_url,
        created_at,
        updated_at
      FROM user_subscriptions 
      WHERE user_id = ${user.id}
      ORDER BY created_at DESC
    `;

    // Get subscription payments
    const subscriptionPayments = await sql`
      SELECT 
        sp.id,
        sp.razorpay_payment_id,
        sp.amount,
        sp.status,
        sp.payment_date,
        sp.period_start,
        sp.period_end,
        us.razorpay_subscription_id
      FROM subscription_payments sp
      JOIN user_subscriptions us ON sp.subscription_id = us.id
      WHERE us.user_id = ${user.id}
      ORDER BY sp.payment_date DESC
    `;

    // Convert amounts from paise to rupees and format dates
    const formattedSubscriptions = subscriptions.map(sub => ({
      ...sub,
      amount: sub.amount / 100, // Convert paise to rupees
      created_at: new Date(sub.created_at).toISOString(),
      updated_at: new Date(sub.updated_at).toISOString(),
      current_start_date: sub.current_start ? new Date(sub.current_start * 1000).toISOString() : null,
      current_end_date: sub.current_end ? new Date(sub.current_end * 1000).toISOString() : null,
      charge_at_date: sub.charge_at ? new Date(sub.charge_at * 1000).toISOString() : null,
    }));

    console.log('Raw subscriptions from database:', subscriptions);
    console.log('Formatted subscriptions:', formattedSubscriptions);

    const formattedPayments = subscriptionPayments.map(payment => ({
      ...payment,
      amount: payment.amount / 100, // Convert paise to rupees
      payment_date: new Date(payment.payment_date).toISOString(),
      period_start: payment.period_start ? new Date(payment.period_start).toISOString() : null,
      period_end: payment.period_end ? new Date(payment.period_end).toISOString() : null,
    }));

    // Check for multiple possible active statuses
    const activeStatuses = ['active', 'authenticated', 'activated'];
    const activeSubscriptions = formattedSubscriptions.filter(sub => 
      activeStatuses.includes((sub as any).status?.toLowerCase())
    );
    
    console.log('Active subscriptions found:', activeSubscriptions);

    const totalSubscriptionAmount = activeSubscriptions
      .reduce((sum, sub) => sum + sub.amount, 0);

    return NextResponse.json({
      success: true,
      subscriptions: formattedSubscriptions,
      payments: formattedPayments,
      active_subscriptions: activeSubscriptions.length,
      total_monthly_amount: totalSubscriptionAmount,
      total_subscription_payments: formattedPayments.reduce((sum, p) => sum + p.amount, 0)
    });

  } catch (error: any) {
    console.error('Error fetching subscription history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscription history', details: error.message },
      { status: 500 }
    );
  }
}