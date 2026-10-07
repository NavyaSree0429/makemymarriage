const mongoose = require('mongoose');
const Wedding = require('../models/Wedding');
const WeddingMembership = require('../models/WeddingMembership');
const User = require('../models/User');
const { sendSuccess, sendError } = require('../utils/apiResponse');

const isDBConnected = () => mongoose.connection && mongoose.connection.readyState === 1;

// Memory Fallback Store
const getMemoryWeddings = () => {
  if (!global.memoryWeddings) global.memoryWeddings = [];
  return global.memoryWeddings;
};
const getMemoryMemberships = () => {
  if (!global.memoryMemberships) global.memoryMemberships = [];
  return global.memoryMemberships;
};

/**
 * Create a New Wedding Workspace
 * POST /api/v1/weddings
 */
const createWedding = async (req, res, next) => {
  try {
    const { partner1Name, partner2Name, weddingDate, city, venueName, description, theme } = req.body;
    const userId = req.user._id || req.user.id;

    // Generate slug e.g. rahul-priya-123
    const baseSlug = `${partner1Name}-${partner2Name}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const slug = `${baseSlug}-${Math.floor(1000 + Math.random() * 9000)}`;

    if (isDBConnected()) {
      const wedding = await Wedding.create({
        ownerId: userId,
        partnerNames: {
          partner1: partner1Name,
          partner2: partner2Name,
        },
        slug,
        weddingDate: new Date(weddingDate),
        primaryLocation: {
          city: city || '',
          venueName: venueName || '',
        },
        description: description || '',
        theme: theme || 'ROYAL',
      });

      // Create OWNER membership
      const membership = await WeddingMembership.create({
        weddingId: wedding._id,
        userId,
        role: 'OWNER',
        permissions: {
          canManageEvents: true,
          canManageGuests: true,
          canManageInvitations: true,
          canManageTasks: true,
          canManageVendors: true,
          canManageBudget: true,
          canManageGallery: true,
          canManageWebsite: true,
        },
      });

      return sendSuccess(res, 201, 'Wedding workspace created successfully', {
        wedding,
        membership,
      });
    } else {
      // Memory Fallback
      const weddings = getMemoryWeddings();
      const memberships = getMemoryMemberships();

      const memWedding = {
        _id: `mem_w_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        ownerId: userId,
        partnerNames: { partner1: partner1Name, partner2: partner2Name },
        slug,
        weddingDate: new Date(weddingDate).toISOString(),
        primaryLocation: { city: city || '', venueName: venueName || '' },
        description: description || '',
        theme: theme || 'ROYAL',
        status: 'PLANNING',
        title: `${partner1Name} & ${partner2Name}'s Wedding`,
        createdAt: new Date().toISOString(),
      };
      weddings.push(memWedding);

      const memMembership = {
        _id: `mem_m_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        weddingId: memWedding._id,
        userId: userId,
        role: 'OWNER',
        permissions: {
          canManageEvents: true,
          canManageGuests: true,
          canManageInvitations: true,
          canManageTasks: true,
          canManageVendors: true,
          canManageBudget: true,
          canManageGallery: true,
          canManageWebsite: true,
        },
        joinedAt: new Date().toISOString(),
      };
      memberships.push(memMembership);

      return sendSuccess(res, 201, 'Wedding workspace created successfully (Dev Memory Mode)', {
        wedding: memWedding,
        membership: memMembership,
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Get All Weddings Accessible by Current User
 * GET /api/v1/weddings/my-weddings
 */
const getMyWeddings = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;

    if (isDBConnected()) {
      const memberships = await WeddingMembership.find({ userId }).populate('weddingId');
      const list = memberships.map((m) => ({
        wedding: m.weddingId,
        role: m.role,
        permissions: m.permissions,
        joinedAt: m.joinedAt,
      }));
      return sendSuccess(res, 200, 'User weddings retrieved', list);
    } else {
      const memberships = getMemoryMemberships().filter(m => String(m.userId) === String(userId));
      const weddings = getMemoryWeddings();
      const list = memberships.map(m => {
        const w = weddings.find(item => String(item._id) === String(m.weddingId));
        return {
          wedding: w,
          role: m.role,
          permissions: m.permissions,
          joinedAt: m.joinedAt,
        };
      }).filter(item => item.wedding);

      return sendSuccess(res, 200, 'User weddings retrieved (Dev Memory Mode)', list);
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Get Specific Wedding Workspace Details
 * GET /api/v1/weddings/:id
 */
const getWeddingById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id || req.user.id;

    if (isDBConnected()) {
      const membership = await WeddingMembership.findOne({ weddingId: id, userId }).populate('weddingId');
      if (!membership) {
        return sendError(res, 403, 'You do not have permission to access this wedding workspace.', 'FORBIDDEN');
      }
      return sendSuccess(res, 200, 'Wedding workspace details retrieved', {
        wedding: membership.weddingId,
        role: membership.role,
        permissions: membership.permissions,
      });
    } else {
      const membership = getMemoryMemberships().find(m => String(m.weddingId) === String(id) && String(m.userId) === String(userId));
      if (!membership) {
        return sendError(res, 403, 'You do not have permission to access this wedding workspace.', 'FORBIDDEN');
      }
      const wedding = getMemoryWeddings().find(w => String(w._id) === String(id));
      return sendSuccess(res, 200, 'Wedding workspace details retrieved (Dev Memory Mode)', {
        wedding,
        role: membership.role,
        permissions: membership.permissions,
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Generate Partner Invitation Code
 * POST /api/v1/weddings/:id/invite-partner
 */
const invitePartner = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id || req.user.id;

    const inviteCode = `PARTNER-${Math.floor(100000 + Math.random() * 900000)}`;
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    if (isDBConnected()) {
      const membership = await WeddingMembership.findOne({ weddingId: id, userId, role: 'OWNER' });
      if (!membership) {
        return sendError(res, 403, 'Only the Wedding Owner can invite a partner.', 'FORBIDDEN');
      }

      const wedding = await Wedding.findById(id);
      wedding.partnerInviteCode = inviteCode;
      wedding.partnerInviteExpires = expires;
      await wedding.save();

      return sendSuccess(res, 200, 'Partner invitation generated successfully', {
        inviteCode,
        inviteUrl: `${process.env.CLIENT_URL || 'http://localhost:5173'}/accept-partner-invite?code=${inviteCode}`,
        expiresAt: expires,
      });
    } else {
      const wedding = getMemoryWeddings().find(w => String(w._id) === String(id));
      if (!wedding) return sendError(res, 404, 'Wedding not found', 'NOT_FOUND');

      wedding.partnerInviteCode = inviteCode;
      wedding.partnerInviteExpires = expires;

      return sendSuccess(res, 200, 'Partner invitation generated (Dev Memory Mode)', {
        inviteCode,
        inviteUrl: `${process.env.CLIENT_URL || 'http://localhost:5173'}/accept-partner-invite?code=${inviteCode}`,
        expiresAt: expires,
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Accept Partner Invitation Code & Join Workspace as Co-Owner
 * POST /api/v1/weddings/accept-partner-invite
 */
const acceptPartnerInvite = async (req, res, next) => {
  try {
    const { inviteCode } = req.body;
    const userId = req.user._id || req.user.id;

    if (isDBConnected()) {
      const wedding = await Wedding.findOne({
        partnerInviteCode: inviteCode,
        partnerInviteExpires: { $gt: Date.now() },
      });

      if (!wedding) {
        return sendError(res, 400, 'Invalid or expired partner invitation code.', 'INVALID_INVITE_CODE');
      }

      // Check if membership exists
      let membership = await WeddingMembership.findOne({ weddingId: wedding._id, userId });
      if (membership) {
        return sendError(res, 409, 'You are already a member of this wedding workspace.', 'ALREADY_MEMBER');
      }

      membership = await WeddingMembership.create({
        weddingId: wedding._id,
        userId,
        role: 'PARTNER',
        permissions: {
          canManageEvents: true,
          canManageGuests: true,
          canManageInvitations: true,
          canManageTasks: true,
          canManageVendors: true,
          canManageBudget: true,
          canManageGallery: true,
          canManageWebsite: true,
        },
      });

      // Clear invite code
      wedding.partnerInviteCode = undefined;
      wedding.partnerInviteExpires = undefined;
      await wedding.save();

      return sendSuccess(res, 200, 'Successfully joined wedding workspace as Partner', {
        wedding,
        membership,
      });
    } else {
      const weddings = getMemoryWeddings();
      const wedding = weddings.find(w => w.partnerInviteCode === inviteCode);
      if (!wedding) {
        return sendError(res, 400, 'Invalid or expired partner invitation code.', 'INVALID_INVITE_CODE');
      }

      const memberships = getMemoryMemberships();
      const mem = {
        _id: `mem_m_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        weddingId: wedding._id,
        userId,
        role: 'PARTNER',
        permissions: {
          canManageEvents: true,
          canManageGuests: true,
          canManageInvitations: true,
          canManageTasks: true,
          canManageVendors: true,
          canManageBudget: true,
          canManageGallery: true,
          canManageWebsite: true,
        },
        joinedAt: new Date().toISOString(),
      };
      memberships.push(mem);

      wedding.partnerInviteCode = null;

      return sendSuccess(res, 200, 'Successfully joined wedding workspace as Partner (Dev Memory Mode)', {
        wedding,
        membership: mem,
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createWedding,
  getMyWeddings,
  getWeddingById,
  invitePartner,
  acceptPartnerInvite,
};
