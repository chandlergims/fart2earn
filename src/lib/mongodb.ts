import mongoose from 'mongoose';

// Simplified MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://link:JkGebcKbho5TvUu6@cluster0.hxfim.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

// Global is used here to maintain a cached connection across hot reloads in development
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  // If connection exists, return it
  if (cached.conn) {
    return cached.conn;
  }

  // If no connection or promise exists, create a new one
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
      return mongoose;
    });
  }

  // Wait for connection to resolve
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('MongoDB connection error:', e);
    // Don't throw error, just return null to allow app to continue
    return null;
  }

  return cached.conn;
}

export default connectToDatabase;
