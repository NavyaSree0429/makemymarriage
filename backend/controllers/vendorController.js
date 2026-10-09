const mongoose = require('mongoose');
const Vendor = require('../models/Vendor');
const WeddingMembership = require('../models/WeddingMembership');
const { sendSuccess, sendError } = require('../utils/apiResponse');

const isDBConnected = () => mongoose.connection && mongoose.connection.readyState === 1;

// Dev Memory Store Fallback
const getMemoryVendors = () => {
  if (!global.memoryVendors) global.memoryVendors = [];
  return global.memoryVendors;
};

/**
 * Create Vendor Record
 * POST /api/v1/weddings/:id/vendors
 */
const createVendor = async (req, res, next) => {
  try {
    const { id } = req.params; // weddingId
    const currentUserId = req.user._id || req.user.id;
    const body = req.validatedBody || req.body;

    if (isDBConnected()) {
      const membership = await WeddingMembership.findOne({ weddingId: id, userId: currentUserId });
      if (!membership) {
        return sendError(res, 403, 'You do not have access to this wedding workspace.', 'FORBIDDEN');
      }

      if (membership.role === 'ORGANIZER' && !membership.permissions?.canManageBudget) {
        return sendError(res, 403, 'Your organizer account does not have permission to manage vendors & budget.', 'PERMISSION_DENIED');
      }

      const estimatedBudget = Number(body.estimatedBudget) || 0;
      const actualCost = Number(body.actualCost) || 0;
      const paidAmount = Number(body.paidAmount) || 0;

      let paymentStatus = body.paymentStatus || 'UNPAID';
      if (paidAmount >= actualCost && actualCost > 0) {
        paymentStatus = 'FULLY_PAID';
      } else if (paidAmount > 0 && paidAmount < actualCost) {
        paymentStatus = 'PARTIALLY_PAID';
      }

      const vendor = await Vendor.create({
        weddingId: id,
        createdByUser: currentUserId,
        vendorName: body.vendorName,
        category: body.category || 'OTHER',
        contactPerson: body.contactPerson || '',
        phone: body.phone || '',
        email: body.email || '',
        estimatedBudget,
        actualCost,
        paidAmount,
        paymentStatus,
        notes: body.notes || '',
      });

      return sendSuccess(res, 201, 'Vendor added successfully', vendor);
    } else {
      const memoryVendors = getMemoryVendors();
      const estimatedBudget = Number(body.estimatedBudget) || 0;
      const actualCost = Number(body.actualCost) || 0;
      const paidAmount = Number(body.paidAmount) || 0;

      let paymentStatus = body.paymentStatus || 'UNPAID';
      if (paidAmount >= actualCost && actualCost > 0) {
        paymentStatus = 'FULLY_PAID';
      } else if (paidAmount > 0 && paidAmount < actualCost) {
        paymentStatus = 'PARTIALLY_PAID';
      }

      const newVendor = {
        _id: `mem_vnd_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        weddingId: id,
        createdByUser: currentUserId,
        vendorName: body.vendorName,
        category: body.category || 'OTHER',
        contactPerson: body.contactPerson || '',
        phone: body.phone || '',
        email: body.email || '',
        estimatedBudget,
        actualCost,
        paidAmount,
        paymentStatus,
        notes: body.notes || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      memoryVendors.push(newVendor);

      return sendSuccess(res, 201, 'Vendor added successfully (Dev Memory Mode)', newVendor);
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Get All Vendors for a Wedding
 * GET /api/v1/weddings/:id/vendors
 */
const getVendors = async (req, res, next) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user._id || req.user.id;

    if (isDBConnected()) {
      const membership = await WeddingMembership.findOne({ weddingId: id, userId: currentUserId });
      if (!membership) {
        return sendError(res, 403, 'You do not have access to this wedding workspace.', 'FORBIDDEN');
      }

      const vendors = await Vendor.find({ weddingId: id }).sort({ createdAt: -1 });
      return sendSuccess(res, 200, 'Vendor directory retrieved successfully', vendors);
    } else {
      const memoryVendors = getMemoryVendors().filter((v) => String(v.weddingId) === String(id));
      return sendSuccess(res, 200, 'Vendor directory retrieved successfully (Dev Memory Mode)', memoryVendors);
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Update Vendor
 * PUT /api/v1/weddings/:id/vendors/:vendorId
 */
const updateVendor = async (req, res, next) => {
  try {
    const { id, vendorId } = req.params;
    const currentUserId = req.user._id || req.user.id;
    const body = req.validatedBody || req.body;

    if (isDBConnected()) {
      const membership = await WeddingMembership.findOne({ weddingId: id, userId: currentUserId });
      if (!membership) {
        return sendError(res, 403, 'You do not have permission to modify vendors in this wedding.', 'FORBIDDEN');
      }

      if (membership.role === 'ORGANIZER' && !membership.permissions?.canManageBudget) {
        return sendError(res, 403, 'Your organizer account does not have permission to modify budget.', 'PERMISSION_DENIED');
      }

      const vendor = await Vendor.findOne({ _id: vendorId, weddingId: id });
      if (!vendor) {
        return sendError(res, 404, 'Vendor record not found.', 'NOT_FOUND');
      }

      if (body.vendorName !== undefined) vendor.vendorName = body.vendorName;
      if (body.category !== undefined) vendor.category = body.category;
      if (body.contactPerson !== undefined) vendor.contactPerson = body.contactPerson;
      if (body.phone !== undefined) vendor.phone = body.phone;
      if (body.email !== undefined) vendor.email = body.email;
      if (body.estimatedBudget !== undefined) vendor.estimatedBudget = Number(body.estimatedBudget);
      if (body.actualCost !== undefined) vendor.actualCost = Number(body.actualCost);
      if (body.paidAmount !== undefined) vendor.paidAmount = Number(body.paidAmount);
      if (body.notes !== undefined) vendor.notes = body.notes;

      if (body.paymentStatus !== undefined) {
        vendor.paymentStatus = body.paymentStatus;
      } else {
        if (vendor.paidAmount >= vendor.actualCost && vendor.actualCost > 0) {
          vendor.paymentStatus = 'FULLY_PAID';
        } else if (vendor.paidAmount > 0 && vendor.paidAmount < vendor.actualCost) {
          vendor.paymentStatus = 'PARTIALLY_PAID';
        } else if (vendor.paidAmount === 0) {
          vendor.paymentStatus = 'UNPAID';
        }
      }

      await vendor.save();
      return sendSuccess(res, 200, 'Vendor details updated successfully', vendor);
    } else {
      const memoryVendors = getMemoryVendors();
      const vendor = memoryVendors.find((v) => String(v._id) === String(vendorId) && String(v.weddingId) === String(id));
      if (!vendor) {
        return sendError(res, 404, 'Vendor record not found.', 'NOT_FOUND');
      }

      Object.assign(vendor, body, { updatedAt: new Date().toISOString() });
      if (vendor.paidAmount >= vendor.actualCost && vendor.actualCost > 0) {
        vendor.paymentStatus = 'FULLY_PAID';
      } else if (vendor.paidAmount > 0) {
        vendor.paymentStatus = 'PARTIALLY_PAID';
      }

      return sendSuccess(res, 200, 'Vendor details updated (Dev Memory Mode)', vendor);
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Delete Vendor
 * DELETE /api/v1/weddings/:id/vendors/:vendorId
 */
const deleteVendor = async (req, res, next) => {
  try {
    const { id, vendorId } = req.params;
    const currentUserId = req.user._id || req.user.id;

    if (isDBConnected()) {
      const membership = await WeddingMembership.findOne({ weddingId: id, userId: currentUserId });
      if (!membership) {
        return sendError(res, 403, 'You do not have permission to delete vendors in this wedding.', 'FORBIDDEN');
      }

      if (membership.role === 'ORGANIZER' && !membership.permissions?.canManageBudget) {
        return sendError(res, 403, 'Your organizer account does not have permission to delete vendors.', 'PERMISSION_DENIED');
      }

      const vendor = await Vendor.findOneAndDelete({ _id: vendorId, weddingId: id });
      if (!vendor) {
        return sendError(res, 404, 'Vendor record not found.', 'NOT_FOUND');
      }

      return sendSuccess(res, 200, 'Vendor removed successfully', null);
    } else {
      const memoryVendors = getMemoryVendors();
      const index = memoryVendors.findIndex((v) => String(v._id) === String(vendorId) && String(v.weddingId) === String(id));
      if (index !== -1) {
        memoryVendors.splice(index, 1);
      }
      return sendSuccess(res, 200, 'Vendor removed (Dev Memory Mode)', null);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createVendor,
  getVendors,
  updateVendor,
  deleteVendor,
};
