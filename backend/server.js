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
  
  socket.on('disconnect', () => {
    console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
  });
});

// Attach Socket.IO instance to app for routes/controllers access
app.set('io', io);

// Start server immediately
server.listen(PORT, () => {
  console.log(`[MakeMyMarriage API] Server listening on port ${PORT} (${process.env.NODE_ENV || 'development'} mode)`);
  // Connect to DB asynchronously
  connectDB();
});
