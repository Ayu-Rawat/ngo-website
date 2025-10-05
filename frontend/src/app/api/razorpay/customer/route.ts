import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import sql from '@/database/db';
import { getCurrentSession } from '@/lib/session';

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// GET - Get customer ID for authenticated user
export async function GET(request: NextRequest) {
  try {
    const { user } = await getCurrentSession();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check our database first for existing customer ID
    const dbCustomers = await sql`
      SELECT DISTINCT razorpay_customer_id, subscriber_email, subscriber_name
      FROM user_subscriptions 
      WHERE user_id = ${user.id}
      AND subscriber_email = ${user.email}
      LIMIT 1
    `;

    if (dbCustomers.length > 0) {
      return NextResponse.json({
        success: true,
        customer_id: dbCustomers[0].razorpay_customer_id,
        found_in_database: true
      });
    }

    // If not found in database, user doesn't have a customer ID yet
    return NextResponse.json({
      success: true,
      customer_id: null,
      found_in_database: false,
      message: 'No existing customer found for this user'
    });

  } catch (error: any) {
    console.error('Error fetching customer:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customer', details: error.message },
      { status: 500 }
    );
  }
}

// POST - Sync customer data from Razorpay to our database
export async function POST(request: NextRequest) {
  try {
    const { user } = await getCurrentSession();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { customer_id, email } = await request.json();

    if (!customer_id && !email) {
      return NextResponse.json(
        { error: 'Customer ID or email is required' },
        { status: 400 }
      );
    }

    let customer;
    
    if (customer_id) {
      // Fetch specific customer by ID
      customer = await razorpay.customers.fetch(customer_id);
    } else {
      // Search by email in all customers
      const customersResponse = await razorpay.customers.all({ count: 100 });
      const customers = (customersResponse as any).items || [];
      customer = customers.find((c: any) => c.email === email);
    }

    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found in Razorpay' },
        { status: 404 }
      );
    }

    // Get customer's subscriptions from Razorpay
    const subscriptionsResponse = await razorpay.subscriptions.all({
      count: 100 // Get all subscriptions and filter by customer_id
    });

    const allSubscriptions = (subscriptionsResponse as any).items || [];
    const customerSubscriptions = allSubscriptions.filter((sub: any) => 
      sub.customer_id === customer.id
    );

    // Sync subscriptions to our database
    const syncResults = [];
    
    for (const subscription of customerSubscriptions) {
      try {
        // Check if subscription already exists in our database
        const existing = await sql`
          SELECT id FROM user_subscriptions 
          WHERE razorpay_subscription_id = ${subscription.id}
          LIMIT 1
        `;

        if (existing.length === 0) {
          // Insert new subscription
          await sql`
            INSERT INTO user_subscriptions (
              user_id,
              razorpay_subscription_id,
              razorpay_plan_id,
              razorpay_customer_id,
              amount,
              subscriber_name,
              subscriber_email,
              status,
              current_start,
              current_end,
              charge_at,
              total_count,
              paid_count,
              remaining_count,
              created_at
            ) VALUES (
              ${user.id},
              ${subscription.id},
              ${(subscription as any).plan_id},
              ${subscription.customer_id},
              ${(subscription as any).plan?.item?.amount || 0},
              ${customer.name},
              ${customer.email},
              ${(subscription as any).status},
              ${(subscription as any).current_start},
              ${(subscription as any).current_end},
              ${(subscription as any).charge_at},
              ${(subscription as any).total_count},
              ${(subscription as any).paid_count},
              ${(subscription as any).remaining_count},
              NOW()
            )
          `;
          syncResults.push({ subscription_id: subscription.id, action: 'inserted' });
        } else {
          // Update existing subscription
          await sql`
            UPDATE user_subscriptions 
            SET 
              status = ${(subscription as any).status},
              current_start = ${(subscription as any).current_start},
              current_end = ${(subscription as any).current_end},
              charge_at = ${(subscription as any).charge_at},
              paid_count = ${(subscription as any).paid_count},
              remaining_count = ${(subscription as any).remaining_count},
              updated_at = NOW()
            WHERE razorpay_subscription_id = ${subscription.id}
          `;
          syncResults.push({ subscription_id: subscription.id, action: 'updated' });
        }
      } catch (syncError) {
        console.error(`Error syncing subscription ${subscription.id}:`, syncError);
        syncResults.push({ subscription_id: subscription.id, action: 'error', error: (syncError as any).message });
      }
    }

    return NextResponse.json({
      success: true,
      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        contact: customer.contact
      },
      subscriptions_synced: syncResults.length,
      sync_details: syncResults
    });

  } catch (error: any) {
    console.error('Error syncing customer data:', error);
    return NextResponse.json(
      { error: 'Failed to sync customer data', details: error.message },
      { status: 500 }
    );
  }
}