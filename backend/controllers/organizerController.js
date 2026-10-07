const mongoose = require('mongoose');
const User = require('../models/User');
const Wedding = require('../models/Wedding');
const WeddingMembership = require('../models/WeddingMembership');
const { sendSuccess, sendError } = require('../utils/apiResponse');

const isDBConnected = () => mongoose.connection && mongoose.connection.readyState === 1;

// Memory Fallback Store
const getMemoryMemberships = () => {
  if (!global.memoryMemberships) global.memoryMemberships = [];
  return global.memoryMemberships;
};
const getMemoryUsers = () => {
  if (!global.memoryUsers) global.memoryUsers = [];
  return global.memoryUsers;
};

/**
 * Invite Organizer to Wedding Workspace
 * POST /api/v1/weddings/:id/invite-organizer
 */
const inviteOrganizer = async (req, res, next) => {
  try {
    const { id } = req.params; // weddingId
    const { email, fullName, permissions } = req.body;
    const currentUserId = req.user._id || req.user.id;
    const cleanEmail = email.toLowerCase();

    const defaultPermissions = {
      canManageEvents: true,
      canManageGuests: true,
      canManageInvitations: true,
      canManageTasks: true,
      canManageVendors: true,
      canManageBudget: false,
      canManageGallery: false,
      canManageWebsite: true,
      ...permissions,
    };

    if (isDBConnected()) {
      // Ensure requester is OWNER or PARTNER
      const requesterMembership = await WeddingMembership.findOne({
        weddingId: id,
        userId: currentUserId,
        role: { $in: ['OWNER', 'PARTNER'] },
      });

      if (!requesterMembership) {
        return sendError(res, 403, 'Only Wedding Owners or Partners can invite organizers.', 'FORBIDDEN');
      }

      // Find or create organizer user
      let targetUser = await User.findOne({ email: cleanEmail });
      if (!targetUser) {
        targetUser = await User.create({
          fullName: fullName || email.split('@')[0],
          email: cleanEmail,
          password: 'TemporaryPassword123!', // Auto-generated for V1 dev invite
          isEmailVerified: true,
        });
      }

      // Check if membership already exists
      let membership = await WeddingMembership.findOne({ weddingId: id, userId: targetUser._id });
      if (membership) {
        return sendError(res, 409, 'This user is already a member of this wedding workspace.', 'ALREADY_MEMBER');
      }

      membership = await WeddingMembership.create({
        weddingId: id,
        userId: targetUser._id,
        role: 'ORGANIZER',
        permissions: defaultPermissions,
      });

      return sendSuccess(res, 201, 'Organizer invited successfully', {
        organizer: targetUser.toSafeObject(),
        membership,
      });
    } else {
      // Memory Fallback
      const users = getMemoryUsers();
      let targetUser = users.find(u => u.email === cleanEmail);

      if (!targetUser) {
        targetUser = {
          _id: `mem_user_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
          fullName: fullName || email.split('@')[0],
          email: cleanEmail,
          phone: '',
          profilePicture: '',
          isEmailVerified: true,
          status: 'ACTIVE',
          createdAt: new Date().toISOString(),
          toSafeObject: function () { const { password, ...s } = this; return s; }
        };
        users.push(targetUser);
      }

      const memberships = getMemoryMemberships();
      const existing = memberships.find(m => String(m.weddingId) === String(id) && String(m.userId) === String(targetUser._id));
      if (existing) {
        return sendError(res, 409, 'This user is already a member of this wedding workspace.', 'ALREADY_MEMBER');
      }

      const mem = {
        _id: `mem_m_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        weddingId: id,
        userId: targetUser._id,
        role: 'ORGANIZER',
        permissions: defaultPermissions,
        joinedAt: new Date().toISOString(),
      };
      memberships.push(mem);

      return sendSuccess(res, 201, 'Organizer invited successfully (Dev Memory Mode)', {
        organizer: targetUser.toSafeObject ? targetUser.toSafeObject() : targetUser,
        membership: mem,
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Get All Organizers for a Wedding
 * GET /api/v1/weddings/:id/organizers
 */
const getOrganizers = async (req, res, next) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user._id || req.user.id;

    if (isDBConnected()) {
      const requesterMem = await WeddingMembership.findOne({ weddingId: id, userId: currentUserId });
      if (!requesterMem) {
        return sendError(res, 403, 'You do not have access to this wedding workspace.', 'FORBIDDEN');
      }

      const memberships = await WeddingMembership.find({ weddingId: id }).populate('userId');
      const list = memberships.map((m) => ({
        membershipId: m._id,
        user: m.userId ? m.userId.toSafeObject() : null,
        role: m.role,
        permissions: m.permissions,
        joinedAt: m.joinedAt,
      }));

      return sendSuccess(res, 200, 'Organizers roster retrieved', list);
    } else {
      const memberships = getMemoryMemberships().filter(m => String(m.weddingId) === String(id));
      const users = getMemoryUsers();

      const list = memberships.map(m => {
        const u = users.find(item => String(item._id) === String(m.userId));
        return {
          membershipId: m._id,
          user: u ? (u.toSafeObject ? u.toSafeObject() : u) : null,
          role: m.role,
          permissions: m.permissions,
          joinedAt: m.joinedAt,
        };
      });

      return sendSuccess(res, 200, 'Organizers roster retrieved (Dev Memory Mode)', list);
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Update Organizer Permissions
 * PUT /api/v1/weddings/:id/organizers/:membershipId/permissions
 */
const updateOrganizerPermissions = async (req, res, next) => {
  try {
    const { id, membershipId } = req.params;
    const { permissions } = req.body;
    const currentUserId = req.user._id || req.user.id;

    if (isDBConnected()) {
      const requesterMem = await WeddingMembership.findOne({
        weddingId: id,
        userId: currentUserId,
        role: { $in: ['OWNER', 'PARTNER'] },
      });
      if (!requesterMem) {
        return sendError(res, 403, 'Only Wedding Owners or Partners can update organizer permissions.', 'FORBIDDEN');
      }

      const membership = await WeddingMembership.findById(membershipId);
      if (!membership || String(membership.weddingId) !== String(id)) {
        return sendError(res, 404, 'Organizer membership record not found.', 'NOT_FOUND');
      }

      membership.permissions = {
        ...membership.permissions.toObject(),
        ...permissions,
      };
      await membership.save();

      return sendSuccess(res, 200, 'Organizer permissions updated successfully', { membership });
    } else {
      const memberships = getMemoryMemberships();
      const mem = memberships.find(m => String(m._id) === String(membershipId));
      if (!mem) return sendError(res, 404, 'Organizer membership record not found.', 'NOT_FOUND');

      mem.permissions = {
        ...mem.permissions,
        ...permissions,
      };

      return sendSuccess(res, 200, 'Organizer permissions updated (Dev Memory Mode)', { membership: mem });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Revoke Organizer Access
 * DELETE /api/v1/weddings/:id/organizers/:membershipId
 */
const revokeOrganizer = async (req, res, next) => {
  try {
    const { id, membershipId } = req.params;
    const currentUserId = req.user._id || req.user.id;

    if (isDBConnected()) {
      const requesterMem = await WeddingMembership.findOne({
        weddingId: id,
        userId: currentUserId,
        role: { $in: ['OWNER', 'PARTNER'] },
      });
      if (!requesterMem) {
        return sendError(res, 403, 'Only Wedding Owners or Partners can revoke organizer access.', 'FORBIDDEN');
      }

      const membership = await WeddingMembership.findById(membershipId);
      if (!membership || String(membership.weddingId) !== String(id)) {
        return sendError(res, 404, 'Organizer membership record not found.', 'NOT_FOUND');
      }

      if (membership.role === 'OWNER') {
        return sendError(res, 400, 'Cannot revoke access of the Wedding Owner.', 'INVALID_ACTION');
      }

      await WeddingMembership.findByIdAndDelete(membershipId);
      return sendSuccess(res, 200, 'Organizer access revoked successfully', null);
    } else {
      const memberships = getMemoryMemberships();
      const index = memberships.findIndex(m => String(m._id) === String(membershipId));
      if (index !== -1) {
        memberships.splice(index, 1);
      }
      return sendSuccess(res, 200, 'Organizer access revoked (Dev Memory Mode)', null);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  inviteOrganizer,
  getOrganizers,
  updateOrganizerPermissions,
  revokeOrganizer,
};
