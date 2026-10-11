import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import CountdownTimer from '../components/CountdownTimer';
import LightboxViewerModal from '../features/photos/LightboxViewerModal';
import { getPublicWeddingApi } from '../services/publicService';

import {
  Heart, Calendar, MapPin, Video, CheckCircle, Copy, Share2, ExternalLink, Sparkles, Volume2, ShieldCheck, Check
} from 'lucide-react';

export default function PublicWeddingPage() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // Lightbox State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    fetchPublicWedding();
  }, [slug]);

  const fetchPublicWedding = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await getPublicWeddingApi(slug || 'virat-anushka');
      setData(res.data);
    } catch (err) {
      setError(err.message || 'Failed to load wedding portal');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center text-white">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-3 border-[#B76E79] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-serif text-[#F3E5AB] text-lg font-bold">Loading Royal Wedding Portal...</p>
        </div>
      </div>
    );
  }

  if (error || !data?.wedding) {
    return (
      <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center p-4 text-white">
        <div className="max-w-md w-full bg-[#111827] border border-rose-500/30 rounded-3xl p-8 text-center space-y-4 shadow-2xl">
          <span className="text-4xl block">💍</span>
          <h2 className="font-serif text-2xl font-bold text-slate-100">Wedding Portal Not Found</h2>
          <p className="text-xs text-slate-400">{error || 'This wedding website slug does not exist or has been disabled by the host.'}</p>
          <Link
            to="/"
            className="inline-block px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white text-xs font-bold transition shadow-lg"
          >
            Go to Home Page
          </Link>
        </div>
      </div>
    );
  }

  const { wedding, events = [], photos = [] } = data;
  const partner1 = wedding.partnerNames?.partner1 || 'Partner 1';
  const partner2 = wedding.partnerNames?.partner2 || 'Partner 2';
  const rsvpUrl = wedding.rsvpToken ? `/rsvp/${wedding.rsvpToken}` : '#';

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 selection:bg-rose-500 selection:text-white flex flex-col justify-between">
      {/* 1. Public Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-[#0B0F19]/80 backdrop-blur-xl border-b border-[#B76E79]/20">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#B76E79] to-[#D4AF37] flex items-center justify-center font-bold text-white shadow-md text-sm">
              💍
            </div>
            <span className="font-serif text-lg font-bold bg-gradient-to-r from-[#F3E5AB] via-white to-[#B76E79] bg-clip-text text-transparent">
              MakeMyMarriage
            </span>
          </Link>

          {/* Quick Nav Anchors */}
          <nav className="hidden md:flex items-center space-x-6 text-xs font-semibold text-slate-300">
            <a href="#story" className="hover:text-[#F3E5AB] transition">Our Story</a>
            <a href="#itinerary" className="hover:text-[#F3E5AB] transition">Ceremonies</a>
            <a href="#livestream" className="hover:text-[#F3E5AB] transition">Live Stream</a>
            {photos.length > 0 && <a href="#gallery" className="hover:text-[#F3E5AB] transition">Gallery</a>}
          </nav>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleCopyLink}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition text-xs flex items-center space-x-1.5"
              title="Copy Website Link"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-amber-400" />}
              <span className="hidden sm:inline">{copied ? 'Copied!' : 'Share Website'}</span>
            </button>

            <Link
              to={rsvpUrl}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#B76E79] to-[#D4AF37] hover:opacity-90 text-white font-bold text-xs shadow-lg transition"
            >
              Confirm RSVP
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 space-y-16 py-8">
        {/* 2. Royal Hero Banner Section */}
        <section className="relative max-w-6xl mx-auto px-4 lg:px-8">
          <div className="relative bg-gradient-to-br from-slate-900 via-[#111827] to-[#1E1B4B]/60 backdrop-blur-2xl border border-[#B76E79]/30 rounded-3xl p-8 lg:p-12 shadow-2xl text-center space-y-6 overflow-hidden">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#B76E79]/15 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#F3E5AB]/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#B76E79]/20 text-[#F3E5AB] border border-[#B76E79]/40 text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Royal Wedding Celebration</span>
            </div>

            <div className="space-y-2 max-w-3xl mx-auto">
              <h1 className="font-serif text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
                {partner1} <span className="text-[#B76E79] font-sans font-light">&amp;</span> {partner2}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto font-light leading-relaxed">
                Together with their families, invite you to celebrate their sacred union under the royal palace lights.
              </p>
            </div>

            {/* Date & Venue Pill */}
            <div className="inline-flex flex-wrap items-center justify-center gap-3 bg-black/40 border border-slate-800 rounded-2xl px-5 py-2.5 text-xs text-slate-200">
              <span className="flex items-center space-x-1.5 text-[#F3E5AB] font-semibold">
                <Calendar className="w-4 h-4 text-[#B76E79]" />
                <span>
                  {wedding.weddingDate ? new Date(wedding.weddingDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Date TBD'}
                </span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1.5 text-emerald-300">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>{wedding.primaryLocation?.venueName || 'Venue TBD'}, {wedding.primaryLocation?.city || 'City TBD'}</span>
              </span>
            </div>

            {/* Live Ticking Countdown Clock */}
            <div className="pt-2 max-w-2xl mx-auto">
              <CountdownTimer targetDate={wedding.weddingDate} />
            </div>
          </div>
        </section>

        {/* 3. Couple Love Story & Welcome Note */}
        <section id="story" className="max-w-4xl mx-auto px-4 lg:px-8">
          <div className="bg-[#111827]/90 border border-gray-800 rounded-3xl p-8 backdrop-blur-xl shadow-xl space-y-4 text-center">
            <span className="text-3xl block">💖</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">Our Story & Welcome Note</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl mx-auto">
              {wedding.welcomeMessage || 'Welcome to our royal wedding portal! We are overjoyed to share this magical milestone of our lives with our beloved family and friends.'}
            </p>
            {wedding.loveStory && (
              <div className="pt-2 border-t border-gray-800/80">
                <blockquote className="font-serif italic text-xs text-[#F3E5AB] max-w-xl mx-auto">
                  "{wedding.loveStory}"
                </blockquote>
              </div>
            )}
          </div>
        </section>

        {/* 4. Multi-Ceremony Itinerary Timeline */}
        <section id="itinerary" className="max-w-5xl mx-auto px-4 lg:px-8 space-y-6">
          <div className="text-center space-y-1">
            <span className="text-xs uppercase tracking-widest text-[#B76E79] font-bold">Sacred Ceremonies</span>
            <h2 className="font-serif text-3xl font-bold text-white">Multi-Event Itinerary</h2>
            <p className="text-xs text-gray-400">Join us for every auspicious function throughout our wedding celebrations</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((evt) => (
              <div
                key={evt._id}
                className="bg-[#111827]/90 border border-gray-800 hover:border-[#B76E79]/40 rounded-2xl p-6 backdrop-blur-xl shadow-xl space-y-4 transition flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-serif font-bold text-lg text-white">{evt.name}</h3>
                    <span className="px-2.5 py-1 rounded-full bg-[#B76E79]/20 text-[#F3E5AB] border border-[#B76E79]/40 text-[10px] font-bold">
                      {evt.eventType || 'CEREMONY'}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-gray-300 font-medium">
                    <p className="flex items-center space-x-2 text-rose-300">
                      <Calendar className="w-3.5 h-3.5 text-rose-400" />
                      <span>{evt.date} • {evt.startTime} - {evt.endTime}</span>
                    </p>
                    <p className="flex items-center space-x-2 text-emerald-300">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{evt.location?.venueName || 'Venue'}, {evt.location?.city || 'City'}</span>
                    </p>
                  </div>

                  {evt.description && (
                    <p className="text-xs text-gray-400 leading-relaxed pt-1">
                      {evt.description}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-gray-800 flex items-center justify-between gap-2 text-xs">
                  {evt.dressCode ? (
                    <span className="px-2.5 py-1 rounded-lg bg-gray-900 text-amber-300 border border-gray-800 text-[11px]">
                      👗 {evt.dressCode}
                    </span>
                  ) : <span />}

                  {evt.location?.googleMapsUrl && (
                    <a
                      href={evt.location.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold transition flex items-center space-x-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Google Maps</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Virtual Live Stream Broadcast Hub */}
        <section id="livestream" className="max-w-5xl mx-auto px-4 lg:px-8">
          <div className="bg-[#111827]/90 border border-[#B76E79]/40 rounded-3xl p-6 lg:p-8 backdrop-blur-xl shadow-2xl space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-800">
              <div>
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold mb-1">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  <span>🔴 VIRTUAL LIVE BROADCAST</span>
                </div>
                <h2 className="font-serif text-2xl font-bold text-white">Live Ceremonies Stream Hub</h2>
                <p className="text-xs text-gray-400">For our beloved friends &amp; family joining remotely across the globe</p>
              </div>

              <div className="flex items-center space-x-2 text-xs text-emerald-400 font-semibold">
                <Video className="w-4 h-4 text-emerald-400" />
                <span>HD Live Stream Active</span>
              </div>
            </div>

            {/* Embedded Video Player Viewport */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-gray-800 shadow-2xl">
              {wedding.liveStreamUrl ? (
                <iframe
                  src={wedding.liveStreamUrl}
                  title="Wedding Virtual Live Stream"
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-300 space-y-3">
                  <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center justify-center text-2xl">
                    📹
                  </div>
                  <div className="space-y-1 max-w-md">
                    <h3 className="font-serif font-bold text-lg text-white">Wedding Pheras Live Broadcast</h3>
                    <p className="text-xs text-slate-400">
                      The live stream video feed will broadcast here live during the main Pheras and Reception ceremonies.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 6. Public Photo Gallery Section */}
        {photos.length > 0 && (
          <section id="gallery" className="max-w-5xl mx-auto px-4 lg:px-8 space-y-6">
            <div className="text-center space-y-1">
              <span className="text-xs uppercase tracking-widest text-[#B76E79] font-bold">Wedding Memories</span>
              <h2 className="font-serif text-3xl font-bold text-white">Public Photo Gallery</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {photos.map((photo, idx) => (
                <div
                  key={photo._id || idx}
                  onClick={() => {
                    setLightboxIndex(idx);
                    setLightboxOpen(true);
                  }}
                  className="group relative h-56 rounded-2xl overflow-hidden border border-gray-800 cursor-pointer shadow-lg bg-gray-950"
                >
                  <img
                    src={photo.imageUrl}
                    alt={photo.caption || 'Memory'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                    <p className="text-xs font-semibold text-white truncate">{photo.caption || 'Royal Memory'}</p>
                    <span className="text-[10px] text-[#F3E5AB]">👤 {photo.uploaderName || 'Host'}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 7. Digital RSVP CTA Banner */}
        <section className="max-w-4xl mx-auto px-4 lg:px-8">
          <div className="bg-gradient-to-r from-rose-950/60 via-slate-900 to-amber-950/60 border border-[#B76E79]/40 rounded-3xl p-8 text-center space-y-4 shadow-2xl backdrop-blur-xl">
            <span className="text-3xl block">💌</span>
            <div className="space-y-1 max-w-md mx-auto">
              <h2 className="font-serif text-2xl font-bold text-white">Are You Joining Our Celebrations?</h2>
              <p className="text-xs text-slate-300">
                Please confirm your attendance, party count, and dietary preferences so we can welcome you warmly.
              </p>
            </div>
            <Link
              to={rsvpUrl}
              className="inline-block px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#B76E79] via-rose-600 to-[#D4AF37] hover:opacity-95 text-white font-bold text-xs shadow-xl transition"
            >
              Respond to Digital RSVP
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#0A0E18] border-t border-gray-900 py-8 text-center space-y-2 text-xs text-gray-500">
        <p className="font-serif text-sm font-bold text-slate-300">
          {partner1} &amp; {partner2}'s Royal Wedding
        </p>
        <p>© 2026 MakeMyMarriage Centralized Wedding Platform</p>
      </footer>

      {/* Lightbox Modal */}
      {photos.length > 0 && (
        <LightboxViewerModal
          isOpen={lightboxOpen}
          photos={photos}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
          onPrev={() => setLightboxIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1))}
          onNext={() => setLightboxIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0))}
          onToggleLike={() => {}}
        />
      )}
    </div>
  );
}
