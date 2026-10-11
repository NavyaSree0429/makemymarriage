const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    weddingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Wedding',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Notification title is required'],
      trim: true,
      maxlength: 120,
    },
    message: {
      type: String,
      required: [true, 'Notification message is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['RSVP', 'TASK', 'EVENT', 'VENDOR', 'PHOTO', 'ORGANIZER', 'SYSTEM'],
      default: 'SYSTEM',
    },
    priority: {
      type: String,
      enum: ['URGENT', 'HIGH', 'NORMAL', 'LOW'],
      default: 'NORMAL',
    },
    actionUrl: {
      type: String,
      default: '',
    },
    actionLabel: {
      type: String,
      default: '',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Notification', notificationSchema);
