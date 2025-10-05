import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import sql from '@/database/db';
import { getCurrentSession } from '@/lib/session';

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// GET - Fetch subscription details from Razorpay
export async function GET(request: NextRequest) {
  try {
    const { user } = await getCurrentSession();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const subscriptionId = searchParams.get('subscription_id');

    if (!subscriptionId) {
      return NextResponse.json(
        { error: 'Subscription ID is required' },
        { status: 400 }
      );
    }

    // Verify subscription belongs to this user
    const userSubscription = await sql`
      SELECT * FROM user_subscriptions 
      WHERE razorpay_subscription_id = ${subscriptionId} 
      AND user_id = ${user.id}
      LIMIT 1
    `;

    if (userSubscription.length === 0) {
      return NextResponse.json(
        { error: 'Subscription not found or not authorized' },
        { status: 404 }
      );
    }

    // Fetch latest subscription data from Razorpay
    const subscription = await razorpay.subscriptions.fetch(subscriptionId);

    // Update our database with latest data
    await sql`
      UPDATE user_subscriptions 
      SET 
        status = ${(subscription as any).status},
        current_start = ${(subscription as any).current_start},
        current_end = ${(subscription as any).current_end},
        charge_at = ${(subscription as any).charge_at},
        paid_count = ${(subscription as any).paid_count},
        remaining_count = ${(subscription as any).remaining_count},
        updated_at = CURRENT_TIMESTAMP
      WHERE razorpay_subscription_id = ${subscriptionId}
    `;

    return NextResponse.json({
      success: true,
      subscription: {
        id: (subscription as any).id,
        plan_id: (subscription as any).plan_id,
        customer_id: (subscription as any).customer_id,
        status: (subscription as any).status,
        current_start: (subscription as any).current_start,
        current_end: (subscription as any).current_end,
        charge_at: (subscription as any).charge_at,
        total_count: (subscription as any).total_count,
        paid_count: (subscription as any).paid_count,
        remaining_count: (subscription as any).remaining_count,
        created_at: (subscription as any).created_at,
        plan: (subscription as any).plan
      }
    });

  } catch (error: any) {
    console.error('Error fetching subscription:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscription', details: error.message },
      { status: 500 }
    );
  }
}

// PUT - Manage subscription (cancel, pause, resume)
export async function PUT(request: NextRequest) {
  try {
    const { user } = await getCurrentSession();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { subscription_id, action, cancel_at_cycle_end } = await request.json();

    if (!subscription_id || !action) {
      return NextResponse.json(
        { error: 'Subscription ID and action are required' },
        { status: 400 }
      );
    }

    // Verify subscription belongs to this user
    const userSubscription = await sql`
      SELECT * FROM user_subscriptions 
      WHERE razorpay_subscription_id = ${subscription_id} 
      AND user_id = ${user.id}
      LIMIT 1
    `;

    if (userSubscription.length === 0) {
      return NextResponse.json(
        { error: 'Subscription not found or not authorized' },
        { status: 404 }
      );
    }

    let result: any;

    switch (action) {
      case 'cancel':
        result = await razorpay.subscriptions.cancel(subscription_id, cancel_at_cycle_end || false);
        break;

      case 'pause':
        result = await razorpay.subscriptions.pause(subscription_id, { pause_at: 'now' });
        break;

      case 'resume':
        result = await razorpay.subscriptions.resume(subscription_id, { resume_at: 'now' });
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action. Use cancel, pause, or resume' },
          { status: 400 }
        );
    }

    // Update our database with the new status
    await sql`
      UPDATE user_subscriptions 
      SET 
        status = ${(result as any).status},
        current_start = ${(result as any).current_start},
        current_end = ${(result as any).current_end},
        charge_at = ${(result as any).charge_at},
        updated_at = CURRENT_TIMESTAMP
      WHERE razorpay_subscription_id = ${subscription_id}
    `;

    return NextResponse.json({
      success: true,
      message: `Subscription ${action}ed successfully`,
      subscription: {
        id: (result as any).id,
        status: (result as any).status,
        current_start: (result as any).current_start,
        current_end: (result as any).current_end,
        charge_at: (result as any).charge_at
      }
    });

  } catch (error: any) {
    console.error(`Error managing subscription:`, error);
    return NextResponse.json(
      { 
        error: `Failed to manage subscription`, 
        details: error.message 
      },
      { status: 500 }
    );
  }
}