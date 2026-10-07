import 'dotenv/config';
import app from './src/app.js';
import { connectDB, disconnectDB } from './src/config/db.js';
import { isMockMode } from './src/utils/razorpay.js';

const PORT = process.env.PORT || 5001;

const start = async () => {
  try {
    await connectDB();
    const server = app.listen(PORT, () => {
      const mode = process.env.NODE_ENV || 'development';
      console.log(`🚀 Backend running in ${mode} mode on http://localhost:${PORT}`);
      if (isMockMode()) {
        console.log('🧪 MOCK payment mode — set RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET in .env for real checkout.');
      } else {
        console.log('💳 Razorpay LIVE/TEST keys detected — real checkout enabled.');
      }
    });

    const shutdown = async (signal) => {
      console.log(`\n${signal} received. Shutting down gracefully...`);
      server.close(async () => {
        await disconnectDB();
        process.exit(0);
      });
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (err) {
    console.error('❌ Failed to start server:', err.message);
    process.exit(1);
  }
};

start();
