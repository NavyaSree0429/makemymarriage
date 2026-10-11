const mongoose = require('mongoose');
const Notification = require('../models/Notification');
const { sendSuccess, sendError } = require('../utils/apiResponse');
const { dispatchWeddingNotification } = require('../utils/socketNotifier');

if (!global.memoryNotifications) {
  global.memoryNotifications = [];
}

const getDefaultSeedNotifications = (weddingId) => [
  {
    weddingId,
    title: 'New RSVP Received! 🎉',
    message: 'Dr. Sameer & Sunita Roy submitted attendance for Royal Pheras and Lake Reception (+2 Guests, Jain Dietary).',
    category: 'RSVP',
    priority: 'HIGH',
    actionUrl: '#guests-section',
    actionLabel: 'View Guest Details',
    isRead: false,
    createdAt: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
  },
  {
    weddingId,
    title: 'Milestone Escrow Due 💳',
    message: 'Sabyasachi Haute Couture Atelier advance disbursement of ₹1,20,000 due in 48 hours (Tranche 2 Trial Lehenga).',
    category: 'VENDOR',
    priority: 'URGENT',
    actionUrl: '#budget-section',
    actionLabel: 'Disburse via Escrow',
    isRead: false,
    createdAt: new Date(Date.now() - 22 * 60 * 1000).toISOString(),
  },
  {
    weddingId,
    title: 'Ceremony Reminder ⏳',
    message: 'Royal Sangeet & Musical Night starts in 3 hours at Crystal Ballroom. Geofenced aerial path cleared for night fireworks.',
    category: 'EVENT',
    priority: 'NORMAL',
    actionUrl: '#events-section',
    actionLabel: 'View Timeline',
    isRead: false,
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  },
  {
    weddingId,
    title: 'Task Completed ✅',
    message: 'Anita Verma finalized Floating Mandap Floral Canopy order (Ferns & Petals Haute Florals, 1,200 Dutch Hydrangeas).',
    category: 'TASK',
    priority: 'NORMAL',
    actionUrl: '#tasks-section',
    actionLabel: 'View Checklist',
    isRead: true,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    weddingId,
    title: 'New Photo Memory Uploaded 📸',
    message: 'Joseph Radhik synchronized 24 high-resolution RAW frames from Haldi Ceremony into the Private VIP Vault.',
    category: 'PHOTO',
    priority: 'NORMAL',
    actionUrl: '#photos-section',
    actionLabel: 'Open Gallery Vault',
    isRead: true,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  },
];

/**
 * Get all notifications for a wedding workspace
 * GET /api/v1/weddings/:id/notifications
 */
const getNotifications = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { category, isRead } = req.query;

    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
      const filter = { weddingId: id };
      if (category && category !== 'ALL') {
        filter.category = category;
      }
      if (isRead !== undefined) {
        filter.isRead = isRead === 'true';
      }

      let notifications = await Notification.find(filter).sort({ createdAt: -1 });

      // Auto-seed if database has 0 notifications for this wedding
      if (notifications.length === 0 && (!category || category === 'ALL')) {
        try {
          const seeds = getDefaultSeedNotifications(id);
          notifications = await Notification.insertMany(seeds);
        } catch (seedErr) {
          console.warn('Notification auto-seed warning:', seedErr.message);
        }
      }

      const unreadCount = await Notification.countDocuments({ weddingId: id, isRead: false });

      return sendSuccess(res, 200, 'Notifications retrieved successfully', {
        notifications,
        unreadCount,
      });
    }

    // Dev Memory Fallback
    let memList = global.memoryNotifications.filter((n) => String(n.weddingId) === String(id));

    if (memList.length === 0 && (!category || category === 'ALL')) {
      const seeds = getDefaultSeedNotifications(id).map((item, idx) => ({
        _id: `notif_seed_${idx + 1}_${id}`,
        ...item,
      }));
      global.memoryNotifications.push(...seeds);
      memList = seeds;
    }

    if (category && category !== 'ALL') {
      memList = memList.filter((n) => n.category === category);
    }
    if (isRead !== undefined) {
      memList = memList.filter((n) => n.isRead === (isRead === 'true'));
    }

    const unreadCount = global.memoryNotifications.filter(
      (n) => String(n.weddingId) === String(id) && !n.isRead
    ).length;

    return sendSuccess(res, 200, 'Notifications retrieved (Dev Memory Mode)', {
      notifications: memList,
      unreadCount,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Mark notifications as read
 * PUT /api/v1/weddings/:id/notifications/mark-read
 */
const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { notificationId } = req.body; // if omitted, marks ALL as read

    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
      if (notificationId) {
        await Notification.findByIdAndUpdate(notificationId, { isRead: true });
      } else {
        await Notification.updateMany({ weddingId: id, isRead: false }, { isRead: true });
      }

      const unreadCount = await Notification.countDocuments({ weddingId: id, isRead: false });
      return sendSuccess(res, 200, 'Notifications marked as read', { unreadCount });
    }

    // Dev Memory Fallback
    global.memoryNotifications.forEach((n) => {
      if (String(n.weddingId) === String(id)) {
        if (!notificationId || String(n._id) === String(notificationId)) {
          n.isRead = true;
        }
      }
    });

    const unreadCount = global.memoryNotifications.filter(
      (n) => String(n.weddingId) === String(id) && !n.isRead
    ).length;

    return sendSuccess(res, 200, 'Notifications marked as read (Dev Memory Mode)', { unreadCount });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a single notification
 * DELETE /api/v1/weddings/:id/notifications/:notificationId
 */
const deleteNotification = async (req, res, next) => {
  try {
    const { id, notificationId } = req.params;

    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(notificationId)) {
      await Notification.findByIdAndDelete(notificationId);
      const unreadCount = await Notification.countDocuments({ weddingId: id, isRead: false });
      return sendSuccess(res, 200, 'Notification removed', { unreadCount });
    }

    global.memoryNotifications = global.memoryNotifications.filter(
      (n) => String(n._id) !== String(notificationId)
    );

    const unreadCount = global.memoryNotifications.filter(
      (n) => String(n.weddingId) === String(id) && !n.isRead
    ).length;

    return sendSuccess(res, 200, 'Notification removed (Dev Memory Mode)', { unreadCount });
  } catch (error) {
    next(error);
  }
};

/**
 * Clear all notifications for wedding
 * DELETE /api/v1/weddings/:id/notifications
 */
const clearAllNotifications = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (mongoose.connection.readyState === 1 && mongoose.Types.ObjectId.isValid(id)) {
      await Notification.deleteMany({ weddingId: id });
      return sendSuccess(res, 200, 'All notifications cleared', { unreadCount: 0 });
    }

    global.memoryNotifications = global.memoryNotifications.filter(
      (n) => String(n.weddingId) !== String(id)
    );

    return sendSuccess(res, 200, 'All notifications cleared (Dev Memory Mode)', { unreadCount: 0 });
  } catch (error) {
    next(error);
  }
};

/**
 * Send a Live Real-Time Test Notification via Socket.IO
 * POST /api/v1/weddings/:id/notifications/test
 */
const sendTestNotification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      title = 'Live Concierge Alert ⚡',
      message = 'Real-time test ping dispatched over WebSocket room channel.',
      category = 'SYSTEM',
      priority = 'HIGH',
      actionUrl = '#overview',
      actionLabel = 'Acknowledge',
    } = req.body || {};

    const notification = await dispatchWeddingNotification(req, {
      weddingId: id,
      title,
      message,
      category,
      priority,
      actionUrl,
      actionLabel,
      metadata: { source: 'USER_TEST_TRIGGER' },
    });

    return sendSuccess(res, 201, 'Live test notification dispatched via Socket.IO', notification);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  deleteNotification,
  clearAllNotifications,
  sendTestNotification,
};
