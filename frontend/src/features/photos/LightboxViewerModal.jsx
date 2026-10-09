import React, { useEffect } from 'react';

export default function LightboxViewerModal({
  isOpen,
  photos = [],
  currentIndex = 0,
  onClose,
  onPrev,
  onNext,
  onToggleLike,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onPrev, onNext, onClose]);

  if (!isOpen || !photos || photos.length === 0) return null;

  const currentPhoto = photos[currentIndex] || photos[0];

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

  const handleDownload = () => {
    if (!currentPhoto.imageUrl) return;
    const a = document.createElement('a');
    a.href = currentPhoto.imageUrl;
    a.target = '_blank';
    a.download = `wedding_memory_${currentPhoto._id}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 backdrop-blur-xl animate-fadeIn">
      {/* Top Header Actions */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-[#B76E79]/20 text-[#F3E5AB] border border-[#B76E79]/40 text-xs font-bold">
            {getCategoryBadge(currentPhoto.category)}
          </span>
          <span className="text-xs text-gray-400 font-mono">
            {currentIndex + 1} of {photos.length}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onToggleLike(currentPhoto._id)}
            className="px-3.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            ❤️ <span>{currentPhoto.likesCount || 0}</span>
          </button>

          <button
            onClick={handleDownload}
            className="px-3.5 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white text-xs font-semibold flex items-center gap-1.5 transition"
          >
            ⬇️ <span>Download HD</span>
          </button>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-gray-900 border border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800 transition flex items-center justify-center font-bold"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Prev Arrow */}
      {photos.length > 1 && (
        <button
          onClick={onPrev}
          className="absolute left-4 z-20 w-12 h-12 rounded-full bg-black/60 hover:bg-black/90 border border-gray-700 text-white flex items-center justify-center text-xl transition shadow-xl"
        >
          ‹
        </button>
      )}

      {/* Main Image Container */}
      <div className="max-w-5xl max-h-[80vh] p-4 flex flex-col items-center justify-center z-10">
        <img
          src={currentPhoto.imageUrl}
          alt={currentPhoto.caption || 'Wedding Memory'}
          className="max-w-full max-h-[72vh] object-contain rounded-xl shadow-2xl border border-gray-800"
        />

        {/* Caption Overlay Bar */}
        {(currentPhoto.caption || currentPhoto.uploaderName) && (
          <div className="mt-4 text-center max-w-2xl bg-gray-900/80 border border-gray-800 rounded-xl px-6 py-3 backdrop-blur-md">
            {currentPhoto.caption && (
              <p className="text-sm font-serif font-semibold text-white leading-relaxed">
                "{currentPhoto.caption}"
              </p>
            )}
            <div className="flex items-center justify-center gap-3 mt-1.5 text-xs text-gray-400">
              <span>👤 {currentPhoto.uploaderName || 'Wedding Guest'}</span>
              <span>•</span>
              <span>📅 {new Date(currentPhoto.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </div>
        )}
      </div>

      {/* Next Arrow */}
      {photos.length > 1 && (
        <button
          onClick={onNext}
          className="absolute right-4 z-20 w-12 h-12 rounded-full bg-black/60 hover:bg-black/90 border border-gray-700 text-white flex items-center justify-center text-xl transition shadow-xl"
        >
          ›
        </button>
      )}
    </div>
  );
}
