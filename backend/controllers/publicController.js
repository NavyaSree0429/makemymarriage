const Wedding = require('../models/Wedding');
const Event = require('../models/Event');
const Photo = require('../models/Photo');
const mongoose = require('mongoose');

/**
 * @desc Get public wedding details by slug (Unauthenticated Endpoint for Guests)
 * @route GET /api/v1/public/weddings/:slug
 * @access Public
 */
exports.getPublicWeddingBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    if (mongoose.connection.readyState === 1) {
      const wedding = await Wedding.findOne({ slug: slug.toLowerCase() });

      if (!wedding) {
        return res.status(404).json({
          success: false,
          error: { code: 'WEDDING_NOT_FOUND', message: 'Public wedding portal not found for this URL slug' },
        });
      }

      // Fetch public events and photos
      const events = await Event.find({ weddingId: wedding._id }).sort({ date: 1, startTime: 1 });
      const photos = await Photo.find({ wedding: wedding._id, isPublic: true }).sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        data: {
          wedding,
          events,
          photos,
        },
      });
    }

    // Dev Memory Fallback
    const mockWedding = {
      _id: 'wed_public_mock_1',
      slug: slug.toLowerCase(),
      partnerNames: {
        partner1: 'Virat',
        partner2: 'Anushka',
      },
      weddingDate: '2026-12-31T00:00:00.000Z',
      primaryLocation: {
        venueName: 'Udaipur City Palace',
        city: 'Udaipur, Rajasthan',
        googleMapsUrl: 'https://maps.google.com',
      },
      welcomeMessage:
        'Welcome to our royal wedding portal! We are overjoyed to share this magical milestone of our lives with our beloved family and friends.',
      loveStory:
        'Two hearts, two souls, one eternal promise. From quiet beginnings to a lifetime of shared dreams and sacred vows under the palace lights.',
      liveStreamUrl: 'https://www.youtube.com/embed/5qap5aO4i9A',
      isPublicWebsiteEnabled: true,
      rsvpToken: 'rsvp_public_demo_token',
    };

    const mockEvents = [
      {
        _id: 'evt_pub_1',
        name: 'Haldi & Chooda Ceremony 🌼',
        eventType: 'HALDI',
        date: '2026-12-29',
        startTime: '10:00 AM',
        endTime: '01:00 PM',
        location: { venueName: 'Palace Garden Courtyard', city: 'Udaipur', googleMapsUrl: 'https://maps.google.com' },
        dressCode: 'Pastel Yellow Traditional',
        description: 'Turmeric laughter & joyful blessing rituals with traditional folk music.',
      },
      {
        _id: 'evt_pub_2',
        name: 'Royal Sangeet & Musical Night 💃',
        eventType: 'SANGEET',
        date: '2026-12-29',
        startTime: '07:00 PM',
        endTime: '11:30 PM',
        location: { venueName: 'Crystal Ballroom', city: 'Udaipur', googleMapsUrl: 'https://maps.google.com' },
        dressCode: 'Indo-Western Glam & Sparkles',
        description: 'Grand musical dance performances under royal crystal chandeliers.',
      },
      {
        _id: 'evt_pub_3',
        name: 'Sacred Pheras & Wedding Vows 💍',
        eventType: 'WEDDING',
        date: '2026-12-30',
        startTime: '04:00 PM',
        endTime: '08:00 PM',
        location: { venueName: 'Golden Mandap Pavilion', city: 'Udaipur', googleMapsUrl: 'https://maps.google.com' },
        dressCode: 'Royal Traditional Wear',
        description: 'Sacred wedding vows around the holy fire as sun sets over Lake Pichola.',
      },
      {
        _id: 'evt_pub_4',
        name: 'Grand Reception Banquet 🥂',
        eventType: 'RECEPTION',
        date: '2026-12-31',
        startTime: '08:00 PM',
        endTime: '01:00 AM',
        location: { venueName: 'Grand Palace Lawns', city: 'Udaipur', googleMapsUrl: 'https://maps.google.com' },
        dressCode: 'Formal Black Tie & Couture',
        description: 'Celebratory banquet, fireworks display, and new year toast.',
      },
    ];

    const mockPhotos = [
      {
        _id: 'ph_pub_1',
        category: 'WEDDING',
        imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
        caption: 'Sacred pheras around the holy fire under golden mandap lights 💍',
        uploaderName: 'Anushka Sharma',
        likesCount: 24,
      },
      {
        _id: 'ph_pub_2',
        category: 'HALDI',
        imageUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
        caption: 'Joyous turmeric laughter with family during Haldi ceremony 🌼',
        uploaderName: 'Virat Kohli',
        likesCount: 38,
      },
      {
        _id: 'ph_pub_3',
        category: 'SANGEET',
        imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
        caption: 'Grand musical night performance with royal chandelier backdrop 💃🎵',
        uploaderName: 'Karan Johar',
        likesCount: 45,
      },
    ];

    return res.status(200).json({
      success: true,
      data: {
        wedding: mockWedding,
        events: mockEvents,
        photos: mockPhotos,
      },
    });
  } catch (error) {
    console.error('Public Wedding Fetch Error:', error);
    return res.status(500).json({
      success: false,
      error: { code: 'PUBLIC_WEDDING_FETCH_FAILED', message: 'Failed to load public wedding portal' },
    });
  }
};
