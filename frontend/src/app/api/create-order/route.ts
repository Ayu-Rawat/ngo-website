import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: NextRequest) {
  try {
    const { amount, currency = 'INR', donorName, donorEmail } = await request.json();

    if (!amount || amount < 1) {
      return NextResponse.json(
        { error: 'Amount must be at least ₹1' },
        { status: 400 }
      );
    }

    const options = {
      amount: amount * 100,
      currency,
      receipt: `receipt_${Date.now()}`,
      notes: {
        donor_name: donorName || 'Anonymous',
        donor_email: donorEmail || '',
  purpose: 'Donation to Change I Network',
      },
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
    });
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json(
      { error: 'Failed to create order. Please try again.' },
      { status: 500 }
    );
  }
}