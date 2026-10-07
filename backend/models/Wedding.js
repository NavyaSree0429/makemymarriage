const mongoose = require('mongoose');

const weddingSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Wedding owner ID is required'],
      index: true,
    },
    partnerNames: {
      partner1: {
        type: String,
        required: [true, 'Partner 1 name is required'],
        trim: true,
      },
      partner2: {
        type: String,
        required: [true, 'Partner 2 name is required'],
        trim: true,
      },
    },
    slug: {
      type: String,
      required: [true, 'Wedding URL slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    weddingDate: {
      type: Date,
      required: [true, 'Wedding date is required'],
    },
    primaryLocation: {
      venueName: { type: String, trim: true, default: '' },
      city: { type: String, trim: true, default: '' },
      state: { type: String, trim: true, default: '' },
      address: { type: String, trim: true, default: '' },
      mapUrl: { type: String, trim: true, default: '' },
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    coverPhoto: {
      type: String,
      default: '',
    },
    theme: {
      type: String,
      enum: ['TRADITIONAL', 'MODERN', 'FLORAL', 'ROYAL', 'MINIMAL'],
      default: 'ROYAL',
    },
    status: {
      type: String,
      enum: ['PLANNING', 'ACTIVE', 'COMPLETED', 'ARCHIVED'],
      default: 'PLANNING',
    },
    partnerInviteCode: {
      type: String,
      default: null,
      select: false,
    },
    partnerInviteExpires: {
      type: Date,
      default: null,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate title helper
weddingSchema.virtual('title').get(function () {
  return `${this.partnerNames?.partner1 || 'Partner 1'} & ${this.partnerNames?.partner2 || 'Partner 2'}'s Wedding`;
});

weddingSchema.set('toJSON', { virtuals: true });
weddingSchema.set('toObject', { virtuals: true });

const Wedding = mongoose.model('Wedding', weddingSchema);

module.exports = Wedding;
