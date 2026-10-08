const mongoose = require('mongoose');
const crypto = require('crypto');

const guestSchema = new mongoose.Schema(
  {
    weddingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Wedding',
      required: true,
      index: true,
    },
    fullName: {
      type: String,
      required: [true, 'Guest name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: String,
      enum: ['BRIDE_FAMILY', 'GROOM_FAMILY', 'FRIENDS', 'VIP', 'PLANNERS', 'GENERAL'],
      default: 'GENERAL',
    },
    invitedEvents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
      },
    ],
    allocatedAttendees: {
      type: Number,
      default: 1,
      min: [1, 'At least 1 attendee must be allocated'],
    },
    dietaryPreference: {
      type: String,
      enum: ['VEG', 'NON_VEG', 'VEGAN', 'JAIN', 'EGGITARIAN', 'NO_PREFERENCE'],
      default: 'VEG',
    },
    rsvpStatus: {
      type: String,
      enum: ['PENDING', 'CONFIRMED', 'DECLINED'],
      default: 'PENDING',
    },
    invitationToken: {
      type: String,
      unique: true,
      index: true,
    },
    notes: {
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

// Auto-generate invitationToken before validation if not present
guestSchema.pre('validate', function (next) {
  if (!this.invitationToken) {
    this.invitationToken = crypto.randomBytes(8).toString('hex');
  }
  next();
});

module.exports = mongoose.model('Guest', guestSchema);
