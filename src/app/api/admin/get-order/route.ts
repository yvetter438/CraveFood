import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-11-17.clover',
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');
    const listAll = searchParams.get('list_all');

    // If list_all is requested, return all recent sessions
    if (listAll === 'true') {
      const sessions = await stripe.checkout.sessions.list({
        limit: 100, // Get last 100 sessions
      });

      const ordersWithMetadata = sessions.data
        .filter(session => session.payment_status === 'paid') // Only paid orders
        .map(session => ({
          id: session.id,
          status: session.status,
          payment_status: session.payment_status,
          amount_total: session.amount_total,
          currency: session.currency,
          customer_email: session.customer_email,
          payment_intent: session.payment_intent,
          created: session.created,
          metadata: session.metadata,
        }));

      return NextResponse.json({ orders: ordersWithMetadata });
    }

    // Single session lookup
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Fetch the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Return the session data
    return NextResponse.json({
      id: session.id,
      status: session.status,
      payment_status: session.payment_status,
      amount_total: session.amount_total,
      currency: session.currency,
      customer_email: session.customer_email,
      payment_intent: session.payment_intent,
      created: session.created,
      metadata: session.metadata,
    });
  } catch (error: any) {
    console.error('Error fetching order:', error);
    
    if (error.type === 'StripeInvalidRequestError') {
      return NextResponse.json(
        { error: 'Invalid session ID or session not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

