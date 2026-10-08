import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { createEventApi, updateEventApi } from '../../services/eventService';
import { Calendar, Clock, MapPin, Video, Sparkles, X, Check, AlertCircle, ArrowRight, Tag, AlignLeft } from 'lucide-react';

const EVENT_PRESETS = [
  { type: 'HALDI', title: 'Haldi & Phoolon Ki Holi', emoji: '💛', defaultDress: 'Pastel Yellow Ethnic' },
  { type: 'MEHENDI', title: 'Mehendi Ceremony', emoji: '💚', defaultDress: 'Floral & Green Ethnic' },
  { type: 'SANGEET', title: 'Sangeet & Dance Night', emoji: '🎵', defaultDress: 'Royal Emerald & Gold Glamour' },
  { type: 'WEDDING', title: 'Wedding Ceremony & Pheras', emoji: '💍', defaultDress: 'Traditional Royal Couture' },
  { type: 'RECEPTION', title: 'Grand Reception & Dinner', emoji: '🎉', defaultDress: 'Black Tie & Evening Velvet' },
  { type: 'COCKTAIL', title: 'Cocktail & Sundowner', emoji: '🥂', defaultDress: 'Western Cocktail Chic' },
  { type: 'CUSTOM', title: 'Special Ceremony', emoji: '✨', defaultDress: 'Festive Ethnic' },
];

export default function EventManagementModal({ isOpen, onClose, weddingId, existingEvent = null, onRefresh }) {
  const { accessToken } = useAuth();
  const isEdit = !!existingEvent;

  const [title, setTitle] = useState('');
  const [eventType, setEventType] = useState('HALDI');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('10:00 AM');
  const [endTime, setEndTime] = useState('02:00 PM');
  const [venueName, setVenueName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');
  const [dressCode, setDressCode] = useState('');
  const [description, setDescription] = useState('');
  const [liveStreamUrl, setLiveStreamUrl] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (existingEvent) {
      setTitle(existingEvent.title || '');
      setEventType(existingEvent.eventType || 'CUSTOM');
      setDate(existingEvent.date ? new Date(existingEvent.date).toISOString().split('T')[0] : '');
      setStartTime(existingEvent.startTime || '10:00 AM');
      setEndTime(existingEvent.endTime || '02:00 PM');
      setVenueName(existingEvent.location?.venueName || '');
      setAddress(existingEvent.location?.address || '');
      setCity(existingEvent.location?.city || '');
      setGoogleMapsUrl(existingEvent.location?.googleMapsUrl || '');
      setDressCode(existingEvent.dressCode || '');
      setDescription(existingEvent.description || '');
      setLiveStreamUrl(existingEvent.liveStreamUrl || '');
    } else {
      // Default to Haldi
      applyPreset(EVENT_PRESETS[0]);
      setDate(new Date().toISOString().split('T')[0]);
    }
  }, [existingEvent, isOpen]);

  if (!isOpen) return null;

  function applyPreset(preset) {
    setEventType(preset.type);
    setTitle(preset.title);
    if (!dressCode) setDressCode(preset.defaultDress);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    const payload = {
      title,
      eventType,
      date,
      startTime,
      endTime,
      location: {
        venueName,
        address,
        city,
        googleMapsUrl,
      },
      dressCode,
      description,
      liveStreamUrl,
    };

    try {
      if (isEdit) {
        await updateEventApi(accessToken, weddingId, existingEvent._id, payload);
        setSuccessMsg('Ceremony event updated successfully!');
      } else {
        await createEventApi(accessToken, weddingId, payload);
        setSuccessMsg('New ceremony function added to wedding itinerary!');
      }

      if (onRefresh) onRefresh();
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save event ceremony.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-2xl shadow-rose-950/40 my-8">
        {/* Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-rose-500/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-300 text-xs font-semibold mb-2 border border-rose-500/20">
            <Calendar className="w-3.5 h-3.5 text-amber-300" />
            <span>Itinerary Management</span>
          </div>
          <h3 className="font-serif text-2xl font-bold bg-gradient-to-r from-rose-200 via-rose-300 to-amber-200 bg-clip-text text-transparent">
            {isEdit ? 'Edit Ceremony Function' : 'Schedule New Ceremony'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Add timeline schedules, map links, dress codes, and live streams for your wedding functions.
          </p>
        </div>

        {/* Alerts */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Quick Presets Bar */}
          {!isEdit && (
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-300">Quick Function Presets</label>
              <div className="flex flex-wrap gap-1.5">
                {EVENT_PRESETS.map((preset) => (
                  <button
                    key={preset.type}
                    type="button"
                    onClick={() => applyPreset(preset)}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold border transition ${
                      eventType === preset.type
                        ? 'bg-rose-500/20 border-rose-500 text-rose-200'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {preset.emoji} {preset.type}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Title & Type */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1">Ceremony Title</label>
              <input
                type="text"
                required
                placeholder="Haldi & Phoolon Ki Holi"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2 px-2.5 text-xs text-rose-300 focus:outline-none focus:border-rose-500 font-semibold"
              >
                <option value="HALDI">💛 HALDI</option>
                <option value="MEHENDI">💚 MEHENDI</option>
                <option value="SANGEET">🎵 SANGEET</option>
                <option value="WEDDING">💍 WEDDING</option>
                <option value="RECEPTION">🎉 RECEPTION</option>
                <option value="COCKTAIL">🥂 COCKTAIL</option>
                <option value="CUSTOM">✨ CUSTOM</option>
              </select>
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Event Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-100 focus:outline-none focus:border-rose-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Start Time</label>
              <input
                type="text"
                placeholder="10:00 AM"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-100 focus:outline-none focus:border-rose-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">End Time</label>
              <input
                type="text"
                placeholder="02:00 PM"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-100 focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          {/* Location Details */}
          <div className="space-y-2 pt-1 border-t border-slate-800/80">
            <span className="text-[11px] font-semibold text-amber-300 uppercase tracking-wider block">
              📍 Venue & Location Details
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <input
                  type="text"
                  placeholder="Venue Name (e.g. The Leela Palace Ballroom)"
                  value={venueName}
                  onChange={(e) => setVenueName(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="City (e.g. Udaipur, Rajasthan)"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <input
                  type="text"
                  placeholder="Full Address / Landmark"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
              </div>
              <div>
                <input
                  type="url"
                  placeholder="Google Maps URL (e.g. https://maps.google.com/...)"
                  value={googleMapsUrl}
                  onChange={(e) => setGoogleMapsUrl(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>
          </div>

          {/* Dress Code & Virtual Stream */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center space-x-1">
                <Tag className="w-3 h-3 text-rose-400" />
                <span>Dress Code Tag</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Royal Emerald & Gold Glamour"
                value={dressCode}
                onChange={(e) => setDressCode(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center space-x-1">
                <Video className="w-3 h-3 text-sky-400" />
                <span>YouTube / Zoom Live Stream URL</span>
              </label>
              <input
                type="url"
                placeholder="https://youtube.com/live/..."
                value={liveStreamUrl}
                onChange={(e) => setLiveStreamUrl(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          {/* Description / Instructions */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Ceremony Instructions & Notes for Guests</label>
            <textarea
              rows={2}
              placeholder="e.g. Join us for haldi application by the pool followed by lunch."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 hover:from-rose-600 hover:to-amber-600 font-semibold text-white text-xs shadow-lg shadow-rose-500/25 transition flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <span>{loading ? 'Saving Function...' : isEdit ? 'Update Ceremony Event' : 'Save & Publish Ceremony Event'}</span>
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </div>
  );
}
