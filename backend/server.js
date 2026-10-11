const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

io.on('connection', (socket) => {
  console.log(`[Socket.IO] Client connected: ${socket.id}`);
  
  // Join wedding workspace channel
  socket.on('join_wedding', (weddingId) => {
    if (weddingId) {
      socket.join(`wedding_${weddingId}`);
      console.log(`[Socket.IO] Client ${socket.id} joined room wedding_${weddingId}`);
      socket.emit('joined_room', { room: `wedding_${weddingId}`, status: 'CONNECTED' });
    }
  });

  // Leave wedding workspace channel
  socket.on('leave_wedding', (weddingId) => {
    if (weddingId) {
      socket.leave(`wedding_${weddingId}`);
      console.log(`[Socket.IO] Client ${socket.id} left room wedding_${weddingId}`);
    }
  });

  socket.on('disconnect', () => {
    console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
  });
});

// Attach Socket.IO instance to app for routes/controllers access
app.set('io', io);

// Start server immediately if not serverless
if (!process.env.VERCEL) {
  server.listen(PORT, () => {
    console.log(`[MakeMyMarriage API] Server listening on port ${PORT} (${process.env.NODE_ENV || 'development'} mode)`);
    connectDB();
  });
} else {
  connectDB();
}

module.exports = app;
