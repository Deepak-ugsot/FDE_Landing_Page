import mongoose from 'mongoose';

let memoryServer = null;

/**
 * Connect to MongoDB.
 * - If USE_MEMORY_DB=true, spins up an in-memory MongoDB (zero local setup).
 * - Otherwise connects to MONGO_URI (local MongoDB or MongoDB Atlas).
 */
export const connectDB = async () => {
  let uri = process.env.MONGO_URI;

  if (String(process.env.USE_MEMORY_DB).toLowerCase() === 'true') {
    // Imported lazily so it's only needed in dev.
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    memoryServer = await MongoMemoryServer.create();
    uri = memoryServer.getUri('fde_landing');
    console.log('🧪 Using in-memory MongoDB (USE_MEMORY_DB=true) — data resets on restart.');
  }

  if (!uri) {
    throw new Error('MONGO_URI is not set. Add it to your .env file (or set USE_MEMORY_DB=true).');
  }

  mongoose.set('strictQuery', true);
  const conn = await mongoose.connect(uri);
  console.log(`✅ MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
  return conn;
};

export const disconnectDB = async () => {
  await mongoose.connection.close();
  if (memoryServer) {
    await memoryServer.stop();
    memoryServer = null;
  }
};
