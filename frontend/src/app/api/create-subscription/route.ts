import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import sql from '@/database/db';
import { getCurrentSession } from '@/lib/session';

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: NextRequest) {
  try {
    // Get current user session
    const { user } = await getCurrentSession();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { 
      planId, 
      customerEmail, 
      customerName, 
      customerPhone,
      amount, // Add amount from the plan
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

    // Check if user already has a customer ID in our database
    let customer: any;
    let customerId: string | null = null;
    
    // First check our database for existing customer ID
    const existingCustomer = await sql`
      SELECT DISTINCT razorpay_customer_id
      FROM user_subscriptions 
      WHERE user_id = ${user.id}
      AND subscriber_email = ${customerEmail}
      LIMIT 1
    `;

    if (existingCustomer.length > 0) {
      customerId = existingCustomer[0].razorpay_customer_id;
      console.log('Found existing customer ID in database:', customerId);
      
      if (customerId) {
        try {
          // Verify customer still exists in Razorpay
          customer = await razorpay.customers.fetch(customerId);
          
          // Check for any failed/created subscriptions that need cleanup
          const existingSubscriptionsResponse = await razorpay.subscriptions.all({ count: 100 });
          const allSubscriptions = (existingSubscriptionsResponse as any).items || [];
          const customerSubscriptions = allSubscriptions.filter((sub: any) => 
            sub.customer_id === customerId
          );

          // Cancel any failed/created subscriptions that are blocking new ones
          for (const existingSub of customerSubscriptions) {
            const subStatus = (existingSub as any).status;
            if (subStatus === 'created' || subStatus === 'halted') {
              try {
                console.log(`Cancelling failed subscription: ${existingSub.id}`);
                await razorpay.subscriptions.cancel(existingSub.id, false);
                
                // Also remove from our database if it exists
                await sql`
                  DELETE FROM user_subscriptions 
                  WHERE razorpay_subscription_id = ${existingSub.id}
                `;
              } catch (cancelError) {
                console.log('Error cancelling subscription:', cancelError);
                // Continue anyway
              }
            }
          }
        } catch (fetchError) {
          console.log('Customer not found in Razorpay, will create new one');
          customerId = null;
        }
      }
    }

    // Create new customer if we don't have one
    if (!customerId) {
      customer = await razorpay.customers.create({
        name: customerName,
        email: customerEmail,
        contact: customerPhone || '',
        notes: {
          purpose: 'Monthly Donation Subscriber',
          ngo: 'Connect I Network'
        }
      });
      customerId = customer.id;
      console.log('Created new customer:', customerId);
    }

    // Create subscription with flexible timing options
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const subscriptionOptions: any = {
      plan_id: planId,
      customer_id: customerId,
      total_count: totalCount,
      quantity: 1,
      expire_by: currentTimestamp + (60 * 60 * 24 * 365 * 10), // 10 years from now
      notes: {
        subscriber_name: customerName,
        subscriber_email: customerEmail,
        purpose: 'Monthly Recurring Donation',
        ngo_name: 'Connect I Network'
      }
    };

    // Only add start_at if we want to delay the subscription
    // Leave it undefined for immediate activation
    // subscriptionOptions.start_at = currentTimestamp + (5 * 60); // 5 minutes from now if needed

    // Try creating subscription with retry logic for timing issues
    let subscription;
    let attempt = 0;
    const maxAttempts = 3;

    while (attempt < maxAttempts) {
      try {
        attempt++;
        
        if (attempt === 1) {
          // First attempt: No start_at (immediate)
          subscription = await razorpay.subscriptions.create(subscriptionOptions);
          break;
        } else if (attempt === 2) {
          // Second attempt: Start 5 minutes from now
          subscriptionOptions.start_at = Math.floor(Date.now() / 1000) + (5 * 60);
          subscription = await razorpay.subscriptions.create(subscriptionOptions);
          break;
        } else {
          // Third attempt: Start 10 minutes from now
          subscriptionOptions.start_at = Math.floor(Date.now() / 1000) + (10 * 60);
          subscription = await razorpay.subscriptions.create(subscriptionOptions);
          break;
        }
      } catch (retryError: any) {
        if (attempt === maxAttempts) {
          throw retryError; // Re-throw the error if all attempts failed
        }
        
        if (retryError.message && retryError.message.includes('start time is past')) {
          console.log(`Attempt ${attempt} failed due to timing, retrying...`);
          continue;
        } else {
          throw retryError; // Re-throw if it's not a timing error
        }
      }
    }

    // Ensure subscription was created successfully
    if (!subscription) {
      throw new Error('Failed to create subscription after multiple attempts');
    }

    // Save subscription to database
    await sql`
      INSERT INTO user_subscriptions (
        user_id,
        razorpay_subscription_id,
        razorpay_plan_id,
        razorpay_customer_id,
        amount,
        subscriber_name,
        subscriber_email,
        subscriber_phone,
        status,
        current_start,
        current_end,
        charge_at,
        total_count,
        remaining_count,
        short_url
      ) VALUES (
        ${user?.id || null},
        ${subscription.id},
        ${subscription.plan_id},
        ${subscription.customer_id},
        ${amount ? amount * 100 : 0},
        ${customerName},
        ${customerEmail},
        ${customerPhone || null},
        ${subscription.status},
        ${subscription.current_start},
        ${subscription.current_end},
        ${subscription.charge_at},
        ${totalCount},
        ${totalCount},
        ${subscription.short_url}
      )
    `;

    console.log('Subscription created and saved:', {
      subscription_id: subscription.id,
      user_id: user?.id || null,
      customer: customerName,
      email: customerEmail
    });

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
    
    // Handle specific Razorpay errors
    let errorMessage = 'Failed to create subscription. Please try again.';
    
    if (error.message && error.message.includes('start time is past')) {
      errorMessage = 'Subscription timing error. Please try again in a moment.';
    } else if (error.message && error.message.includes('auth transaction')) {
      errorMessage = 'Authentication issue with subscription. Please try again.';
    } else if (error.message && error.message.includes('customer')) {
      errorMessage = 'Customer already exists. Try using the "Fix Subscription Issues" button below the form.';
    } else if (error.message && error.message.includes('subscription already exists')) {
      errorMessage = 'You already have a subscription. Try using the "Fix Subscription Issues" button below the form.';
    } else if (error.statusCode === 400) {
      errorMessage = 'Invalid subscription parameters. Please check your details or try the cleanup option.';
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: error.message,
        suggestion: error.message && (error.message.includes('customer') || error.message.includes('subscription')) 
          ? 'Use the "Fix Subscription Issues" button in the form to cleanup any previous failed attempts.'
          : null
      },
      { status: 500 }
    );
  }
}