import React, { useState } from 'react';

export default function PhotoGalleryWidget({
  photos = [],
  loading = false,
  onUploadPhoto,
  onOpenLightbox,
  onToggleLike,
  onDeletePhoto,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL');

  // Stats
  const totalPhotosCount = photos.length;
  const categoriesCount = new Set(photos.map((p) => p.category)).size;
  const contributorsCount = new Set(photos.map((p) => p.uploaderName)).size || 1;

  // Filter logic
  const filteredPhotos = photos.filter((p) => {
    const matchesSearch =
      (p.caption || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.uploaderName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.tags || []).some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = activeCategory === 'ALL' || p.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  const getCategoryBadge = (cat) => {
    switch (cat) {
      case 'HALDI':
        return '🌼 Haldi';
      case 'MEHENDI':
        return '🌿 Mehendi';
      case 'SANGEET':
        return '💃 Sangeet';
      case 'WEDDING':
        return '💍 Wedding';
      case 'RECEPTION':
        return '🥂 Reception';
      default:
        return '📷 General';
    }
  };

  const handleDownloadSingle = (e, photo) => {
    e.stopPropagation();
    const a = document.createElement('a');
    a.href = photo.imageUrl;
    a.target = '_blank';
    a.download = `wedding_memory_${photo._id}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="bg-[#111827]/80 border border-[#B76E79]/30 rounded-2xl p-6 backdrop-blur-xl shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-800">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#B76E79] font-bold">Memories Workspace</span>
          <h2 className="text-2xl font-serif font-bold text-white mt-0.5">Private Photo Gallery & Ceremony Albums</h2>
          <p className="text-xs text-gray-400 mt-1">Preserve and relive your sacred wedding moments across all ceremonies in high definition.</p>
        </div>
        <button
          onClick={onUploadPhoto}
          className="self-start md:self-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#B76E79] to-[#D4AF37] text-white font-bold text-xs shadow-lg hover:opacity-95 transition flex items-center gap-2"
        >
          <span>📸</span> + Upload Photos
        </button>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#0B0F19]/90 border border-gray-800 rounded-xl p-4">
          <span className="text-gray-400 text-xs block mb-1">Total Memories</span>
          <span className="text-[#F3E5AB] font-bold text-lg">{totalPhotosCount} Photos</span>
        </div>

        <div className="bg-[#0B0F19]/90 border border-gray-800 rounded-xl p-4">
          <span className="text-blue-400 text-xs block mb-1">Albums Created</span>
          <span className="text-blue-300 font-bold text-lg">{categoriesCount} Ceremonies</span>
        </div>

        <div className="bg-[#0B0F19]/90 border border-emerald-500/30 rounded-xl p-4">
          <span className="text-emerald-400 text-xs block mb-1">Storage Used</span>
          <span className="text-emerald-300 font-bold text-lg">{(totalPhotosCount * 2.4).toFixed(1)} MB</span>
        </div>

        <div className="bg-[#0B0F19]/90 border border-amber-500/30 rounded-xl p-4">
          <span className="text-amber-400 text-xs block mb-1">Contributors</span>
          <span className="text-amber-300 font-bold text-lg">{contributorsCount} Photographers</span>
        </div>
      </div>

      {/* Category Pills & Search Toolbar */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔍</span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search photos by caption, ceremony tag, or photographer..."
            className="w-full bg-gray-900/70 border border-gray-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#B76E79]"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1">
          {[
            { id: 'ALL', label: 'All Memories' },
            { id: 'HALDI', label: '🌼 Haldi' },
            { id: 'MEHENDI', label: '🌿 Mehendi' },
            { id: 'SANGEET', label: '💃 Sangeet' },
            { id: 'WEDDING', label: '💍 Wedding' },
            { id: 'RECEPTION', label: '🥂 Reception' },
            { id: 'GENERAL', label: '📷 General' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition whitespace-nowrap ${
                activeCategory === cat.id
                  ? 'bg-[#B76E79] border-[#B76E79] text-white shadow-md'
                  : 'bg-gray-900/60 border-gray-800 text-gray-400 hover:border-gray-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Photo Gallery Grid */}
      {loading ? (
        <div className="text-center py-12 text-gray-400 text-xs">
          <div className="w-8 h-8 border-2 border-[#B76E79] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          Loading gallery memories...
        </div>
      ) : filteredPhotos.length === 0 ? (
        <div className="text-center py-12 bg-gray-900/30 rounded-xl border border-dashed border-gray-800">
          <span className="text-3xl block mb-2">📸</span>
          <p className="text-sm font-semibold text-gray-300">No photos in this album yet</p>
          <p className="text-xs text-gray-500 mt-1">Click "+ Upload Photos" to add your first wedding memory!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {filteredPhotos.map((photo, index) => (
            <div
              key={photo._id}
              onClick={() => onOpenLightbox(index)}
              className="group relative bg-[#0B0F19] border border-gray-800 hover:border-[#B76E79]/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-[#B76E79]/20 cursor-pointer flex flex-col justify-between"
            >
              {/* Image Container */}
              <div className="relative h-56 overflow-hidden bg-gray-950">
                <img
                  src={photo.imageUrl}
                  alt={photo.caption || 'Wedding Photo'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Top Badge */}
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full bg-black/70 border border-gray-700 text-[#F3E5AB] text-[10px] font-bold backdrop-blur-md">
                    {getCategoryBadge(photo.category)}
                  </span>
                </div>

                {/* Hover Quick Actions */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={(e) => handleDownloadSingle(e, photo)}
                    className="p-1.5 rounded-lg bg-black/70 hover:bg-black text-white text-xs border border-gray-700 backdrop-blur-md"
                    title="Download Photo"
                  >
                    ⬇️
                  </button>
                  {onDeletePhoto && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeletePhoto(photo._id);
                      }}
                      className="p-1.5 rounded-lg bg-black/70 hover:bg-rose-900 text-rose-300 text-xs border border-gray-700 backdrop-blur-md"
                      title="Delete Photo"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>

              {/* Details & Actions Footer */}
              <div className="p-4 bg-gray-900/60 border-t border-gray-800 space-y-2">
                <p className="text-xs text-white font-medium line-clamp-2">
                  {photo.caption || 'Cherished wedding moment'}
                </p>

                <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1">
                  <span>👤 {photo.uploaderName || 'Wedding Guest'}</span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleLike(photo._id);
                    }}
                    className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 transition font-semibold"
                  >
                    ❤️ {photo.likesCount || 0}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
