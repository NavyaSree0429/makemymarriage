const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    weddingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Wedding',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      maxlength: [150, 'Task title cannot exceed 150 characters'],
    },
    category: {
      type: String,
      enum: ['DECOR', 'CATERING', 'MUSIC', 'LOGISTICS', 'OUTFITS', 'PHOTOGRAPHY', 'GENERAL'],
      default: 'GENERAL',
    },
    priority: {
      type: String,
      enum: ['URGENT', 'HIGH', 'MEDIUM', 'LOW'],
      default: 'MEDIUM',
    },
    status: {
      type: String,
      enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED'],
      default: 'PENDING',
    },
    dueDate: {
      type: Date,
    },
    assigneeName: {
      type: String,
      trim: true,
      default: 'Unassigned',
    },
    assigneeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
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

module.exports = mongoose.model('Task', taskSchema);
