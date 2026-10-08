const mongoose = require('mongoose');
const crypto = require('crypto');
const Guest = require('../models/Guest');
const WeddingMembership = require('../models/WeddingMembership');
const { sendSuccess, sendError } = require('../utils/apiResponse');

const isDBConnected = () => mongoose.connection && mongoose.connection.readyState === 1;

// Memory Fallback Store
const getMemoryGuests = () => {
  if (!global.memoryGuests) global.memoryGuests = [];
  return global.memoryGuests;
};

/**
 * Add Guest to Wedding Workspace
 * POST /api/v1/weddings/:id/guests
 */
const createGuest = async (req, res, next) => {
  try {
    const { id } = req.params; // weddingId
    const currentUserId = req.user._id || req.user.id;
    const body = req.validatedBody || req.body;

    if (isDBConnected()) {
      const membership = await WeddingMembership.findOne({ weddingId: id, userId: currentUserId });
      if (!membership) {
        return sendError(res, 403, 'You do not have access to this wedding workspace.', 'FORBIDDEN');
      }

      if (membership.role === 'ORGANIZER' && !membership.permissions?.canManageGuests) {
        return sendError(res, 403, 'Your organizer account does not have permission to manage guest lists.', 'PERMISSION_DENIED');
      }

      const guest = await Guest.create({
        weddingId: id,
        createdByUser: currentUserId,
        fullName: body.fullName,
        email: body.email || '',
        phone: body.phone || '',
        category: body.category || 'GENERAL',
        invitedEvents: body.invitedEvents || [],
        allocatedAttendees: body.allocatedAttendees || 1,
        dietaryPreference: body.dietaryPreference || 'VEG',
        rsvpStatus: body.rsvpStatus || 'PENDING',
        notes: body.notes || '',
      });

      return sendSuccess(res, 201, 'Guest added to roster successfully', guest);
    } else {
      // Memory Fallback
      const guests = getMemoryGuests();
      const newGuest = {
        _id: `mem_gst_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        weddingId: id,
        createdByUser: currentUserId,
        fullName: body.fullName,
        email: body.email || '',
        phone: body.phone || '',
        category: body.category || 'GENERAL',
        invitedEvents: body.invitedEvents || [],
        allocatedAttendees: body.allocatedAttendees || 1,
        dietaryPreference: body.dietaryPreference || 'VEG',
        rsvpStatus: body.rsvpStatus || 'PENDING',
        invitationToken: crypto.randomBytes(8).toString('hex'),
        notes: body.notes || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      guests.push(newGuest);

      return sendSuccess(res, 201, 'Guest added to roster successfully (Dev Memory Mode)', newGuest);
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Get All Guests for a Wedding
 * GET /api/v1/weddings/:id/guests
 */
const getGuests = async (req, res, next) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user._id || req.user.id;

    if (isDBConnected()) {
      const membership = await WeddingMembership.findOne({ weddingId: id, userId: currentUserId });
      if (!membership) {
        return sendError(res, 403, 'You do not have access to this wedding workspace.', 'FORBIDDEN');
      }

      const guests = await Guest.find({ weddingId: id })
        .populate('invitedEvents')
        .sort({ createdAt: -1 });

      return sendSuccess(res, 200, 'Guest list retrieved successfully', guests);
    } else {
      const guests = getMemoryGuests().filter((g) => String(g.weddingId) === String(id));
      return sendSuccess(res, 200, 'Guest list retrieved successfully (Dev Memory Mode)', guests);
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Update Guest
 * PUT /api/v1/weddings/:id/guests/:guestId
 */
const updateGuest = async (req, res, next) => {
  try {
    const { id, guestId } = req.params;
    const currentUserId = req.user._id || req.user.id;
    const body = req.validatedBody || req.body;

    if (isDBConnected()) {
      const membership = await WeddingMembership.findOne({ weddingId: id, userId: currentUserId });
      if (!membership) {
        return sendError(res, 403, 'You do not have permission to modify guests in this wedding.', 'FORBIDDEN');
      }

      if (membership.role === 'ORGANIZER' && !membership.permissions?.canManageGuests) {
        return sendError(res, 403, 'Your organizer account does not have permission to manage guests.', 'PERMISSION_DENIED');
      }

      const guest = await Guest.findOne({ _id: guestId, weddingId: id });
      if (!guest) {
        return sendError(res, 404, 'Guest record not found.', 'NOT_FOUND');
      }

      if (body.fullName !== undefined) guest.fullName = body.fullName;
      if (body.email !== undefined) guest.email = body.email;
      if (body.phone !== undefined) guest.phone = body.phone;
      if (body.category !== undefined) guest.category = body.category;
      if (body.invitedEvents !== undefined) guest.invitedEvents = body.invitedEvents;
      if (body.allocatedAttendees !== undefined) guest.allocatedAttendees = body.allocatedAttendees;
      if (body.dietaryPreference !== undefined) guest.dietaryPreference = body.dietaryPreference;
      if (body.rsvpStatus !== undefined) guest.rsvpStatus = body.rsvpStatus;
      if (body.notes !== undefined) guest.notes = body.notes;

      await guest.save();
      const updatedGuest = await Guest.findById(guestId).populate('invitedEvents');

      return sendSuccess(res, 200, 'Guest record updated successfully', updatedGuest);
    } else {
      const guests = getMemoryGuests();
      const guest = guests.find((g) => String(g._id) === String(guestId) && String(g.weddingId) === String(id));
      if (!guest) {
        return sendError(res, 404, 'Guest record not found.', 'NOT_FOUND');
      }

      Object.assign(guest, body, { updatedAt: new Date().toISOString() });
      return sendSuccess(res, 200, 'Guest record updated (Dev Memory Mode)', guest);
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Delete Guest
 * DELETE /api/v1/weddings/:id/guests/:guestId
 */
const deleteGuest = async (req, res, next) => {
  try {
    const { id, guestId } = req.params;
    const currentUserId = req.user._id || req.user.id;

    if (isDBConnected()) {
      const membership = await WeddingMembership.findOne({ weddingId: id, userId: currentUserId });
      if (!membership) {
        return sendError(res, 403, 'You do not have permission to delete guests in this wedding.', 'FORBIDDEN');
      }

      if (membership.role === 'ORGANIZER' && !membership.permissions?.canManageGuests) {
        return sendError(res, 403, 'Your organizer account does not have permission to delete guests.', 'PERMISSION_DENIED');
      }

      const guest = await Guest.findOneAndDelete({ _id: guestId, weddingId: id });
      if (!guest) {
        return sendError(res, 404, 'Guest record not found.', 'NOT_FOUND');
      }

      return sendSuccess(res, 200, 'Guest deleted from roster successfully', null);
    } else {
      const guests = getMemoryGuests();
      const index = guests.findIndex((g) => String(g._id) === String(guestId) && String(g.weddingId) === String(id));
      if (index !== -1) {
        guests.splice(index, 1);
      }
      return sendSuccess(res, 200, 'Guest deleted (Dev Memory Mode)', null);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createGuest,
  getGuests,
  updateGuest,
  deleteGuest,
};
