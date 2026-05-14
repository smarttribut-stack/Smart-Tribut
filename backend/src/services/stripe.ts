import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-04-30.basil',
});

export const PRICE_IDS = {
  pro: 'price_1TWlL3LUyNJt8tjDII5krKDR',
  business: 'price_1TWlMTLUyNJt8tjDUakfFcOT',
  enterprise: 'price_1TWlNeLUyNJt8tjDOzGeVsis',
};

export async function createCheckoutSession(
  plan: 'pro' | 'business' | 'enterprise',
  successUrl: string,
  cancelUrl: string,
  customerEmail?: string
) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price: PRICE_IDS[plan],
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: successUrl,
    cancel_url: cancelUrl,
    customer_email: customerEmail,
    metadata: { plan },
  });

  return session;
}

export async function constructWebhookEvent(payload: Buffer, signature: string) {
  return stripe.webhooks.constructEvent(
    payload,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET || ''
  );
}
