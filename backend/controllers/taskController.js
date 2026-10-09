const mongoose = require('mongoose');
const Task = require('../models/Task');
const WeddingMembership = require('../models/WeddingMembership');
const { sendSuccess, sendError } = require('../utils/apiResponse');

const isDBConnected = () => mongoose.connection && mongoose.connection.readyState === 1;

// Dev Memory Store Fallback
const getMemoryTasks = () => {
  if (!global.memoryTasks) global.memoryTasks = [];
  return global.memoryTasks;
};

/**
 * Create Task
 * POST /api/v1/weddings/:id/tasks
 */
const createTask = async (req, res, next) => {
  try {
    const { id } = req.params; // weddingId
    const currentUserId = req.user._id || req.user.id;
    const body = req.validatedBody || req.body;

    if (isDBConnected()) {
      const membership = await WeddingMembership.findOne({ weddingId: id, userId: currentUserId });
      if (!membership) {
        return sendError(res, 403, 'You do not have access to this wedding workspace.', 'FORBIDDEN');
      }

      if (membership.role === 'ORGANIZER' && !membership.permissions?.canManageTasks) {
        return sendError(res, 403, 'Your organizer account does not have permission to manage tasks.', 'PERMISSION_DENIED');
      }

      const task = await Task.create({
        weddingId: id,
        createdByUser: currentUserId,
        title: body.title,
        category: body.category || 'GENERAL',
        priority: body.priority || 'MEDIUM',
        status: body.status || 'PENDING',
        dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
        assigneeName: body.assigneeName || 'Unassigned',
        assigneeId: body.assigneeId || null,
        notes: body.notes || '',
      });

      return sendSuccess(res, 201, 'Task created successfully', task);
    } else {
      const memoryTasks = getMemoryTasks();
      const newTask = {
        _id: `mem_task_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        weddingId: id,
        createdByUser: currentUserId,
        title: body.title,
        category: body.category || 'GENERAL',
        priority: body.priority || 'MEDIUM',
        status: body.status || 'PENDING',
        dueDate: body.dueDate || null,
        assigneeName: body.assigneeName || 'Unassigned',
        assigneeId: body.assigneeId || null,
        notes: body.notes || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      memoryTasks.push(newTask);

      return sendSuccess(res, 201, 'Task created successfully (Dev Memory Mode)', newTask);
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Get All Tasks for a Wedding
 * GET /api/v1/weddings/:id/tasks
 */
const getTasks = async (req, res, next) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user._id || req.user.id;

    if (isDBConnected()) {
      const membership = await WeddingMembership.findOne({ weddingId: id, userId: currentUserId });
      if (!membership) {
        return sendError(res, 403, 'You do not have access to this wedding workspace.', 'FORBIDDEN');
      }

      const tasks = await Task.find({ weddingId: id }).sort({ createdAt: -1 });
      return sendSuccess(res, 200, 'Tasks retrieved successfully', tasks);
    } else {
      const memoryTasks = getMemoryTasks().filter((t) => String(t.weddingId) === String(id));
      return sendSuccess(res, 200, 'Tasks retrieved successfully (Dev Memory Mode)', memoryTasks);
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Update Task
 * PUT /api/v1/weddings/:id/tasks/:taskId
 */
const updateTask = async (req, res, next) => {
  try {
    const { id, taskId } = req.params;
    const currentUserId = req.user._id || req.user.id;
    const body = req.validatedBody || req.body;

    if (isDBConnected()) {
      const membership = await WeddingMembership.findOne({ weddingId: id, userId: currentUserId });
      if (!membership) {
        return sendError(res, 403, 'You do not have permission to modify tasks in this wedding.', 'FORBIDDEN');
      }

      if (membership.role === 'ORGANIZER' && !membership.permissions?.canManageTasks) {
        return sendError(res, 403, 'Your organizer account does not have permission to modify tasks.', 'PERMISSION_DENIED');
      }

      const task = await Task.findOne({ _id: taskId, weddingId: id });
      if (!task) {
        return sendError(res, 404, 'Task record not found.', 'NOT_FOUND');
      }

      if (body.title !== undefined) task.title = body.title;
      if (body.category !== undefined) task.category = body.category;
      if (body.priority !== undefined) task.priority = body.priority;
      if (body.status !== undefined) task.status = body.status;
      if (body.dueDate !== undefined) task.dueDate = body.dueDate ? new Date(body.dueDate) : null;
      if (body.assigneeName !== undefined) task.assigneeName = body.assigneeName;
      if (body.assigneeId !== undefined) task.assigneeId = body.assigneeId;
      if (body.notes !== undefined) task.notes = body.notes;

      await task.save();
      return sendSuccess(res, 200, 'Task updated successfully', task);
    } else {
      const memoryTasks = getMemoryTasks();
      const task = memoryTasks.find((t) => String(t._id) === String(taskId) && String(t.weddingId) === String(id));
      if (!task) {
        return sendError(res, 404, 'Task record not found.', 'NOT_FOUND');
      }

      Object.assign(task, body, { updatedAt: new Date().toISOString() });
      return sendSuccess(res, 200, 'Task updated (Dev Memory Mode)', task);
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Delete Task
 * DELETE /api/v1/weddings/:id/tasks/:taskId
 */
const deleteTask = async (req, res, next) => {
  try {
    const { id, taskId } = req.params;
    const currentUserId = req.user._id || req.user.id;

    if (isDBConnected()) {
      const membership = await WeddingMembership.findOne({ weddingId: id, userId: currentUserId });
      if (!membership) {
        return sendError(res, 403, 'You do not have permission to delete tasks in this wedding.', 'FORBIDDEN');
      }

      if (membership.role === 'ORGANIZER' && !membership.permissions?.canManageTasks) {
        return sendError(res, 403, 'Your organizer account does not have permission to delete tasks.', 'PERMISSION_DENIED');
      }

      const task = await Task.findOneAndDelete({ _id: taskId, weddingId: id });
      if (!task) {
        return sendError(res, 404, 'Task record not found.', 'NOT_FOUND');
      }

      return sendSuccess(res, 200, 'Task deleted successfully', null);
    } else {
      const memoryTasks = getMemoryTasks();
      const index = memoryTasks.findIndex((t) => String(t._id) === String(taskId) && String(t.weddingId) === String(id));
      if (index !== -1) {
        memoryTasks.splice(index, 1);
      }
      return sendSuccess(res, 200, 'Task deleted (Dev Memory Mode)', null);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
};
