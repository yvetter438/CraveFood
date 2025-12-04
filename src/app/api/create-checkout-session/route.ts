import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
});

// Tier configuration (must match frontend)
const TIER_CONFIG = {
  micro: { price: 49, name: 'Micro' },
  starter: { price: 99, name: 'Starter' },
  growth: { price: 199, name: 'Growth' },
};

export async function POST(request: NextRequest) {
  try {
    const { bidData } = await request.json();
    
    const {
      restaurantName,
      contactName,
      email,
      phone,
      restaurantAddress,
      tier,
      tierName,
      tierPrice,
      videoFocus,
    } = bidData;

    // Validate tier
    const validTier = TIER_CONFIG[tier as keyof typeof TIER_CONFIG];
    if (!validTier || validTier.price !== tierPrice) {
      return NextResponse.json(
        { error: 'Invalid pricing tier' },
        { status: 400 }
      );
    }

    // Price is the tier price (platform fee is included, skimmed from the total)
    const amount = tierPrice * 100; // Convert to cents

    // Create a Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Crave Creator Bid - ${tierName}`,
              description: `${tierName} tier for ${restaurantName}`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${request.nextUrl.origin}/business/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/business?canceled=true`,
      metadata: {
        restaurantName,
        contactName,
        email,
        phone: phone || 'N/A',
        restaurantAddress,
        tier,
        tierName,
        tierPrice: tierPrice.toString(),
        videoFocus: Array.isArray(videoFocus) ? videoFocus.join(', ') : '',
      },
      customer_email: email,
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
