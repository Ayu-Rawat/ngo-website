import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import sql from '@/database/db';
import { getCurrentSession } from '@/lib/session';

export async function POST(request: NextRequest) {
  try {
    // Get current user session
    const { user } = await getCurrentSession();
    
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount,
      donorDetails,
      payment_method,
    } = await request.json();

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing required payment parameters' },
        { status: 400 }
      );
    }

    // Create the signature string
    const body = razorpay_order_id + '|' + razorpay_payment_id;

    // Generate expected signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest('hex');

    // Verify signature
    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      console.log('Payment verified successfully:', {
        order_id: razorpay_order_id,
        payment_id: razorpay_payment_id,
        donor: donorDetails,
        user_id: user?.id || null,
        timestamp: new Date().toISOString(),
      });

      // Save to user_donations table (new structure)
      await sql`
        INSERT INTO user_donations (
          user_id, 
          razorpay_order_id, 
          razorpay_payment_id, 
          amount, 
          donor_name, 
          donor_email, 
          donor_phone,
          payment_method,
          status
        ) VALUES (
          ${user?.id || null},
          ${razorpay_order_id},
          ${razorpay_payment_id},
          ${amount * 100},
          ${donorDetails.name},
          ${user?.email || donorDetails.email || 'unknown@example.com'},
          ${donorDetails.phone || null},
          ${payment_method || 'unknown'},
          'completed'
        )
      `;

      // Also save to legacy transactions table for backward compatibility
      await sql`
        INSERT INTO transactions VALUES (
          ${razorpay_order_id},
          ${razorpay_payment_id},
          ${donorDetails.name},
          ${user?.email || donorDetails.email || 'unknown@example.com'},
          ${new Date().toISOString()},
          ${amount},
          ${user?.id || null}
        )
      `;

      return NextResponse.json({
        success: true,
        message: 'Payment verified successfully',
        payment_id: razorpay_payment_id,
        order_id: razorpay_order_id,
      });
    } else {
      console.error('Payment verification failed:', {
        expected: expectedSignature,
        received: razorpay_signature,
      });

      return NextResponse.json(
        { 
          success: false, 
          error: 'Payment verification failed' 
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Payment verification failed. Please contact support.' 
      },
      { status: 500 }
    );
  }
}