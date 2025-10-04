import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: NextRequest) {
  try {
    const { 
      planId, 
      customerEmail, 
      customerName, 
      customerPhone,
      totalCount = 120 // 10 years worth of monthly payments 
    } = await request.json();

    if (!planId) {
      return NextResponse.json(
        { error: 'Plan ID is required' },
        { status: 400 }
      );
    }

    if (!customerEmail || !customerName) {
      return NextResponse.json(
        { error: 'Customer email and name are required' },
        { status: 400 }
      );
    }

    // Create customer first
    const customer = await razorpay.customers.create({
      name: customerName,
      email: customerEmail,
      contact: customerPhone || '',
      notes: {
        purpose: 'Monthly Donation Subscriber',
        ngo: 'Connect I Network'
      }
    });

    // Create subscription
    const subscriptionOptions = {
      plan_id: planId,
      customer_id: customer.id,
      total_count: totalCount,
      quantity: 1,
      start_at: Math.floor(Date.now() / 1000) + 60, // Start immediately
      expire_by: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 365 * 10), // 10 years from now
      notes: {
        subscriber_name: customerName,
        subscriber_email: customerEmail,
        purpose: 'Monthly Recurring Donation',
        ngo_name: 'Connect I Network'
      }
    //   notify: {
    //     email: true,
    //     sms: true
    //   }
    };

    const subscription = await razorpay.subscriptions.create(subscriptionOptions);

    return NextResponse.json({
      subscription_id: subscription.id,
      plan_id: subscription.plan_id,
      customer_id: subscription.customer_id,
      status: subscription.status,
      current_start: subscription.current_start,
      current_end: subscription.current_end,
      charge_at: subscription.charge_at,
      short_url: subscription.short_url
    });
  } catch (error: any) {
    console.error('Error creating Razorpay subscription:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create subscription. Please try again.',
        details: error.message 
      },
      { status: 500 }
    );
  }
}