const mongoose = require('mongoose');
const Event = require('../models/Event');
const WeddingMembership = require('../models/WeddingMembership');
const { sendSuccess, sendError } = require('../utils/apiResponse');

const isDBConnected = () => mongoose.connection && mongoose.connection.readyState === 1;

// Memory Fallback Store
const getMemoryEvents = () => {
  if (!global.memoryEvents) global.memoryEvents = [];
  return global.memoryEvents;
};

const getMemoryMemberships = () => {
  if (!global.memoryMemberships) global.memoryMemberships = [];
  return global.memoryMemberships;
};

/**
 * Create Ceremony Event
 * POST /api/v1/weddings/:id/events
 */
const createEvent = async (req, res, next) => {
  try {
    const { id } = req.params; // weddingId
    const currentUserId = req.user._id || req.user.id;
    const body = req.validatedBody || req.body;

    if (isDBConnected()) {
      // Ensure requester is a member of the wedding
      const membership = await WeddingMembership.findOne({ weddingId: id, userId: currentUserId });
      if (!membership) {
        return sendError(res, 403, 'You do not have permission to add events to this wedding.', 'FORBIDDEN');
      }

      // Check permissions if role is ORGANIZER
      if (membership.role === 'ORGANIZER' && !membership.permissions?.canManageEvents) {
        return sendError(res, 403, 'Your organizer account does not have permission to manage events.', 'PERMISSION_DENIED');
      }

      const event = await Event.create({
        weddingId: id,
        createdByUser: currentUserId,
        title: body.title,
        eventType: body.eventType || 'CUSTOM',
        date: new Date(body.date),
        startTime: body.startTime || '10:00 AM',
        endTime: body.endTime || '02:00 PM',
        location: body.location || {},
        dressCode: body.dressCode || '',
        description: body.description || '',
        liveStreamUrl: body.liveStreamUrl || '',
      });

      return sendSuccess(res, 201, 'Event ceremony created successfully', event);
    } else {
      // Memory Fallback
      const events = getMemoryEvents();
      const newEvent = {
        _id: `mem_evt_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        weddingId: id,
        createdByUser: currentUserId,
        title: body.title,
        eventType: body.eventType || 'CUSTOM',
        date: new Date(body.date).toISOString(),
        startTime: body.startTime || '10:00 AM',
        endTime: body.endTime || '02:00 PM',
        location: body.location || {},
        dressCode: body.dressCode || '',
        description: body.description || '',
        liveStreamUrl: body.liveStreamUrl || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      events.push(newEvent);

      return sendSuccess(res, 201, 'Event ceremony created successfully (Dev Memory Mode)', newEvent);
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Get All Events for a Wedding
 * GET /api/v1/weddings/:id/events
 */
const getEvents = async (req, res, next) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user._id || req.user.id;

    if (isDBConnected()) {
      const membership = await WeddingMembership.findOne({ weddingId: id, userId: currentUserId });
      if (!membership) {
        return sendError(res, 403, 'You do not have access to this wedding workspace.', 'FORBIDDEN');
      }

      const events = await Event.find({ weddingId: id }).sort({ date: 1, startTime: 1 });
      return sendSuccess(res, 200, 'Wedding events itinerary retrieved', events);
    } else {
      const events = getMemoryEvents()
        .filter(e => String(e.weddingId) === String(id))
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      return sendSuccess(res, 200, 'Wedding events itinerary retrieved (Dev Memory Mode)', events);
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Update Event Ceremony
 * PUT /api/v1/weddings/:id/events/:eventId
 */
const updateEvent = async (req, res, next) => {
  try {
    const { id, eventId } = req.params;
    const currentUserId = req.user._id || req.user.id;
    const body = req.validatedBody || req.body;

    if (isDBConnected()) {
      const membership = await WeddingMembership.findOne({ weddingId: id, userId: currentUserId });
      if (!membership) {
        return sendError(res, 403, 'You do not have permission to modify events in this wedding.', 'FORBIDDEN');
      }

      if (membership.role === 'ORGANIZER' && !membership.permissions?.canManageEvents) {
        return sendError(res, 403, 'Your organizer account does not have permission to manage events.', 'PERMISSION_DENIED');
      }

      const event = await Event.findOne({ _id: eventId, weddingId: id });
      if (!event) {
        return sendError(res, 404, 'Event ceremony not found.', 'NOT_FOUND');
      }

      if (body.title !== undefined) event.title = body.title;
      if (body.eventType !== undefined) event.eventType = body.eventType;
      if (body.date !== undefined) event.date = new Date(body.date);
      if (body.startTime !== undefined) event.startTime = body.startTime;
      if (body.endTime !== undefined) event.endTime = body.endTime;
      if (body.location !== undefined) event.location = { ...event.location, ...body.location };
      if (body.dressCode !== undefined) event.dressCode = body.dressCode;
      if (body.description !== undefined) event.description = body.description;
      if (body.liveStreamUrl !== undefined) event.liveStreamUrl = body.liveStreamUrl;

      await event.save();
      return sendSuccess(res, 200, 'Event ceremony updated successfully', event);
    } else {
      const events = getMemoryEvents();
      const event = events.find(e => String(e._id) === String(eventId) && String(e.weddingId) === String(id));
      if (!event) {
        return sendError(res, 404, 'Event ceremony not found.', 'NOT_FOUND');
      }

      Object.assign(event, body, { updatedAt: new Date().toISOString() });
      if (body.date) event.date = new Date(body.date).toISOString();

      return sendSuccess(res, 200, 'Event ceremony updated successfully (Dev Memory Mode)', event);
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Delete Event Ceremony
 * DELETE /api/v1/weddings/:id/events/:eventId
 */
const deleteEvent = async (req, res, next) => {
  try {
    const { id, eventId } = req.params;
    const currentUserId = req.user._id || req.user.id;

    if (isDBConnected()) {
      const membership = await WeddingMembership.findOne({ weddingId: id, userId: currentUserId });
      if (!membership) {
        return sendError(res, 403, 'You do not have permission to delete events in this wedding.', 'FORBIDDEN');
      }

      if (membership.role === 'ORGANIZER' && !membership.permissions?.canManageEvents) {
        return sendError(res, 403, 'Your organizer account does not have permission to delete events.', 'PERMISSION_DENIED');
      }

      const event = await Event.findOneAndDelete({ _id: eventId, weddingId: id });
      if (!event) {
        return sendError(res, 404, 'Event ceremony not found.', 'NOT_FOUND');
      }

      return sendSuccess(res, 200, 'Event ceremony deleted successfully', null);
    } else {
      const events = getMemoryEvents();
      const index = events.findIndex(e => String(e._id) === String(eventId) && String(e.weddingId) === String(id));
      if (index !== -1) {
        events.splice(index, 1);
      }
      return sendSuccess(res, 200, 'Event ceremony deleted (Dev Memory Mode)', null);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent,
};
