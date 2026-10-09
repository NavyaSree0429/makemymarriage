import React, { useState } from 'react';

const PRESET_PHOTOS = [
  {
    label: 'Haldi Ceremony 🌼',
    category: 'HALDI',
    url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
    caption: 'Turmeric laughter & joyful blessing rituals 🌼',
  },
  {
    label: 'Mehendi & Henna 🌿',
    category: 'MEHENDI',
    url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
    caption: 'Intricate bridal henna design under marigold flowers 🌿',
  },
  {
    label: 'Sangeet Dance 💃',
    category: 'SANGEET',
    url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
    caption: 'High-energy musical dance night with royal chandeliers 💃',
  },
  {
    label: 'Mandap Pheras 💍',
    category: 'WEDDING',
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    caption: 'Sacred pheras around the holy fire under golden mandap 💍',
  },
  {
    label: 'Palace Reception 🥂',
    category: 'RECEPTION',
    url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80',
    caption: 'Grand banquet entrance under fireworks and applause 🥂',
  },
];

export default function PhotoUploadModal({ isOpen, onClose, onSave, loading = false }) {
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState('GENERAL');
  const [caption, setCaption] = useState('');
  const [tags, setTags] = useState('');

  if (!isOpen) return null;

  const handleSelectPreset = (preset) => {
    setImageUrl(preset.url);
    setCategory(preset.category);
    setCaption(preset.caption);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!imageUrl.trim()) return;

    const tagList = tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    onSave({
      imageUrl: imageUrl.trim(),
      category,
      caption: caption.trim(),
      tags: tagList,
      isPublic: true,
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#0F172A] border border-[#B76E79]/40 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#B76E79]/20 via-[#1E293B] to-[#0F172A] border-b border-[#B76E79]/30">
          <h3 className="text-lg font-serif font-bold text-[#F3E5AB]">
            📸 Add Wedding Memory Photo
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-800"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Quick Presets Picker */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#B76E79] font-bold mb-2">
              ⚡ Quick Sample Presets (Click to Auto-fill):
            </label>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_PHOTOS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPreset(p)}
                  className="px-2.5 py-1 rounded-lg bg-gray-900 border border-gray-700 hover:border-[#B76E79] text-xs font-medium text-gray-300 transition"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Image URL Input */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#B76E79] font-bold mb-1">
              Image URL *
            </label>
            <input
              type="url"
              required
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full bg-gray-900/80 border border-gray-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#B76E79] transition font-mono text-xs"
            />
          </div>

          {/* Image Preview Box */}
          {imageUrl && (
            <div className="relative h-44 rounded-xl overflow-hidden border border-gray-700 bg-gray-950">
              <img
                src={imageUrl}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80';
                }}
              />
              <span className="absolute bottom-2 left-2 px-2.5 py-1 rounded-md bg-black/70 text-xs text-[#F3E5AB] border border-gray-700 backdrop-blur-sm">
                Image Preview
              </span>
            </div>
          )}

          {/* Category Dropdown */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#B76E79] font-bold mb-1">
              Ceremony Album / Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-gray-900/80 border border-gray-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#B76E79]"
            >
              <option value="GENERAL">General Gallery 📷</option>
              <option value="HALDI">Haldi Ceremony 🌼</option>
              <option value="MEHENDI">Mehendi & Henna 🌿</option>
              <option value="SANGEET">Sangeet & Dance 💃</option>
              <option value="WEDDING">Pheras & Wedding 💍</option>
              <option value="RECEPTION">Reception Banquet 🥂</option>
            </select>
          </div>

          {/* Caption */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#B76E79] font-bold mb-1">
              Caption & Description
            </label>
            <textarea
              rows={2}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Describe this cherished moment..."
              className="w-full bg-gray-900/80 border border-gray-700 rounded-xl p-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#B76E79]"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#B76E79] font-bold mb-1">
              Tags (Comma separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g., Mandap, Pheras, Vows, Royal"
              className="w-full bg-gray-900/80 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#B76E79]"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-[#B76E79] to-[#D4AF37] text-white text-xs font-bold shadow-lg hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? 'Uploading...' : 'Save Memory'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
