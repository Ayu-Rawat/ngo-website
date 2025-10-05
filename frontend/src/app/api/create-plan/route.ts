import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: NextRequest) {
  try {
    const { amount, interval = 'monthly' } = await request.json();

    if (!amount || amount < 1) {
      return NextResponse.json(
        { error: 'Amount must be at least ₹1' },
        { status: 400 }
      );
    }

    const planOptions = {
      period: interval,
      interval: 1,
      item: {
  name: `Change I Network - Monthly Donation ₹${amount}`,
        amount: amount * 100, // Convert to paise
        currency: 'INR',
  description: `Monthly recurring donation of ₹${amount} to Change I Network NGO`
      },
      notes: {
        purpose: 'Monthly Recurring Donation',
  ngo_name: 'Change I Network',
        amount_inr: amount.toString()
      }
    };

    const plan = await razorpay.plans.create(planOptions);

    return NextResponse.json({
      id: plan.id,
      period: plan.period,
      interval: plan.interval,
      item: {
        name: plan.item.name,
        amount: plan.item.amount,
        currency: plan.item.currency
      }
    });
  } catch (error: any) {
    console.error('Error creating Razorpay plan:', error);
    return NextResponse.json(
      { error: 'Failed to create subscription plan. Please try again.' },
      { status: 500 }
    );
  }
}