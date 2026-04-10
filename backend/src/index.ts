import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { askAI } from './services/ai';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
  : ['*'];

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
  const { query, history = [] } = req.body;

  if (!query || !query.trim()) {
    return res.status(400).json({ error: 'La consulta no puede estar vacía.' });
  }

  try {
    const response = await askAI(query, history);
    res.json({ success: true, response });
  } catch (error: any) {
    console.error('AI Error:', error.message, error.status, error.code);
    res.status(500).json({ error: 'Error al procesar la consulta. Intenta de nuevo.' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});

export default app;