const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema(
  {
    weddingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Wedding',
      required: true,
      index: true,
    },
    vendorName: {
      type: String,
      required: [true, 'Vendor name is required'],
      trim: true,
      maxlength: [150, 'Vendor name cannot exceed 150 characters'],
    },
    category: {
      type: String,
      enum: ['VENUE', 'CATERING', 'PHOTOGRAPHY', 'DECOR', 'MUSIC', 'MAKEUP', 'OTHER'],
      default: 'OTHER',
    },
    contactPerson: {
      type: String,
      trim: true,
      default: '',
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    estimatedBudget: {
      type: Number,
      default: 0,
      min: [0, 'Estimated budget cannot be negative'],
    },
    actualCost: {
      type: Number,
      default: 0,
      min: [0, 'Actual cost cannot be negative'],
    },
    paidAmount: {
      type: Number,
      default: 0,
      min: [0, 'Paid amount cannot be negative'],
    },
    paymentStatus: {
      type: String,
      enum: ['UNPAID', 'PARTIALLY_PAID', 'FULLY_PAID'],
      default: 'UNPAID',
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

// Pre-save auto-calculate payment status if not explicitly set
vendorSchema.pre('save', function (next) {
  if (this.paidAmount >= this.actualCost && this.actualCost > 0) {
    this.paymentStatus = 'FULLY_PAID';
  } else if (this.paidAmount > 0 && this.paidAmount < this.actualCost) {
    this.paymentStatus = 'PARTIALLY_PAID';
  } else if (this.paidAmount === 0) {
    this.paymentStatus = 'UNPAID';
  }
  next();
});

module.exports = mongoose.model('Vendor', vendorSchema);
