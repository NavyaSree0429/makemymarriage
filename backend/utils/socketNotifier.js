const mongoose = require('mongoose');
const Notification = require('../models/Notification');

// Dev Memory store for notifications
if (!global.memoryNotifications) {
  global.memoryNotifications = [];
}

/**
 * Dispatches a real-time event to the wedding workspace room and creates a notification record
 */
async function dispatchWeddingNotification(req, {
  weddingId,
  title,
  message,
  category = 'SYSTEM',
  priority = 'NORMAL',
  actionUrl = '',
  actionLabel = '',
  metadata = {}
}) {
  try {
    let savedNotification = null;

    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(weddingId)) {
      savedNotification = await Notification.create({
        weddingId,
        title,
        message,
        category,
        priority,
        actionUrl,
        actionLabel,
        isRead: false,
        metadata
      });
    } else {
      savedNotification = {
        _id: `notif_mem_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        weddingId: String(weddingId),
        title,
        message,
        category,
        priority,
        actionUrl,
        actionLabel,
        isRead: false,
        metadata,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      global.memoryNotifications.unshift(savedNotification);
    }

    // Access Socket.IO instance attached to Express app
    const io = req?.app?.get('io');
    if (io) {
      const roomName = `wedding_${weddingId}`;
      io.to(roomName).emit('notification_received', savedNotification);
      io.to(roomName).emit('live_toast', {
        id: savedNotification._id,
        title,
        message,
        category,
        timestamp: new Date().toISOString()
      });
      console.log(`[Socket.IO] Dispatched notification to ${roomName}: "${title}"`);
    }

    return savedNotification;
  } catch (error) {
    console.error('Error dispatching wedding notification:', error.message);
    return null;
  }
}

module.exports = {
  dispatchWeddingNotification
};
