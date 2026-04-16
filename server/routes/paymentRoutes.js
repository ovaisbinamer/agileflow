// File: server/routes/paymentRoutes.js
import express from 'express';
import Stripe from 'stripe';
import protect from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * POST /api/payments/create-checkout
 * Creates a Stripe Checkout session and returns the redirect URL.
 */
router.post('/create-checkout', protect, async (req, res) => {
  try {
    if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_PRO_PRICE_ID) {
      return res.status(503).json({ message: 'Payments not configured yet' });
    }

    const user = await User.findById(req.user._id);
    if (user.plan === 'pro') {
      return res.status(400).json({ message: 'You are already on the Pro plan' });
    }

    // Get or create Stripe customer
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: { userId: user._id.toString() },
      });
      customerId = customer.id;
      await User.findByIdAndUpdate(user._id, { stripeCustomerId: customerId });
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: process.env.STRIPE_PRO_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/#pricing`,
      metadata: { userId: user._id.toString() },
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('[Stripe] Checkout error:', error.message);
    res.status(500).json({ message: 'Failed to create checkout session' });
  }
});

/**
 * POST /api/payments/webhook
 * Stripe sends events here. Upgrades user plan on successful payment.
 * Note: body must be raw (configured in server.js before express.json())
 */
router.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('[Stripe Webhook] Signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.metadata?.userId;
    if (userId) {
      await User.findByIdAndUpdate(userId, { plan: 'pro' });
      console.log(`[Stripe] User ${userId} upgraded to Pro`);
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object;
    const customer = await stripe.customers.retrieve(sub.customer);
    const userId = customer.metadata?.userId;
    if (userId) {
      await User.findByIdAndUpdate(userId, { plan: 'free' });
      console.log(`[Stripe] User ${userId} downgraded to Free`);
    }
  }

  res.json({ received: true });
});

/**
 * GET /api/payments/status
 * Returns current user's plan.
 */
router.get('/status', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('plan');
    res.json({ plan: user.plan });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
