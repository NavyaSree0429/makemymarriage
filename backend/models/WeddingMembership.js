const mongoose = require('mongoose');

const weddingMembershipSchema = new mongoose.Schema(
  {
    weddingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Wedding',
      required: [true, 'Wedding ID is required'],
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    role: {
      type: String,
      enum: ['OWNER', 'PARTNER', 'ORGANIZER'],
      required: true,
    },
    permissions: {
      canManageEvents: { type: Boolean, default: true },
      canManageGuests: { type: Boolean, default: true },
      canManageInvitations: { type: Boolean, default: true },
      canManageTasks: { type: Boolean, default: true },
      canManageVendors: { type: Boolean, default: true },
      canManageBudget: { type: Boolean, default: true },
      canManageGallery: { type: Boolean, default: true },
      canManageWebsite: { type: Boolean, default: true },
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure unique membership per user per wedding
weddingMembershipSchema.index({ weddingId: 1, userId: 1 }, { unique: true });

const WeddingMembership = mongoose.model('WeddingMembership', weddingMembershipSchema);

module.exports = WeddingMembership;
