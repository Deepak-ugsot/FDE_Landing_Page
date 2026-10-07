import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

const app = express();

// --- Security & parsing middleware ---
app.use(helmet());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// --- CORS (allow the configured frontend origins) ---
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:3000')
  .split(',')
  .map((o) => o.trim());

const isProduction = process.env.NODE_ENV === 'production';
// In dev, Next.js may pick any free port (3000, 3001, …), so allow any localhost origin.
const localhostRegex = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser clients (curl, Postman) which send no origin.
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      if (!isProduction && localhostRegex.test(origin)) return callback(null, true);
      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
  })
);

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// --- Rate limit authentication endpoints ---
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many attempts. Please try again later.' },
});

// --- Health check ---
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'fde-landing-backend', time: new Date().toISOString() });
});

// --- Routes ---
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payments', paymentRoutes);

// --- 404 + error handling ---
app.use(notFound);
app.use(errorHandler);

export default app;
