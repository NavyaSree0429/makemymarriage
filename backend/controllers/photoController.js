const Photo = require('../models/Photo');
const mongoose = require('mongoose');

// Dev Memory Fallback Storage
let memoryPhotos = [];

/**
 * @desc Create new photo memory
 * @route POST /api/v1/weddings/:weddingId/photos
 * @access Private
 */
exports.createPhoto = async (req, res) => {
  try {
    const { weddingId } = req.params;
    const { category, imageUrl, caption, tags, isPublic } = req.body;
    const userId = req.user?._id || req.user?.id || 'dev_user_id';
    const uploaderName = req.user?.fullName || 'Wedding Host';

    // Attempt MongoDB save
    if (mongoose.connection.readyState === 1) {
      const newPhoto = await Photo.create({
        wedding: weddingId,
        uploadedBy: userId,
        uploaderName,
        category: category || 'GENERAL',
        imageUrl,
        caption: caption || '',
        tags: tags || [],
        isPublic: isPublic !== undefined ? isPublic : true,
      });

      return res.status(201).json({
        success: true,
        data: newPhoto,
        message: 'Photo uploaded successfully',
      });
    }

    // Dev Memory Fallback
    const mockPhoto = {
      _id: `photo_mem_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      wedding: weddingId,
      uploadedBy: userId,
      uploaderName,
      category: category || 'GENERAL',
      imageUrl,
      caption: caption || '',
      likesCount: 0,
      likedBy: [],
      tags: tags || [],
      isPublic: isPublic !== undefined ? isPublic : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    memoryPhotos.unshift(mockPhoto);

    return res.status(201).json({
      success: true,
      data: mockPhoto,
      message: 'Photo uploaded successfully (Dev Memory)',
    });
  } catch (error) {
    console.error('Create Photo Error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'PHOTO_CREATE_FAILED',
        message: error.message || 'Failed to upload photo memory',
      },
    });
  }
};

/**
 * @desc Get all photos for a wedding
 * @route GET /api/v1/weddings/:weddingId/photos
 * @access Private / Public
 */
exports.getPhotos = async (req, res) => {
  try {
    const { weddingId } = req.params;
    const { category, search } = req.query;

    if (mongoose.connection.readyState === 1) {
      const query = { wedding: weddingId };
      if (category && category !== 'ALL') {
        query.category = category;
      }
      if (search) {
        query.caption = { $regex: search, $options: 'i' };
      }

      const photos = await Photo.find(query).sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        count: photos.length,
        data: photos,
      });
    }

    // Dev Memory Fallback
    let result = memoryPhotos.filter((p) => String(p.wedding) === String(weddingId));

    if (category && category !== 'ALL') {
      result = result.filter((p) => p.category === category);
    }
    if (search) {
      result = result.filter((p) => (p.caption || '').toLowerCase().includes(search.toLowerCase()));
    }

    // Pre-populate seed mock photos if memory is empty
    if (result.length === 0 && (!category || category === 'ALL') && !search) {
      const seedPhotos = [
        {
          _id: 'photo_seed_1',
          wedding: weddingId,
          uploadedBy: req.user?._id || 'dev_user_1',
          uploaderName: 'Anushka Sharma',
          category: 'WEDDING',
          imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
          caption: 'Sacred pheras around the holy fire under golden mandap lights 💍',
          likesCount: 18,
          likedBy: [],
          tags: ['Mandap', 'Pheras', 'Vows'],
          isPublic: true,
          createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        },
        {
          _id: 'photo_seed_2',
          wedding: weddingId,
          uploadedBy: req.user?._id || 'dev_user_1',
          uploaderName: 'Virat Kohli',
          category: 'HALDI',
          imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
          caption: 'Joyous turmeric laughter with family during Haldi ceremony 🌼',
          likesCount: 24,
          likedBy: [],
          tags: ['Haldi', 'Family', 'Fun'],
          isPublic: true,
          createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
        },
        {
          _id: 'photo_seed_3',
          wedding: weddingId,
          uploadedBy: req.user?._id || 'dev_user_1',
          uploaderName: 'Karan Johar',
          category: 'SANGEET',
          imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
          caption: 'Grand musical night performance with royal chandelier backdrop 💃🎵',
          likesCount: 31,
          likedBy: [],
          tags: ['Sangeet', 'Dance', 'Chandelier'],
          isPublic: true,
          createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
        },
        {
          _id: 'photo_seed_4',
          wedding: weddingId,
          uploadedBy: req.user?._id || 'dev_user_1',
          uploaderName: 'Anushka Sharma',
          category: 'MEHENDI',
          imageUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
          caption: 'Intricate royal bridal henna art with floral marigold decor 🌿',
          likesCount: 15,
          likedBy: [],
          tags: ['Mehendi', 'Henna', 'Marigold'],
          isPublic: true,
          createdAt: new Date(Date.now() - 3600000 * 30).toISOString(),
        },
        {
          _id: 'photo_seed_5',
          wedding: weddingId,
          uploadedBy: req.user?._id || 'dev_user_1',
          uploaderName: 'Royal Photographer',
          category: 'RECEPTION',
          imageUrl: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80',
          caption: 'Grand palace entry banquet reception under fireworks 🥂✨',
          likesCount: 42,
          likedBy: [],
          tags: ['Reception', 'Palace', 'Banquet'],
          isPublic: true,
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        },
      ];
      memoryPhotos = seedPhotos;
      result = seedPhotos;
    }

    return res.status(200).json({
      success: true,
      count: result.length,
      data: result,
    });
  } catch (error) {
    console.error('Get Photos Error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'FETCH_PHOTOS_FAILED',
        message: 'Failed to fetch photo gallery',
      },
    });
  }
};

/**
 * @desc Update photo record (caption, category, visibility)
 * @route PUT /api/v1/weddings/:weddingId/photos/:photoId
 * @access Private
 */
exports.updatePhoto = async (req, res) => {
  try {
    const { photoId } = req.params;
    const { category, caption, tags, isPublic } = req.body;

    if (mongoose.connection.readyState === 1) {
      const updatedPhoto = await Photo.findByIdAndUpdate(
        photoId,
        {
          ...(category && { category }),
          ...(caption !== undefined && { caption }),
          ...(tags && { tags }),
          ...(isPublic !== undefined && { isPublic }),
        },
        { new: true }
      );

      if (!updatedPhoto) {
        return res.status(404).json({
          success: false,
          error: { code: 'PHOTO_NOT_FOUND', message: 'Photo record not found' },
        });
      }

      return res.status(200).json({
        success: true,
        data: updatedPhoto,
        message: 'Photo updated successfully',
      });
    }

    // Dev Memory Fallback
    const index = memoryPhotos.findIndex((p) => p._id === photoId);
    if (index === -1) {
      return res.status(404).json({
        success: false,
        error: { code: 'PHOTO_NOT_FOUND', message: 'Photo record not found' },
      });
    }

    memoryPhotos[index] = {
      ...memoryPhotos[index],
      ...(category && { category }),
      ...(caption !== undefined && { caption }),
      ...(tags && { tags }),
      ...(isPublic !== undefined && { isPublic }),
      updatedAt: new Date().toISOString(),
    };

    return res.status(200).json({
      success: true,
      data: memoryPhotos[index],
      message: 'Photo updated successfully (Dev Memory)',
    });
  } catch (error) {
    console.error('Update Photo Error:', error);
    return res.status(500).json({
      success: false,
      error: { code: 'PHOTO_UPDATE_FAILED', message: 'Failed to update photo' },
    });
  }
};

/**
 * @desc Delete photo record
 * @route DELETE /api/v1/weddings/:weddingId/photos/:photoId
 * @access Private
 */
exports.deletePhoto = async (req, res) => {
  try {
    const { photoId } = req.params;

    if (mongoose.connection.readyState === 1) {
      const deletedPhoto = await Photo.findByIdAndDelete(photoId);
      if (!deletedPhoto) {
        return res.status(404).json({
          success: false,
          error: { code: 'PHOTO_NOT_FOUND', message: 'Photo record not found' },
        });
      }

      return res.status(200).json({
        success: true,
        data: {},
        message: 'Photo deleted successfully',
      });
    }

    // Dev Memory Fallback
    const initialLen = memoryPhotos.length;
    memoryPhotos = memoryPhotos.filter((p) => p._id !== photoId);

    if (memoryPhotos.length === initialLen) {
      return res.status(404).json({
        success: false,
        error: { code: 'PHOTO_NOT_FOUND', message: 'Photo record not found' },
      });
    }

    return res.status(200).json({
      success: true,
      data: {},
      message: 'Photo deleted successfully (Dev Memory)',
    });
  } catch (error) {
    console.error('Delete Photo Error:', error);
    return res.status(500).json({
      success: false,
      error: { code: 'PHOTO_DELETE_FAILED', message: 'Failed to delete photo' },
    });
  }
};

/**
 * @desc Toggle like on a photo
 * @route POST /api/v1/weddings/:weddingId/photos/:photoId/like
 * @access Private
 */
exports.toggleLikePhoto = async (req, res) => {
  try {
    const { photoId } = req.params;
    const userId = req.user?._id || req.user?.id || 'dev_user_id';

    if (mongoose.connection.readyState === 1) {
      const photo = await Photo.findById(photoId);
      if (!photo) {
        return res.status(404).json({
          success: false,
          error: { code: 'PHOTO_NOT_FOUND', message: 'Photo not found' },
        });
      }

      const hasLiked = photo.likedBy.includes(userId);
      if (hasLiked) {
        photo.likedBy = photo.likedBy.filter((id) => id.toString() !== userId.toString());
        photo.likesCount = Math.max(0, photo.likesCount - 1);
      } else {
        photo.likedBy.push(userId);
        photo.likesCount += 1;
      }

      await photo.save();

      return res.status(200).json({
        success: true,
        data: photo,
        message: hasLiked ? 'Unliked photo' : 'Liked photo',
      });
    }

    // Dev Memory Fallback
    const photo = memoryPhotos.find((p) => p._id === photoId);
    if (!photo) {
      return res.status(404).json({
        success: false,
        error: { code: 'PHOTO_NOT_FOUND', message: 'Photo not found' },
      });
    }

    if (!Array.isArray(photo.likedBy)) photo.likedBy = [];
    const hasLiked = photo.likedBy.includes(userId);

    if (hasLiked) {
      photo.likedBy = photo.likedBy.filter((id) => id !== userId);
      photo.likesCount = Math.max(0, (photo.likesCount || 0) - 1);
    } else {
      photo.likedBy.push(userId);
      photo.likesCount = (photo.likesCount || 0) + 1;
    }

    return res.status(200).json({
      success: true,
      data: photo,
      message: hasLiked ? 'Unliked photo' : 'Liked photo',
    });
  } catch (error) {
    console.error('Toggle Like Error:', error);
    return res.status(500).json({
      success: false,
      error: { code: 'PHOTO_LIKE_FAILED', message: 'Failed to toggle photo like' },
    });
  }
};
