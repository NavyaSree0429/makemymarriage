import { io } from 'socket.io-client';

const SOCKET_SERVER_URL = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '/';

let socketInstance = null;

export function getSocket() {
  if (!socketInstance) {
    socketInstance = io(SOCKET_SERVER_URL, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    socketInstance.on('connect', () => {
      console.log(`[Socket.IO] Connected to server: ${socketInstance.id}`);
    });

    socketInstance.on('disconnect', (reason) => {
      console.log(`[Socket.IO] Disconnected: ${reason}`);
    });

    socketInstance.on('connect_error', (err) => {
      console.warn(`[Socket.IO] Connection error:`, err.message);
    });
  }

  return socketInstance;
}

export function joinWeddingRoom(weddingId) {
  const socket = getSocket();
  if (socket && weddingId) {
    socket.emit('join_wedding', weddingId);
  }
}

export function leaveWeddingRoom(weddingId) {
  const socket = getSocket();
  if (socket && weddingId) {
    socket.emit('leave_wedding', weddingId);
  }
}

export function disconnectSocket() {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
}
