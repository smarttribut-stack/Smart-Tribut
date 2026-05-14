import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { askAI } from './services/ai';
import { createCheckoutSession, constructWebhookEvent } from './services/stripe';

const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'https://smart-tribut-frontend.vercel.app';

// Middleware
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
  : ['*'];

// Webhook needs raw body — must be before express.json()
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'] as string;
  try {
    const event = await constructWebhookEvent(req.body, sig);
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any;
      console.log('Payment completed:', session.customer_email, session.metadata?.plan);
      // TODO: update user plan in database
    }
    res.json({ received: true });
  } catch (err: any) {
    console.error('Webhook error:', err.message);
    res.status(400).json({ error: err.message });
  }
});

app.use(cors({
  origin: allowedOrigins.includes('*') ? '*' : allowedOrigins,
  credentials: true,
}));
app.use(express.json());

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// AI query endpoint
app.post('/api/query', async (req, res) => {
  const { query, history = [], plan = 'free' } = req.body;

  if (!query || !query.trim()) {
    return res.status(400).json({ error: 'La consulta no puede estar vacía.' });
  }

  try {
    const response = await askAI(query, history, plan);
    res.json({ success: true, response });
  } catch (error: any) {
    console.error('AI Error:', error.message, error.status, error.code);
    res.status(500).json({ error: 'Error al procesar la consulta. Intenta de nuevo.' });
  }
});

// Stripe checkout endpoint
app.post('/api/stripe/checkout', async (req, res) => {
  const { plan, email } = req.body;

  if (!plan || !['pro', 'business', 'enterprise'].includes(plan)) {
    return res.status(400).json({ error: 'Plan inválido.' });
  }

  try {
    const session = await createCheckoutSession(
      plan,
      `${FRONTEND_URL}?payment=success&plan=${plan}`,
      `${FRONTEND_URL}?payment=cancelled`,
      email
    );
    res.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe Error:', error.message);
    res.status(500).json({ error: 'Error al crear la sesión de pago.' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});

export default app;