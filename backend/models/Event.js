const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    weddingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Wedding',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    eventType: {
      type: String,
      enum: ['HALDI', 'MEHENDI', 'SANGEET', 'WEDDING', 'RECEPTION', 'COCKTAIL', 'CUSTOM'],
      default: 'CUSTOM',
    },
    date: {
      type: Date,
      required: [true, 'Event date is required'],
    },
    startTime: {
      type: String,
      trim: true,
      default: '10:00 AM',
    },
    endTime: {
      type: String,
      trim: true,
      default: '02:00 PM',
    },
    location: {
      venueName: { type: String, trim: true, default: '' },
      address: { type: String, trim: true, default: '' },
      city: { type: String, trim: true, default: '' },
      googleMapsUrl: { type: String, trim: true, default: '' },
    },
    dressCode: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    liveStreamUrl: {
      type: String,
      trim: true,
      default: '',
    },
    createdByUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Virtual to check if live stream is configured
eventSchema.virtual('isLiveStreamAvailable').get(function () {
  return Boolean(this.liveStreamUrl && this.liveStreamUrl.length > 5);
});

eventSchema.set('toJSON', { virtuals: true });
eventSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Event', eventSchema);
