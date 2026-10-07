const mongoose = require('mongoose');

// Simple in-memory mock store for local development without DB binary
class MemoryDB {
  constructor() {
    this.collections = {};
  }
  getCollection(name) {
    if (!this.collections[name]) {
      this.collections[name] = [];
    }
    return this.collections[name];
  }
}

global.memoryDB = global.memoryDB || new MemoryDB();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 1500,
    });
    console.log(`[MongoDB] Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`[MongoDB Warning] Local Mongo connection failed (${error.message}). Enabling Memory Mode for dev API...`);
    // Prevent Mongoose buffering timeout errors when offline
    mongoose.set('bufferCommands', false);
    return null;
  }
};

module.exports = connectDB;
