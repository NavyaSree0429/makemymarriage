const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema(
  {
    wedding: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Wedding',
      required: true,
      index: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    uploaderName: {
      type: String,
      default: 'Wedding Guest',
    },
    category: {
      type: String,
      enum: ['HALDI', 'MEHENDI', 'SANGEET', 'WEDDING', 'RECEPTION', 'GENERAL'],
      default: 'GENERAL',
    },
    imageUrl: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
      default: '',
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    likedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    tags: [
      {
        type: String,
      },
    ],
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Photo', photoSchema);
